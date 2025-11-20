# 🌍 GAIA AI - Environmental Intelligence Platform

**Earth's Intelligence, Universally Accessible**

An open-source platform providing universal access to Earth's environmental data through AI-powered visualization and analysis. Built with solarpunk values and cypherpunk principles.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Alpha](https://img.shields.io/badge/Status-Alpha-orange.svg)]()

## ✨ Vision

GAIA AI is a comprehensive environmental data superapp that democratizes access to Earth's vital signs. We integrate data from NASA, NOAA, ESA, and dozens of other sources into a unified platform with:

- 🤖 **AI-Powered Queries** - Ask questions in natural language
- 📊 **Modular Dashboards** - Drag-and-drop customizable widgets
- 🌐 **Earth's Vital Signs** - Real-time mission control view
- 📈 **Advanced Visualization** - Interactive charts, maps, and 3D globes
- 🔗 **Multi-Source Integration** - Unified access to 20+ data providers
- 🎓 **Educational Context** - Every metric explained

## 🎨 Design Philosophy

**Solarpunk/Cypherpunk Aesthetic**
- Hopeful, nature-integrated visual language
- Radical transparency in data sources
- Web1 simplicity + Web2 polish + Web4 values
- Dark mode first with organic color palette

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- API keys (see Setup section)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gaia-ai.git
cd gaia-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔑 API Keys Setup

GAIA AI integrates with multiple data sources. For Phase 1 (alpha), you'll need:

### Required for Basic Functionality

1. **Anthropic Claude API** (AI queries)
   - Sign up at https://console.anthropic.com/
   - Add to `.env.local`: `ANTHROPIC_API_KEY=your_key`

2. **OpenWeatherMap** (weather data)
   - Free tier: 1,000 calls/day
   - Get key at https://openweathermap.org/api
   - Add to `.env.local`: `OPENWEATHERMAP_API_KEY=your_key`

### Optional Data Sources

3. **NASA Earthdata** (satellite imagery)
   - Free registration at https://urs.earthdata.nasa.gov/

4. **NOAA Climate Data** (climate metrics)
   - Get token at https://www.ncdc.noaa.gov/cdo-web/token

5. **Global Forest Watch** (deforestation data)
   - Get key at https://www.globalforestwatch.org/

See `.env.example` for complete list of supported data sources.

## 📁 Project Structure

```
gaia-ai/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with header/footer
│   └── globals.css        # Solarpunk design system
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Site footer
├── lib/                   # Utility functions and API wrappers
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS v4
- Recharts (data visualization)
- Deck.gl (geospatial viz)
- MapLibre GL (maps)

**Backend:**
- Next.js API Routes
- Anthropic Claude API
- PostgreSQL + Prisma (coming in Phase 3)
- Vercel KV/Redis (caching, Phase 3)

**Deployment:**
- Vercel (recommended)
- Compatible with any Node.js host

## 📊 Development Roadmap

### Phase 1: Foundation (Current - Alpha)
- ✅ Project setup and design system
- ⏳ AI query interface
- ⏳ First data integrations (weather, air quality)
- ⏳ Basic visualizations

### Phase 2: Multi-Source Data
- Dashboard widgets system
- 5+ data source integrations
- Map visualizations
- Enhanced UI

### Phase 3: Persistence & Sharing
- Earth's Vital Signs view
- Database integration
- User authentication
- Save/share dashboards

### Phase 4: Alpha Launch
- Drag-and-drop builder
- Advanced AI capabilities
- Performance optimization
- Public alpha release

See [TASKS.md](../Regen AI/TASKS.md) for detailed session breakdown.

## 🤝 Contributing

GAIA AI is open source and welcomes contributions! We're in early alpha, so things are moving fast.

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new data sources
- 📝 Improve documentation
- 🎨 Design contributions
- 💻 Code contributions

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌱 Solarpunk Values

We're building GAIA AI on these principles:

- **Universal Access**: Environmental data should be free and accessible to all
- **Radical Transparency**: All data sources, methods, and code are open
- **Decentralization**: User-controlled, open standards, interoperable
- **Sustainability**: Efficient, lightweight, solar-powered-friendly
- **Hope**: Technology can help us build a regenerative future

## 🙏 Acknowledgments

Standing on the shoulders of giants:

- Data providers: NASA, NOAA, ESA, OpenAQ, Global Forest Watch, and many more
- Open source community
- Climate scientists and researchers
- Environmental activists and educators

## 📬 Contact

- GitHub Issues: [Report bugs or request features](https://github.com/yourusername/gaia-ai/issues)
- Discussions: [Join the conversation](https://github.com/yourusername/gaia-ai/discussions)

---

**Built with 🌍 for a regenerative future**

*"We are the first generation to feel the impact of climate change and the last generation that can do something about it."*
