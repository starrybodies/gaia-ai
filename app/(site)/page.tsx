import Link from "next/link";

const SIGNALS = [
  { label: "Fire Detection",     color: "var(--signal-heat)",     desc: "NASA FIRMS VIIRS near-real-time fire detections worldwide." },
  { label: "Deforestation",      color: "var(--signal-bio)",      desc: "Hansen/GFW canopy loss alerts at 30m resolution." },
  { label: "Convergence Alerts", color: "var(--signal-critical)", desc: "Multi-signal compound events scored by convergence index." },
  { label: "Air Quality",        color: "var(--signal-atmo)",     desc: "OpenAQ sensor network PM2.5, NO₂, and ozone readings." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-deep)", color: "var(--text-1)" }}>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-6">
        <div
          className="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
          style={{
            color: "var(--signal-bio)",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          Environmental Intelligence
        </div>
        <h1
          className="text-5xl sm:text-7xl font-bold text-balance max-w-2xl"
          style={{ color: "var(--text-1)", lineHeight: 1.1 }}
        >
          Read the planet.
        </h1>
        <p
          className="text-lg sm:text-xl text-pretty max-w-xl"
          style={{ color: "var(--text-3)" }}
        >
          Real-time environmental signals — fires, deforestation, air quality,
          convergence events — unified in a single legibility layer.
        </p>
        <Link
          href="/map"
          className="px-8 py-3.5 rounded-lg text-base font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
        >
          Open Map
        </Link>
      </section>

      {/* Signals grid */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2
          className="text-sm font-medium uppercase tracking-widest mb-8 text-balance"
          style={{ color: "var(--text-4)" }}
        >
          Live data sources
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SIGNALS.map((signal) => (
            <div
              key={signal.label}
              className="rounded-xl p-5"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-1)",
                borderLeft: `3px solid ${signal.color}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ background: signal.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                  {signal.label}
                </span>
              </div>
              <p className="text-sm text-pretty" style={{ color: "var(--text-3)" }}>
                {signal.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
