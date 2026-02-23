"use client";

import { useRef, useState } from "react";
import { SectionHeader } from "../SectionHeader";

interface BriefingSectionProps { lat: number; lon: number; }

export function BriefingSection({ lat, lon }: BriefingSectionProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const expand = () => {
    setCollapsed(false);
    if (text) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setText('');
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon }),
          signal: abortRef.current!.signal,
        });
        if (!res.ok || !res.body) { setLoading(false); return; }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6);
            if (payload === '[DONE]') { setLoading(false); return; }
            try {
              const { text: chunk } = JSON.parse(payload);
              if (chunk) setText(p => p + chunk);
            } catch { /* skip malformed */ }
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') setText('Briefing unavailable.');
      } finally { setLoading(false); }
    })();
  };

  return (
    <div className="px-3 py-2">
      <SectionHeader
        label="BRIEFING"
        status={loading ? 'loading' : text ? 'nominal' : undefined}
        collapsible
        collapsed={collapsed}
        onToggle={collapsed ? expand : () => { abortRef.current?.abort(); setCollapsed(true); }}
      />
      {!collapsed && (
        <div className="mt-2">
          {loading && !text ? (
            <div className="space-y-1.5">
              {[100, 90, 95, 80].map((w, i) => (
                <div key={i} className="h-3 rounded" style={{ width: `${w}%`, background: 'var(--bg-raised)' }} />
              ))}
            </div>
          ) : (
            <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-ui)' }}>
              {text || 'No briefing available.'}
              {loading && <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle" style={{ background: 'var(--accent)', opacity: 0.8 }} />}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
