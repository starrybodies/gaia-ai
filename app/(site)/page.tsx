import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <h1 className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>
        Read the planet.
      </h1>
      <p style={{ color: "var(--text-3)" }}>
        Real-time environmental intelligence.
      </p>
      <Link
        href="/map"
        className="px-6 py-3 rounded-lg text-sm font-medium"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
      >
        Open Map
      </Link>
    </div>
  );
}
