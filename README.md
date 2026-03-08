# LinkVault

Personal web app for saving, organizing, and retrieving links.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui, Zustand
- **Database**: MongoDB
- **Validation**: Zod (shared between frontend and backend)
- **Testing**: Vitest + Supertest, Playwright (e2e)
- **Linting**: Biome

## Prerequisites

- Node.js >= 20
- Docker + Docker Compose

## Local Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file and edit the values:
   ```bash
   cp .env.example .env
   ```

3. Start MongoDB:
   ```bash
   docker compose up -d
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Mongo Express: http://localhost:8081

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start frontend and backend in parallel |
| `npm run build` | Build all packages |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Run Biome linter with auto-fix |
| `npm test` | Run server unit + integration tests |
| `npm run test:e2e` | Run Playwright e2e tests |
