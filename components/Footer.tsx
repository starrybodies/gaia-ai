export default function Footer() {
  return (
    <footer className="border-t-2 border-matrix mt-20 bg-black">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-mono">
          {/* Brand - ASCII style */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-matrix-green text-2xl">█</span>
              <h3 className="text-base font-bold tracking-wider glow-green">
                GAIA.AI
              </h3>
            </div>
            <p className="text-xs text-terminal-gray leading-relaxed max-w-md mb-4 font-mono">
              &gt; OPEN-SOURCE ENVIRONMENTAL INTELLIGENCE PLATFORM
              <br />
              &gt; UNIVERSAL ACCESS TO EARTH DATA
              <br />
              &gt; AI-POWERED VISUALIZATION
            </p>
            <div className="text-[10px] text-matrix-green uppercase tracking-widest">
              [ CYPHERPUNK • DECENTRALIZED • TRANSPARENT ]
            </div>
          </div>

          {/* Links - Terminal menu style */}
          <div>
            <div className="text-xs font-bold mb-3 text-matrix-green uppercase tracking-wider border-b border-matrix-green/30 pb-1">
              [PLATFORM]
            </div>
            <ul className="space-y-2 text-xs text-terminal-gray">
              {["DASHBOARD", "DATA_SOURCES", "AI_QUERY", "API_DOCS"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-matrix-green transition-colors cmd-prompt"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Community */}
          <div>
            <div className="text-xs font-bold mb-3 text-neon-cyan uppercase tracking-wider border-b border-neon-cyan/30 pb-1">
              [NETWORK]
            </div>
            <ul className="space-y-2 text-xs text-terminal-gray">
              {["GITHUB", "DISCORD", "CONTRIBUTE", "ROADMAP"].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-neon-cyan transition-colors cmd-prompt"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data sources ticker */}
        <div className="mt-8 pt-6 border-t border-matrix-green/20">
          <div className="text-[9px] text-terminal-gray uppercase tracking-widest mb-2">
            INTEGRATED DATA SOURCES:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "NASA_EOSDIS",
              "NOAA",
              "OPENAQ",
              "GFW",
              "COPERNICUS",
              "PLANET_LABS",
              "GEE",
              "MSFT_PC",
              "CLIMATE_TRACE",
              "OWM",
            ].map((source, i) => (
              <span
                key={i}
                className="text-[8px] px-2 py-1 border border-matrix-green/40 text-terminal-gray hover:text-matrix-green hover:border-matrix-green transition-all"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar - Terminal style */}
        <div className="mt-8 pt-6 border-t border-matrix-green/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-terminal-gray font-mono">
            <span className="text-matrix-green">&gt;</span> © 2025 GAIA.AI •
            OPEN SOURCE [MIT] • DATA LIBERATION
          </div>
          <div className="flex items-center gap-4 text-[10px] text-terminal-gray uppercase tracking-wider">
            <a
              href="#"
              className="hover:text-matrix-green transition-colors border border-transparent hover:border-matrix-green px-2 py-1"
            >
              [PRIVACY]
            </a>
            <a
              href="#"
              className="hover:text-matrix-green transition-colors border border-transparent hover:border-matrix-green px-2 py-1"
            >
              [TERMS]
            </a>
            <a
              href="#"
              className="hover:text-matrix-green transition-colors border border-transparent hover:border-matrix-green px-2 py-1"
            >
              [DATA_POLICY]
            </a>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-bar-item">
          <span>SYSTEM_STATUS:</span>
          <span className="text-matrix-green flicker">ONLINE</span>
        </div>
        <div className="status-bar-item">
          <span>BUILD: v0.1.0-alpha</span>
          <span>UPTIME: CONTINUOUS</span>
        </div>
      </div>
    </footer>
  );
}
