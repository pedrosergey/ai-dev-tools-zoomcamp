# Snake Arena Frontend 🎨

The frontend for the **Snake Arena** application, designed to be fast, responsive, and beautiful.

## Tech Stack 🛠️
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## Quick Start 🏃‍♂️

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Connecting to the Backend

By default the frontend expects the backend API at `http://localhost:8000`.
To point the frontend to a different backend URL, set the `VITE_API_BASE_URL` environment variable before starting the dev server:

```bash
# macOS / Linux
export VITE_API_BASE_URL=http://localhost:8000
npm run dev

# Windows (PowerShell)
$env:VITE_API_BASE_URL = "http://localhost:8000"; npm run dev
```

3.  **Run tests:**
    ```bash
    npx vitest run
    ```

## Key Files 📂
- `src/lib/gameLogic.ts`: Core game engine (movement, collisions).
- `src/components/SnakeGame.tsx`: Main game component.
- `src/hooks/use-toast.ts`: Notification system.

Happy coding! ✨
