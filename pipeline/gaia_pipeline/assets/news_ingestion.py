import os
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from dagster import asset, get_dagster_logger
from gaia_pipeline.resources import DatabaseResource

NEWS_SOURCES = {
    'Mongabay': ('https://mongabay.com/feed', 1),
    'Carbon Brief': ('https://www.carbonbrief.org/feed', 1),
    'Reuters Environment': ('https://feeds.reuters.com/reuters/environment', 1),
    'Guardian Environment': ('https://www.theguardian.com/environment/rss', 1),
    'Grist': ('https://grist.org/feed/', 2),
    'Inside Climate News': ('https://insideclimatenews.org/feed/', 2),
    'Yale E360': ('https://e360.yale.edu/feed', 2),
}

TIER_MAP = {
    'Mongabay': 1, 'Carbon Brief': 1, 'Reuters': 1, 'AP': 1, 'Guardian': 1,
    'Grist': 2, 'Inside Climate News': 2, 'Yale E360': 2, 'WRI': 2,
}

EVENT_KEYWORDS = {
    'fire': ['fire', 'wildfire', 'blaze', 'burning', 'burn'],
    'deforestation': ['deforest', 'forest loss', 'tree cover', 'logging', 'clearing', 'amazon'],
    'biodiversity': ['species', 'biodiversity', 'extinction', 'wildlife', 'ecosystem', 'habitat'],
    'air-quality': ['air quality', 'pollution', 'pm2.5', 'smog', 'particulate'],
    'ocean': ['ocean', 'coral', 'marine', 'sea level', 'reef', 'bleaching'],
    'climate': ['climate', 'temperature', 'drought', 'flood', 'storm', 'hurricane'],
    'water-stress': ['drought', 'water scarcity', 'river', 'aquifer', 'groundwater'],
}

def classify_article_tier(source_name: str) -> int:
    for key, tier in TIER_MAP.items():
        if key.lower() in source_name.lower():
            return tier
    return 3

def extract_event_types(text: str) -> list:
    text_lower = text.lower()
    return [
        event_type
        for event_type, keywords in EVENT_KEYWORDS.items()
        if any(kw in text_lower for kw in keywords)
    ]

def parse_rss_feed(xml_text: str, source_name: str, source_tier: int) -> list:
    articles = []
    try:
        root = ET.fromstring(xml_text)
        for item in root.findall('channel/item'):
            title = item.findtext('title', '') or ''
            desc = item.findtext('description', '') or ''
            link = item.findtext('link', '') or ''
            pub_date = item.findtext('pubDate', '') or ''

            articles.append({
                'title': title.strip(),
                'description': desc.strip(),
                'url': link.strip(),
                'published_at': pub_date,
                'source_name': source_name,
                'source_tier': source_tier,
                'content': f"{title}\n\n{desc}",
            })
    except ET.ParseError as e:
        import logging
        logging.getLogger(__name__).warning(f"Failed to parse RSS XML: {e}")
        pass
    return articles

@asset(
    description="Ingest and store environmental news from Tier 1 and 2 RSS feeds",
    group_name="news",
)
def news_embedding_asset(context, db: DatabaseResource) -> dict:
    import requests
    import hashlib
    import json

    logger = get_dagster_logger()

    conn = None
    embedded = 0

    try:
        conn = db.get_connection()
        for source_name, (feed_url, tier) in NEWS_SOURCES.items():
            try:
                resp = requests.get(feed_url, timeout=15)
                resp.raise_for_status()
                articles = parse_rss_feed(resp.text, source_name, tier)

                for article in articles[:10]:
                    content = article['content'][:4000]
                    if not article['url']:
                        logger.warning(f"Skipping article with no URL from {source_name}: {article['title'][:80]}")
                        continue
                    event_types = extract_event_types(content)
                    content_hash = hashlib.sha256(content.encode()).hexdigest()

                    with conn.cursor() as cur:
                        cur.execute(
                            "SELECT id FROM document_embeddings WHERE metadata->>'url' = %s",
                            (article['url'],)
                        )
                        if cur.fetchone():
                            continue

                        cur.execute("""
                            INSERT INTO document_embeddings
                            (content, source, source_tier, event_types, metadata)
                            VALUES (%s, %s, %s, %s, %s::jsonb)
                        """, (
                            content,
                            source_name,
                            tier,
                            event_types,
                            json.dumps({
                                'url': article['url'],
                                'title': article['title'][:200],
                                'hash': content_hash,
                            }),
                        ))
                        embedded += cur.rowcount

                conn.commit()
            except Exception as e:
                conn.rollback()
                logger.warning(f"Failed to ingest {source_name}: {e}")
                continue
        logger.info(f"Stored {embedded} new news articles")
        return {"embedded": embedded}
    except Exception:
        raise
    finally:
        if conn is not None:
            conn.close()
