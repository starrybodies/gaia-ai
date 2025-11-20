export default function Home() {
  return (
    <div className="bg-gradient-solarpunk">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-plant-green/30 bg-card-bg/50 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-plant-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-plant-green"></span>
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                Alpha Release • Open Source
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              Earth&apos;s Intelligence,
              <br />
              <span className="glow-green text-plant-green">
                Universally Accessible
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              A comprehensive environmental data platform powered by AI.
              Monitor climate, weather, air quality, biodiversity, and more
              through customizable dashboards and natural language queries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="w-full sm:w-auto px-8 py-4 bg-plant-green hover:bg-forest-green text-background font-semibold rounded-lg transition-all hover:shadow-2xl hover:shadow-plant-green/30 hover:scale-105">
                Launch Dashboard
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 font-semibold rounded-lg transition-all">
                View on GitHub
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Data Sources", value: "5+", color: "plant-green" },
                {
                  label: "Environmental Metrics",
                  value: "100+",
                  color: "cyber-cyan",
                },
                { label: "Real-time Updates", value: "24/7", color: "solar-gold" },
                { label: "Open Source", value: "MIT", color: "electric-lime" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-2 text-${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-earth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-solar-gold">Powerful</span> Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand Earth&apos;s environmental
              systems in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Queries",
                description:
                  "Ask questions in natural language. Our AI interprets your intent and generates contextual visualizations from the right data sources.",
                color: "plant-green",
              },
              {
                icon: "📊",
                title: "Modular Dashboards",
                description:
                  "Build custom dashboards with drag-and-drop widgets. Save and share your configurations with the community.",
                color: "cyber-cyan",
              },
              {
                icon: "🌐",
                title: "Earth's Vital Signs",
                description:
                  "Mission control view showing real-time global environmental metrics with historical context and trend analysis.",
                color: "solar-gold",
              },
              {
                icon: "📈",
                title: "Advanced Visualization",
                description:
                  "Interactive charts, 3D globes, heatmaps, and geospatial overlays. Export visualizations for reports and presentations.",
                color: "neon-blue",
              },
              {
                icon: "🔗",
                title: "Multi-Source Integration",
                description:
                  "Unified access to NASA, NOAA, ESA, OpenAQ, Global Forest Watch, and more. All data properly attributed and transparent.",
                color: "electric-lime",
              },
              {
                icon: "🎓",
                title: "Educational Context",
                description:
                  "Every metric explained. Ask 'What does this mean?' and get AI-powered educational responses with citations.",
                color: "forest-green",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card-bg border border-border hover:border-border-hover transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 text-${feature.color}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section id="data" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-cyber-cyan">Trusted</span> Data Sources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We integrate with the world&apos;s leading environmental data
              providers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              "NASA EOSDIS",
              "NOAA",
              "OpenAQ",
              "Global Forest Watch",
              "Copernicus",
              "Planet Labs",
              "Google Earth Engine",
              "Microsoft Planetary",
              "Climate TRACE",
              "OpenWeatherMap",
            ].map((source, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-card-bg border border-border hover:border-plant-green/50 transition-all text-center group"
              >
                <div className="text-sm font-mono text-muted-foreground group-hover:text-plant-green transition-colors">
                  {source}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              + Many more governmental and NGO databases worldwide
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-earth">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-plant-green">Solarpunk</span> Technology
            </h2>
            <p className="text-lg text-muted-foreground">
              For a regenerative future
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-card-bg rounded-xl p-8 border border-border">
              <p className="text-muted-foreground leading-relaxed mb-4">
                GAIA AI is built on the principles of{" "}
                <span className="text-plant-green font-semibold">
                  radical transparency
                </span>
                ,{" "}
                <span className="text-cyber-cyan font-semibold">
                  decentralization
                </span>
                , and{" "}
                <span className="text-solar-gold font-semibold">
                  universal access
                </span>
                . We believe that environmental data should be accessible to
                everyone—from concerned citizens to researchers, from climate
                activists to policymakers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our platform combines the <strong>simplicity of web1</strong>{" "}
                (fast, functional, accessible), the{" "}
                <strong>polish of web2</strong> (beautiful, intuitive), and the{" "}
                <strong>values of web4</strong> (open, interoperable,
                user-controlled).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Join us in building a tool that empowers humanity to understand
                and protect our living planet. 🌍
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-plant-green to-forest-green hover:from-forest-green hover:to-plant-green text-background font-semibold rounded-lg transition-all hover:shadow-2xl hover:shadow-plant-green/30 hover:scale-105">
              Start Exploring Earth&apos;s Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
