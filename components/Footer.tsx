export default function Footer() {
  return (
    <footer className="border-t-2 border-white mt-20 bg-terminal">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-mono">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-2xl">█</span>
              <h3 className="text-base font-bold tracking-wider glow-white">
                GAIA.AI
              </h3>
            </div>
            <p className="text-xs text-white-dim leading-relaxed max-w-md mb-4 font-mono">
              &gt; OPEN-SOURCE ENVIRONMENTAL INTELLIGENCE
              <br />
              &gt; UNIVERSAL ACCESS TO EARTH DATA
              <br />
              &gt; AI-POWERED VISUALIZATION
            </p>
            <div className="text-[10px] text-blue uppercase tracking-widest">
              [ CODE • DATA • TRANSPARENCY ]
            </div>
          </div>

          {/* Links - Terminal menu style */}
          <div>
            <div className="text-xs font-bold mb-3 text-white uppercase tracking-wider border-b border-white pb-1">
              [PLATFORM]
            </div>
            <ul className="space-y-2 text-xs text-white-dim">
              {["DASHBOARD", "DATA_SOURCES", "AI_QUERY", "API_DOCS"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-blue transition-colors cmd-prompt"
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
            <div className="text-xs font-bold mb-3 text-blue uppercase tracking-wider border-b border-blue pb-1">
              [NETWORK]
            </div>
            <ul className="space-y-2 text-xs text-white-dim">
              {["GITHUB", "DOCS", "CONTRIBUTE", "ROADMAP"].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-blue transition-colors cmd-prompt"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data sources ticker */}
        <div className="mt-8 pt-6 border-t border-white">
          <div className="text-[9px] text-white-dim uppercase tracking-widest mb-2">
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
                className="text-[8px] px-2 py-1 border border-white text-white-dim hover:text-blue hover:border-blue transition-all"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-white-dim font-mono">
            <span className="text-blue">&gt;</span> © 2025 GAIA.AI • OPEN SOURCE [MIT] • DATA LIBERATION
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white-dim uppercase tracking-wider">
            <a
              href="#"
              className="hover:text-blue transition-colors border border-transparent hover:border-blue px-2 py-1"
            >
              [PRIVACY]
            </a>
            <a
              href="#"
              className="hover:text-blue transition-colors border border-transparent hover:border-blue px-2 py-1"
            >
              [TERMS]
            </a>
            <a
              href="#"
              className="hover:text-blue transition-colors border border-transparent hover:border-blue px-2 py-1"
            >
              [DATA_POLICY]
            </a>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-white bg-code py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] text-white-dim font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue"></span>
            </span>
            <span>SYSTEM_STATUS: <span className="text-blue">ONLINE</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span>BUILD: v0.1.0-alpha</span>
            <span className="text-blue">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
