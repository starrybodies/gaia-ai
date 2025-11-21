export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-card">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-earth flex items-center justify-center">
                <span className="text-white text-lg font-bold">G</span>
              </div>
              <h3 className="text-lg font-bold text-charcoal">
                GAIA AI
              </h3>
            </div>
            <p className="text-sm text-stone leading-relaxed max-w-md mb-4">
              Open-source environmental intelligence platform providing universal access to Earth's vital data through AI-powered visualization and analysis.
            </p>
            <div className="flex gap-2">
              <span className="badge badge-success text-[10px]">Open Source</span>
              <span className="badge badge-primary text-[10px]">MIT License</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <div className="text-sm font-semibold mb-3 text-charcoal">
              Platform
            </div>
            <ul className="space-y-2 text-sm text-stone">
              {[
                { label: "Dashboard", href: "/demo" },
                { label: "Data Sources", href: "/about#data" },
                { label: "About", href: "/about" },
                { label: "API Docs", href: "#" }
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="hover:text-rust-orange transition-colors inline-flex items-center gap-1"
                  >
                    <span className="text-rust-orange">→</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <div className="text-sm font-semibold mb-3 text-charcoal">
              Community
            </div>
            <ul className="space-y-2 text-sm text-stone">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "Documentation", href: "#" },
                { label: "Contribute", href: "#" },
                { label: "Roadmap", href: "/about#roadmap" }
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover:text-sky-blue transition-colors inline-flex items-center gap-1"
                  >
                    <span className="text-sky-blue">→</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data sources */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-xs font-semibold text-stone mb-3">
            Integrated Data Sources
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "NASA EOSDIS",
              "NOAA",
              "OpenAQ",
              "Global Forest Watch",
              "Copernicus",
              "Planet Labs",
              "Google Earth Engine",
              "Microsoft Planetary Computer",
              "Climate TRACE",
              "OpenWeatherMap"
            ].map((source, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 bg-cream text-stone rounded-md hover:bg-earth-beige-light transition-all border border-transparent hover:border-border-strong"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-stone">
            © 2025 GAIA AI • Open Source • Environmental Data for All
          </div>
          <div className="flex items-center gap-4 text-xs text-stone">
            <a
              href="#"
              className="hover:text-rust-orange transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-rust-orange transition-colors"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="hover:text-rust-orange transition-colors"
            >
              Data Policy
            </a>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-border bg-cream/50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="status-indicator status-active"></span>
            <span className="text-stone font-mono">System Online</span>
          </div>
          <div className="flex items-center gap-4 text-stone font-mono">
            <span>v0.1.0-alpha</span>
            <span className="text-success">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
