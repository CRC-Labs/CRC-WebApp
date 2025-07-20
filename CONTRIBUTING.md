# Contributing to Chess Repertoire Companion

Thanks for your interest in improving Chess Repertoire Companion! This guide will help you get started contributing to our Next.js chess application.

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+**
- **yarn** (preferred) or **npm**
- **Git**

### Setup Development Environment

1. **Fork and Clone**

   Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/chess-repertoire-companion.git
   cd chess-repertoire-companion

2. **Install Dependencies**

   yarn install

3. **Start Development Server**

   yarn dev

4. **Verify Setup**
   - Open http://localhost:3000
   - Check that the application loads correctly

## 📋 How to Contribute

### 1. Find Something to Work On

- Browse open issues on GitHub
- Look for `good first issue` labels for newcomers
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

git checkout -b feature/your-feature-name

# or

git checkout -b fix/bug-description

### 3. Make Your Changes

- Follow existing code patterns and structure
- Write clean, readable TypeScript code
- Add tests for new functionality
- Update documentation if needed

### 4. Test Your Changes

Run the full test suite:
yarn test-all

This command runs:

- ESLint (yarn lint)
- TypeScript checking (yarn type-check)
- Jest tests (yarn test)

### 5. Commit Your Changes

```
git add .
git commit -m "feat: add mobile-friendly repertoire navigation"
```

**Commit Message Format:**

- `feat:` - new feature
- `fix:` - bug fix
- `docs:` - documentation updates
- `style:` - formatting, no code change
- `refactor:` - code change that neither fixes bug nor adds feature
- `test:` - adding or updating tests
- `chore:` - maintenance tasks

### 6. Push and Create Pull Request

git push origin feature/your-feature-name

Create a Pull Request on GitHub with:

- Clear title and description
- Reference to related issues
- Screenshots for UI changes

## 🧪 Testing Guidelines

### Running Tests

Run all tests:
`yarn test`

Run tests with coverage:
`yarn test --coverage`

Run specific test file:
`yarn test ChessBoard.test.tsx`

Run full quality checks:
`yarn test-all
`

### Writing Tests

- **Component Tests**: Test React components using Testing Library
- **Utility Tests**: Test helper functions and utilities
- **Integration Tests**: Test feature interactions

Example test structure:

```
import { render, screen } from '@testing-library/react'
import { ChessBoard } from './ChessBoard'

describe('ChessBoard', () => {
    ('it should render board with initial position', () => {
        render(<ChessBoard />)
        expect(screen.getByTestId('chess-board')).toBeInTheDocument()
    })
})
```

## 🎨 Code Style Guidelines

### TypeScript Standards

- Use strict typing - avoid `any`
- Define interfaces for props and data structures
- Use proper naming conventions
- Leverage path aliases: `@/` for src/, `@models/` for types/

### React Best Practices

- Use functional components with hooks
- Follow existing component patterns in `/src/features/`
- Use proper prop types and default values
- Follow the feature-based architecture

### Styling with TailwindCSS 4.0

- Use utility classes for styling
- Follow mobile-first responsive design
- Use custom CSS variables defined in config
- Maintain consistency with existing components

## 📁 Project Structure

```
src/
├── features/ # Feature-based organization
│ ├── chess/ # Chess engine & board components
│ │ ├── board/ # Interactive chess board
│ │ ├── lines/ # Tree view & line analysis
│ │ ├── logic/ # Chess rules & validation
│ │ └── sunburst/ # Sunburst visualization
│ ├── repertoire/ # Repertoire management
│ ├── common/ # Shared components
│ └── ...
├── pages/ # Next.js pages
├── types/ # TypeScript type definitions
└── styles/ # Global styles
```

### Adding New Features

1. Create feature folder in `/src/features/`
2. Follow the pattern: `components/`, `hooks/`, `providers/`, `utils/`
3. Add TypeScript types in `/src/types/`
4. Include comprehensive tests in `__tests__/`

## 🎯 Contribution Areas

### 🌟 High Impact

- **Mobile UX**: Touch interactions and responsive design
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Bundle optimization, lazy loading
- **Chess Features**: New analysis tools, visualization improvements

### 🚀 Good First Issues

- Fix responsive design bugs
- Add loading states to components
- Improve error messages
- Update component documentation
- Add unit tests for utilities

## 🔧 Development Tools

### Required VSCode Extensions

1. **ESLint** - Code linting and error detection
2. **Prettier** - Auto-formatting on save
3. **TailwindCSS IntelliSense** - Tailwind autocomplete
4. **Headwind** - Tailwind class sorting

### Available Scripts

```
yarn dev # Start development server (next dev)
yarn build # Build for production (next build)
yarn start # Start production server (next start)
yarn lint # Run ESLint with auto-fix
yarn test # Run Jest tests (no cache)
yarn test-all # Run all quality checks
yarn type-check # TypeScript type checking
yarn format # Format code with Prettier
```

### Path Aliases

Use the configured path aliases in your code:

```
import { ChessLine } from '@models/ChessLine' # Maps to src/types/
import { ChessBoard } from '@/features/chess/board' # Maps to src/
```

## 🏗️ Tech Stack Details

### Core Technologies

- **Next.js 15** with Pages Router
- **TypeScript 5.7** with strict configuration
- **React 19** with latest features
- **TailwindCSS 4.0** with custom configuration

### Chess-Specific Libraries

- **chess.js 0.13.4** - Chess game logic
- **chessground 9.1.1** - Interactive chess board
- **cm-pgn** - PGN parsing and handling
- **d3 7.9.0** - Data visualizations

### Development Tools

- **Jest 29** with jsdom environment
- **Testing Library** for React component testing
- **ESLint 9** with custom configuration
- **Prettier 3** for code formatting

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Welcome diverse perspectives

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **Code Reviews**: Get feedback on your contributions

### Review Process

1. **Automated Checks**: All PRs must pass `yarn test-all`
2. **Code Review**: At least one maintainer review required
3. **Testing**: Ensure new features have adequate test coverage
4. **Documentation**: Update docs for user-facing changes

## 📄 License

By contributing, you agree that your contributions will be licensed under the **GNU General Public License v3.0**.

---

**Thank you for contributing to Chess Repertoire Companion! ♟️**

Every contribution helps make chess study better for players worldwide.
