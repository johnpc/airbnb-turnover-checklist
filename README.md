# Airbnb Turnover Checklist

A photo-based checklist app for tracking Airbnb property condition during guest turnovers. Capture photos of each room after checkout and before check-in to document how the last guest left it and how you prepared it for the next guest.

## Features

- **Photo Documentation**: Take photos of each room/area in your listing
- **Before/After Tracking**: Compare checkout condition vs. turnover-ready state
- **Turnover History**: Keep a record of each guest turnover
- **Room-by-Room Checklist**: Organize photos by room or area

## Tech Stack

- **React** + **Vite** - Fast development and build tooling
- **TypeScript** - Strict typing (no `any` allowed)
- **ESLint** + **Prettier** - Code formatting and linting
- **Husky** + **lint-staged** - Pre-commit hooks for code quality

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (in background with logs)
npm run dev > dev.log 2>&1 &

# Build for production
npm run build

# Run sandbox
npm run sandbox
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Pre-commit Hooks

This project uses Husky to run pre-commit hooks that:

1. Run lint-staged (ESLint + Prettier on staged files)
2. Run the build command to ensure the project builds successfully

---

## Notes for LLMs

### Running Development Servers

**CRITICAL**: Never run foreground processes like `npm run dev` directly. Always run them in the background and pipe logs to a file:

```bash
# ✅ CORRECT - Background with logs
npm run dev > dev.log 2>&1 &

# ❌ WRONG - Foreground process
npm run dev
```

### TypeScript Best Practices

- **NO `any` types allowed** - ESLint enforces this with `@typescript-eslint/no-explicit-any: error`
- Use inline types: `const user: { name: string; age: number } = ...`
- Use defined types/interfaces: `interface User { name: string; age: number }`
- Use type inference when possible: `const count = 5` (inferred as number)
- Use union types for flexibility: `string | number`
- Use generics for reusable components: `Array<T>`, `Promise<T>`

### Architecture Patterns

- **React Hooks & Context** - Use hooks and context providers instead of local state and prop drilling
- **React Query** - All data fetching uses `@tanstack/react-query` with Amplify subscriptions for real-time updates
- **Single Responsibility** - Components should be single-purpose and under 200 lines
- **Utility Functions** - Extract pure logic to `utils/` or `helpers/` directories for easier testing
- **React Router** - Each logical page has its own route
- **shadcn/Tailwind** - Use shadcn components with Tailwind CSS for styling

### Project Structure

This is a photo-based turnover checklist for Airbnb hosts to:

1. Document property condition after guest checkout
2. Document property condition after cleaning/turnover
3. Track issues or damages
4. Maintain a history of turnovers for accountability
