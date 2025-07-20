<div align="center">

# Chess Repertoire Companion ♟️

**Modern frontend for building and memorizing chess opening repertoires**

[![Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_CRC-blue?style=for-the-badge)](https://chess-repertoire-companion.com)
[![License](https://img.shields.io/badge/license-GPL_v3-green?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[🚀 **Try Live Demo**](https://chess-repertoire-companion.com) • [🤝 **Contributing**](CONTRIBUTING.md)

</div>

## ✨ About

Chess Repertoire Companion (CRC) is the **frontend interface** for a comprehensive chess repertoire management system. This Next.js web application helps chess players build, organize, and memorize their opening repertoires through interactive visualizations and modern web technology.

### 🏗️ Architecture

- **Frontend** (this repository): Next.js + TypeScript web application
- **Backend**: Go-based API (separate, closed-source system)
- **Communication**: RESTful API integration

## 🌟 Key Features

- **Interactive chess board** with drag-and-drop functionality
- **Sunburst visualization** for repertoire exploration
- **Tree view** for detailed line analysis
- **PGN export/import** with enhanced metadata
- **Responsive design** for desktop and mobile
- **Dark/light theme** support
- **Training modes** for repertoire memorization

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+**
- **npm** or **yarn**

### Installation

Clone the repository:

```
git clone https://github.com/crc-labs/chess-repertoire-companion.git
cd chess-repertoire-companion
```

Install dependencies:
`npm install`

Start development server:
`npm run dev`

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## 📁 Project Structure

```chess-repertoire-companion/
├── src/
│ ├── features/ # Feature-based architecture
│ │ ├── chess/ # Chess engine integration
│ │ │ ├── board/ # Interactive chess board
│ │ │ ├── lines/ # Tree view & line analysis
│ │ │ ├── logic/ # Chess rules & validation
│ │ │ └── sunburst/ # Sunburst visualization
│ │ ├── repertoire/ # Repertoire management
│ │ ├── repertoires-list/ # Repertoire CRUD operations
│ │ ├── auth/ # Authentication system
│ │ ├── common/ # Shared UI components
│ │ ├── theme/ # Dark/light theme system
│ │ └── settings/ # Application settings
│ ├── pages/ # Next.js pages & routing
│ ├── types/ # TypeScript type definitions
│ │ ├── ChessLine.ts # Chess line data structure
│ │ ├── ChessPosition.ts # Position representation
│ │ ├── Repertoire.ts # Repertoire data model
│ │ └── SunburstNode.ts # Visualization node types
│ └── styles/ # Global styles & themes
├── public/ # Static assets
│ ├── chessPieces/ # SVG chess piece images
│ └── ... # Icons, favicon, etc.
├── resources/ # Chess data & samples
│ ├── openings/ # Opening database
│ ├── repertoires/ # Sample repertoire files
│ └── suggestions/ # Move suggestions data
├── tests/ # Test suites
├── config/ # Build configurations
└── ... # Config files (package.json, etc.)
```

## 🛠️ Development

### Recommended VSCode Extensions

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Code linting and error detection
2. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Auto-formatting on save
3. [TailwindCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind autocomplete
4. [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind) - Tailwind class sorting

### Available Scripts

```
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint with auto-fix
npm run test # Run Jest test suite
npm run test-all # Run lint + type-check + tests
npm run type-check # TypeScript type checking
```

## 🧪 Testing

We use **Test-Driven Development (TDD)** with comprehensive test coverage:

Run all tests:
`npm test`

Run full test suite with linting:
`npm run test-all`

## 🎯 Key Development Areas

### 🏗️ **Feature Architecture**

Each feature in `src/features/` follows a consistent pattern:

- **`components/`** - React components for the feature
- **`hooks/`** - Custom React hooks and logic
- **`providers/`** - Context providers for state management
- **`utils/`** - Utility functions and helpers

### ♟️ **Chess Engine Integration**

- **Board Component** - Interactive drag-and-drop chess board
- **Chess Logic** - Move validation, position analysis
- **PGN Handling** - Import/export chess notation
- **Visualizations** - Sunburst charts and tree views

### 📊 **Data Flow**

- **Types** - Strongly typed with TypeScript interfaces
- **Providers** - React Context for global state management
- **API Integration** - RESTful communication with Go backend

## 🤝 Contributing

We welcome contributions to improve the chess study experience!

**Ways to contribute:**

- 🐛 **Bug fixes** and UI improvements
- 💻 **New features** for chess analysis
- 🎨 **UX enhancements** and responsive design
- 🧪 **Test coverage** and documentation
- ♟️ **Chess expertise** for better features

**[👉 Read our Contributing Guide](CONTRIBUTING.md)** to get started!

### 🌟 Good First Issues

- UI component improvements
- Mobile responsiveness fixes
- Test coverage for utility functions
- Documentation updates
- Accessibility enhancements

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with Pages Router
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **UI**: [React 19](https://reactjs.org/) + [TailwindCSS 4.0](https://tailwindcss.com/)
- **Chess Engine**: [chess.js](https://github.com/jhlywa/chess.js) + [Chessground](https://github.com/lichess-org/chessground)
- **Visualizations**: [D3.js](https://d3js.org/) + [React Hyper Tree](https://github.com/bkrem/react-hyper-tree)
- **Testing**: [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)

## 📊 Project Status

### Frontend Development

- ✅ **Core Features**: Interactive board, repertoire management, visualizations
- ✅ **Responsive Design**: Mobile and desktop optimization
- ✅ **Testing**: Comprehensive test suite with TDD approach
- 🚧 **In Progress**: Enhanced training modes, accessibility improvements
- 📋 **Planned**: PWA features, offline mode, advanced analytics

## 💬 Community

- **🐛 [Issues](https://github.com/crc-labs/CRC-WebApp/issues)** - Bug reports and feature requests
- **💡 [Discussions](https://github.com/crc-labs/CRC-WebApp/discussions)** - Questions and ideas

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

**Note**: This license applies only to the frontend code in this repository. The backend API is proprietary.

---

<div align="center">

**Built with ❤️ for the chess community**

[🌐 **Live Demo**](https://chess-repertoire-companion.com) • [🤝 **Contribute**](CONTRIBUTING.md)

</div>
````
