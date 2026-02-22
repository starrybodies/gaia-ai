from gaia_pipeline.assets.news_ingestion import (
    parse_rss_feed,
    classify_article_tier,
    extract_event_types,
)

SAMPLE_RSS = """<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Mongabay</title>
    <item>
      <title>Amazon deforestation surges in February</title>
      <description>New satellite data shows unprecedented clearing in Para state</description>
      <link>https://mongabay.com/2026/02/amazon-deforestation</link>
      <pubDate>Sat, 22 Feb 2026 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>"""

def test_parse_rss_feed():
    articles = parse_rss_feed(SAMPLE_RSS, source_name='Mongabay', source_tier=1)
    assert len(articles) == 1
    assert 'Amazon deforestation' in articles[0]['title']
    assert articles[0]['source_tier'] == 1

def test_classify_article_tier_tier1():
    assert classify_article_tier('Mongabay') == 1
    assert classify_article_tier('Reuters') == 1

def test_classify_article_tier_tier2():
    assert classify_article_tier('Grist') == 2

def test_classify_article_tier_unknown():
    assert classify_article_tier('Unknown Blog') == 3

def test_extract_event_types_fire():
    types = extract_event_types('Wildfire spreads across California forest')
    assert 'fire' in types

def test_extract_event_types_deforestation():
    types = extract_event_types('Amazon deforestation surges in dry season')
    assert 'deforestation' in types

def test_extract_event_types_multiple():
    types = extract_event_types('Fire and flooding devastate coastal biodiversity')
    assert 'fire' in types
    assert 'biodiversity' in types
