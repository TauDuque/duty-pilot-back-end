<div align="center">
  <h1>Duty Pilot – Backend</h1>
  <p>Node.js + TypeScript API with PostgreSQL, clean architecture, observability, and Jest coverage.</p>
</div>

## Table of Contents

1. [Overview](#overview)
2. [Stack & Features](#stack--features)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Variables](#environment-variables)
6. [Setup & Usage](#setup--usage)
7. [Testing & Linting](#testing--linting)
8. [Observability](#observability)
9. [Available Scripts](#available-scripts)
10. [API Surface](#api-surface)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This repository contains the backend half of Duty Pilot—the technical assessment that manages multiple to-do lists, duty statuses, deletion, and theming. The API exposes REST endpoints under `/api`, persists data in PostgreSQL using plain SQL (no ORM), validates every payload, and emits production-ready logs.

---

## Stack & Features

- **Node.js 20 + TypeScript** running in strict mode.
- **Express 5** organized in layers (routes → controllers → services → repositories).
- **PostgreSQL** via `pg` and raw SQL statements (no ORM abstractions).
- **Validation middleware** for all list/duty operations.
- **Jest + Supertest** suites covering services, validators, and routes.
- **Pino + pino-http** logging with per-request correlation (`requestId`).
- **Health check** endpoint hitting both the API and the database.

---

## Folder Structure

```
src
├── config/        # env loader + database pool
├── controllers/   # HTTP handlers (duty, list, health)
├── repositories/  # raw SQL queries
├── services/      # business logic orchestration
├── middlewares/   # validation, async handler, logger, error handler
├── routes/        # express.Router wiring
├── types/         # shared interfaces
├── utils/         # logger factory, helpers
└── tests/         # Jest suites (services, validators, routes)
```

---

## Prerequisites

| OS               | Requirements                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Windows 10+**  | [Node.js 20+](https://nodejs.org/en/download/), npm 10+, [Git](https://git-scm.com/downloads), Docker Desktop (optional for PostgreSQL) |
| **macOS 13+**    | Node 20+ via `brew install node`, npm 10+, Git, Docker Desktop or [Colima](https://github.com/abiosoft/colima) |
| **Ubuntu 22.04** | `sudo apt install -y nodejs npm git docker.io docker-compose`, enable Docker daemon                       |

> Tip: use `nvm` or `fnm` to keep Node 20.x aligned across environments.

---

## Environment Variables

Create `.env` (or configure secrets) with:

| Variable     | Description                              | Default                 |
| ------------ | ---------------------------------------- | ----------------------- |
| `PORT`       | HTTP port                                | `3001`                  |
| `NODE_ENV`   | `development` / `production`             | `development`           |
| `CORS_ORIGIN`| Allowed frontend origin                  | `http://localhost:5173` |
| `DB_HOST`    | PostgreSQL host                          | `localhost`             |
| `DB_PORT`    | PostgreSQL port                          | `5432`                  |
| `DB_NAME`    | Database name                            | `duty_pilot`            |
| `DB_USER`    | Database user                            | `postgres`              |
| `DB_PASSWORD`| Database password                        | `postgres`              |
| `LOG_LEVEL`  | Pino level (`debug`, `info`, `warn`, `error`) | `info`              |

---

## Setup & Usage

1. **Clone & install**
   ```bash
   git clone <BACKEND_REPO_URL>
   cd back
   npm install
   cp .env.example .env    # create manually if the sample is not present
   ```
2. **Provision PostgreSQL**
   - Docker (recommended):
     ```bash
     docker run --name duty-pilot-db -e POSTGRES_DB=duty_pilot \
       -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
       -p 5432:5432 -d postgres:15
     ```
   - Native install: install PostgreSQL 15+, create database/user/password, adjust `.env`.
3. **Bootstrap schema**
   ```bash
   npm run db:init
   ```
   Creates `lists`/`duties`, indexes, and a default list.
4. **Run in development**
   ```bash
   npm run dev
   ```
   API will listen on `http://localhost:3001/api`.
5. **Build & start (production)**
   ```bash
   npm run build
   npm start
   ```

---

## Testing & Linting

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `npm run test`       | Runs all Jest suites (services, validators, routes).  |
| `npm run test:watch` | Watches files while running tests.                   |
| `npm run lint`       | ESLint (TS strict).                                   |
| `npm run lint:fix`   | ESLint with auto-fix.                                 |
| `npm run format`     | Prettier formatting for `src/**/*.ts`.                |

---

## Observability

- `pino-http` middleware injects a logger into each request and assigns a `requestId` (propagated from `x-request-id`).
- `LOG_LEVEL` tunes verbosity per environment.
- Centralized `errorHandler` logs structured payloads and hides stack traces from clients.
- `/api/health` returns `200` when both API and database are healthy; otherwise `503` with `database: 'error'`.

---

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run db:init`
- `npm run test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`

---

## API Surface

| Method | Endpoint                | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| GET    | `/api/health`           | Health-check (verifies DB connectivity).      |
| GET    | `/api/lists`            | Retrieve all lists.                           |
| POST   | `/api/lists`            | Create a list (`name`).                       |
| PUT    | `/api/lists/:id`        | Update a list name.                           |
| DELETE | `/api/lists/:id`        | Delete a list (cascade deletes duties).       |
| GET    | `/api/duties`           | Retrieve duties (optional `list_id` filter).  |
| POST   | `/api/duties`           | Create a duty (`name`, optional `list_id`, optional `status`). |
| PUT    | `/api/duties/:id`       | Update duty name or status.                   |
| DELETE | `/api/duties/:id`       | Delete a duty.                                |

---

## Troubleshooting

- **Port already in use** → change `PORT` in `.env` and restart.
- **Database connection failures** → ensure the Docker container is running (`docker ps`) and credentials match `.env`.
- **Jest cannot find types** → reinstall dependencies and confirm `tsconfig.json` includes `"types": ["node", "jest"]`.
- **CRLF vs LF lint errors** → run `npm run lint:fix` or `npx prettier --write src`.
- **Verbose logs** → set `LOG_LEVEL=warn` or `error` in `.env` for quieter environments.

---

Need UI screenshots or usage instructions? Those live in the frontend repository README. This document focuses solely on the backend service.
