# Frontend UI 🎨

Modern React application for Snake Arena — fast, responsive, and beautiful. Built with Vite, TypeScript, and Tailwind CSS.

## What it does

- 🎮 **Game Rendering**: Canvas-based snake game with real-time graphics
- 🔐 **Authentication**: User signup, login, account management
- 🏆 **Leaderboards**: View scores and rankings
- 👁️ **Spectator Mode**: Watch other players' games live
- ⚡ **Real-time Updates**: Socket-ready architecture for future multiplayer

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Lightning-fast bundler
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Beautiful component library
- **React Router** — Client-side routing
- **React Query** — Server state management

## Quick Start

### With Docker Compose (recommended)

```bash
# From project root
docker-compose up -d

# Frontend available at: http://localhost/
# Auto-reload enabled for development
```

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Opens at http://localhost:5173 (or port shown in terminal)
```

## Available Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Build optimized production bundle
npm run lint       # Check code style with ESLint
npm run preview    # Preview production build locally
npm run build:dev  # Debug build without optimization
```

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── GameBoard.tsx    # Main game canvas
│   ├── AuthModal.tsx    # Login/signup modal
│   ├── Leaderboard.tsx  # Score table
│   ├── Header.tsx       # Top navigation
│   └── ui/              # shadcn/ui components
├── contexts/            # React context providers
│   ├── AuthContext.tsx  # User auth state
│   └── ModalContext.tsx # Modal state
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & helpers
│   ├── api.ts          # API client
│   └── gameLogic.ts    # Game mechanics
├── types/               # TypeScript type definitions
├── pages/               # Page components
│   └── Index.tsx       # Main game page
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Game Controls

| Input | Action |
|-------|--------|
| `↑` `↓` `←` `→` | Move snake |
| `W` `A` `S` `D` | Alternative move |
| `Space` | Pause/resume |
| `R` | Restart game |

## Development Tips

### Hot Module Replacement (HMR)
- Edit any file and see changes instantly
- Game state persists during development
- No full page reloads needed

### Debugging
```bash
# Open browser DevTools (F12)
# Check Console for API errors
# Use React DevTools extension for state inspection
```

### Environment Variables

Create `.env.local` for local overrides:

```env
# Backend API
VITE_API_URL=http://localhost:8000

# App
VITE_APP_NAME=Snake Arena
```

### Component Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch
```

## API Integration

The frontend communicates with the backend API:

```typescript
// Example API call
const response = await fetch('http://localhost:8000/leaderboard');
const scores = await response.json();
```

API endpoints are defined in `lib/api.ts` for easy management.

## Build for Production

```bash
# Build optimized bundle
npm run build

# Output in dist/ directory
# Ready for deployment!
```

## Common Issues

### API Connection Failed?
- Ensure backend is running: `docker-compose up -d`
- Check API URL in browser DevTools Network tab
- Verify CORS headers in backend

### Hot Reload Not Working?
- Restart dev server: `npm run dev`
- Check browser console for errors
- Clear browser cache (Ctrl+Shift+Delete)

### Build Errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Review build output: `npm run build`

## Performance

- ✅ Code splitting with dynamic imports
- ✅ Tree-shaking for smaller bundles
- ✅ Image optimization with Vite
- ✅ CSS minification with Tailwind

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern browsers with ES2020+ support

## Contributing

- Follow TypeScript strict mode
- Use functional components with hooks
- Keep components small and focused
- Add tests for new features

---

Built with React & ❤️
