export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <h3 className="text-lg font-bold">
                <span className="text-plant-green">GAIA</span> AI
              </h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Open-source environmental intelligence platform providing
              universal access to Earth&apos;s vital data through AI-powered
              visualization and analysis.
            </p>
            <p className="text-xs text-muted font-mono">
              Solarpunk technology for a regenerative future
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-plant-green">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  AI Query
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-cyber-cyan">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contribute
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 GAIA AI. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Data Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
