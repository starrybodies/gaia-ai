import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/demo",  label: "Demo" },
  { href: "/docs",  label: "Docs" },
];

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-6 gap-6"
      style={{
        background: "var(--bg-deep)",
        borderBottom: "1px solid var(--border-1)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div
          className="size-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
          aria-hidden="true"
        >
          G
        </div>
        <span
          className="text-sm font-semibold hidden sm:block"
          style={{ color: "var(--text-1)" }}
        >
          Gaia AI
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-md text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-3)" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="/map"
        className="px-4 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-opacity hover:opacity-90"
        style={{ background: "var(--signal-bio)", color: "var(--bg-deep)" }}
      >
        Open Map
      </Link>
    </header>
  );
}
