export default function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-plant-green to-forest-green flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-plant-green">GAIA</span>
                <span className="text-foreground"> AI</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Earth Intelligence Platform
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-plant-green transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-plant-green transition-colors"
            >
              Features
            </a>
            <a
              href="#data"
              className="text-sm text-muted-foreground hover:text-plant-green transition-colors"
            >
              Data Sources
            </a>
            <a
              href="https://github.com/yourusername/gaia-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-cyber-cyan transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-plant-green hover:bg-forest-green text-background font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-plant-green/20">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
