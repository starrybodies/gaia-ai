export default function Header() {
  return (
    <header className="border-b-2 border-matrix bg-black relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo - Terminal style */}
          <div className="flex items-center gap-3 font-mono">
            <div className="w-8 h-8 border-2 border-matrix-green bg-black flex items-center justify-center relative">
              <span className="text-matrix-green text-lg">█</span>
              <div className="absolute inset-0 border border-matrix-green animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider glow-green">
                <span className="text-matrix-green">GAIA.AI</span>
              </h1>
              <p className="text-[8px] text-terminal-gray uppercase tracking-widest">
                EARTH_INTELLIGENCE_SYS
              </p>
            </div>
          </div>

          {/* Navigation - Command line style */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "[ABOUT]", href: "/about" },
              { label: "[DEMO]", href: "/demo" },
              { label: "[DATA]", href: "/about#data" },
              { label: "[SRC]", href: "https://github.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-3 py-1 text-xs text-terminal-gray hover:text-matrix-green hover:bg-terminal-dark border border-transparent hover:border-matrix-green transition-all uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA - Terminal button */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-black border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-xs uppercase tracking-wider relative group">
              <span className="relative z-10">&gt; INIT_SYSTEM</span>
              <div className="absolute inset-0 bg-matrix-green opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Status bar at bottom of header */}
      <div className="border-t border-matrix-green/30 bg-terminal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-between items-center text-[9px] text-terminal-gray uppercase tracking-widest">
          <div className="flex gap-4">
            <span>SYS: ONLINE</span>
            <span className="text-matrix-green">█ CONNECTED</span>
          </div>
          <div className="flex gap-4">
            <span>DATA: 5 SOURCES</span>
            <span>STATUS: ALPHA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
