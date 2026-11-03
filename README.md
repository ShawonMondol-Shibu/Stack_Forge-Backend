# Stack Forge Backend

Backend API for [Stack Forge](https://github.com/ShawonMondol-Shibu/Stack_Forge), a developer workspace for building a professional identity (profile, portfolio, skills, experience, education) and managing the work behind it (projects, tasks, notes, GitHub activity). This service provides authentication, the data API, social follows, project likes, GitHub integration, and an AI assistant endpoint.

## Features

- Email and password authentication with [Better Auth](https://www.better-auth.com/), including an `admin` role
- Optional GitHub OAuth account linking for the GitHub workspace
- GitHub dashboard aggregation: profile, repositories (up to 500) and recent public activity
- Developer profiles with skills, tech stack, work experience and education
- Projects with likes and a "trending" list (most-liked projects of the last 7 days)
- Tasks (status and priority) and personal notes
- Follow and unfollow developers; public follower and following lists
- Streaming AI assistant through OpenRouter and the Vercel AI SDK, with a Stack Forge system prompt
- PostgreSQL persistence with Drizzle ORM and versioned migrations
- Request validation (whitelisting) and interactive Swagger documentation

## How it fits with the frontend

Browsers never call this API directly. The Next.js frontend forwards two path prefixes to it with rewrites, so authentication cookies are first-party on the frontend's domain:

```text
Browser ──► Next.js (frontend origin)
              ├─ /api/auth/*  ──►  this API  /api/auth/*   (Better Auth)
              └─ /backend/*   ──►  this API  /*            (data API)
```

Because of this, `BETTER_AUTH_URL` must be the **frontend's** public URL, not the address of this API. The frontend's `next.config.ts` needs a `BACKEND_URL` that points at this service (for example `http://localhost:5000`).

## Tech stack

- [NestJS](https://nestjs.com/) 11 and TypeScript
- [Bun](https://bun.sh/) for installing dependencies and running scripts (production runs on Node.js)
- PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) and Drizzle Kit
- Better Auth with [`@thallesp/nestjs-better-auth`](https://www.npmjs.com/package/@thallesp/nestjs-better-auth)
- GitHub OAuth and the GitHub REST API
- Vercel AI SDK 7 with the OpenRouter provider
- Swagger / OpenAPI, Jest and Prettier/ESLint

## Requirements

- Bun
- A PostgreSQL database
- An OpenRouter API key, to use the AI endpoint
- A GitHub OAuth App, to use the GitHub workspace

## Getting started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Copy `.env.example` to `.env` and fill in the values (see [Environment variables](#environment-variables)):

   ```dotenv
   DATABASE_URL=postgres://user:password@localhost:5432/stackforge
   BETTER_AUTH_SECRET=replace-with-a-long-random-secret
   BETTER_AUTH_URL=http://localhost:3000
   PORT=5000
   OPENROUTER_API_KEY=your-openrouter-api-key

   # Optional: GitHub workspace
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
   ```

3. Create a GitHub OAuth App and set its authorization callback URL to:

   ```text
   <BETTER_AUTH_URL>/api/auth/callback/github
   ```

   For local development that is `http://localhost:3000/api/auth/callback/github`, because the callback goes through the frontend. In production, use your frontend's public URL.

4. Apply database migrations:

   ```bash
   bunx drizzle-kit migrate
   ```

5. Start the development server:

   ```bash
   bun run start:dev
   ```

The API listens on `http://localhost:5000` by default. Start the frontend as well and point its `BACKEND_URL` at this address.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. The app starts with `prepare: false`, so a transaction-mode pooler works. |
| `BETTER_AUTH_SECRET` | Yes | Long random secret used by Better Auth to sign and encrypt data. |
| `BETTER_AUTH_URL` | Yes in production | Public URL of the frontend. Used as Better Auth's base URL (OAuth callback, redirects, cookies), as the trusted origin, and as the CORS origin. Defaults to `http://localhost:3000`. |
| `PORT` | No | Port to listen on. Defaults to `5000`. |
| `OPENROUTER_API_KEY` | For `/ai` | OpenRouter API key. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | For GitHub | Both must be set to enable the GitHub provider. If either is missing, GitHub linking is disabled. |

## API documentation

With the server running, open [http://localhost:5000/api/docs](http://localhost:5000/api/docs) for the Swagger UI.

## Authentication and access levels

Authentication is handled by Better Auth under `/api/auth/*` (email and password, GitHub OAuth). Every route requires a signed-in session unless marked otherwise. The access levels used below are:

| Level | Meaning |
| --- | --- |
| Public | No session needed |
| Session | Signed-in user required. Data is scoped to that user where noted. |
| Optional | Works without a session; with one, the response includes per-user details |
| Admin | Signed-in user with the `admin` role |

## API reference

| Area | Routes | Access |
| --- | --- | --- |
| Profile | `POST /profile`, `GET /profile`, `PATCH /profile/:id` | Session (`GET /profile` returns your profile) |
| | `GET /profile/all`, `GET /profile/:id` | Public |
| Skills | `POST /skills`, `GET /skills`, `PATCH /skills/:id`, `DELETE /skills/:id` | Session (`GET /skills` lists yours) |
| | `GET /skills/:id` | Public |
| Tech stack | `GET /tech-stack`, `GET /tech-stack/:id` | Public |
| | `POST /tech-stack`, `PATCH /tech-stack/:id`, `DELETE /tech-stack/:id` | Admin |
| Experiences | `POST /experiences`, `GET /experiences`, `PATCH /experiences/:id`, `DELETE /experiences/:id` | Session (`GET /experiences` lists yours) |
| | `GET /experiences/profile/:profileId` | Public |
| Education | `POST /education`, `GET /education`, `PATCH /education/:id`, `DELETE /education/:id` | Session (`GET /education` lists yours) |
| | `GET /education/user/:userId`, `GET /education/:id` | Public |
| Projects | `POST /projects`, `GET /projects`, `GET /projects/:id`, `PATCH /projects/:id`, `DELETE /projects/:id` | Session (`GET /projects` lists yours) |
| | `POST /projects/:id/like`, `DELETE /projects/:id/like` | Session |
| | `GET /projects/trending?limit=10` | Optional (adds `likedByMe` when signed in) |
| Tasks | `POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id` | Session |
| Notes | `POST /notes`, `GET /notes`, `GET /notes/:id`, `PATCH /notes/:id`, `DELETE /notes/:id` | Session (scoped to the signed-in user) |
| Follows | `POST /follows`, `GET /follows`, `GET /follows/followers`, `DELETE /follows/:followingId` | Session (`GET /follows` is who you follow) |
| | `GET /follows/:userId/followers`, `GET /follows/:userId/following` | Public |
| GitHub | `GET /github/dashboard` | Session |
| AI | `POST /ai` | Public |
| Users | `GET /users/all`, `GET /users/:id` | Admin |
| | `GET /users/stats` | Session |

Task `status` is `todo`, `in_progress` or `done`; `priority` is `high`, `medium` or `low`. Profile `availability` is `open`, `busy` or `unavailable`.

## GitHub integration

`GET /github/dashboard` returns:

```json
{
  "connected": true,
  "profile": { "login": "...", "followers": 0, "publicRepos": 0 },
  "repositories": [],
  "activity": []
}
```

- **Not connected:** if the user has no linked GitHub account, or GitHub rejects the stored token (401), the response is `connected: false` with empty data, so the frontend can show the "Connect GitHub" state.
- **Repositories:** fetched in pages of 100, up to 500, sorted by last update. Archived repositories are left out, and `publicRepos` counts the public repositories in the returned list.
- **Activity:** the 30 most recent public events.
- **Scopes:** the OAuth scopes are `read:user` and `user:email`, so only public repositories are visible. Add `repo` to the GitHub provider scopes in `src/lib/auth/auth.ts` if you need private repositories, and ask existing users to reconnect.
- **Errors:** other GitHub failures return `503` with a short message; details are logged on the server. Each GitHub request times out after 10 seconds.

## AI assistant

`POST /ai` accepts `{ "messages": UIMessage[] }` (the format used by the AI SDK `useChat` hook) and streams the reply. The model is `nvidia/nemotron-3.5-lightning:free` through OpenRouter. The assistant's behavior is defined in `src/ai/system-prompt.ts`; it is written for a chat UI that shows plain text, so it avoids markdown.

The endpoint is public and has no rate limiting, so add throttling before exposing it to real traffic.

## Database

Tables are defined in the `entities` folder of each module and in `src/lib/database/schema/auth-schema.ts`, and are exported from `src/lib/database/schema.ts`:

- Authentication: `user`, `session`, `account`, `verification`
- Domain: `profile`, `skill`, `techStack`, `experiences`, `education`, `projects`, `projectLikes`, `tasks`, `notes`, `follows`

Update the schema, then generate and apply a migration:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

Migrations are stored in `drizzle/migrations`.

## Project structure

```text
src/
├── main.ts              # Bootstrap: CORS, validation, Swagger
├── app.module.ts        # Root module (Better Auth + feature modules)
├── lib/
│   ├── auth/auth.ts     # Better Auth configuration
│   └── database/        # Drizzle client and schema
├── ai/                  # /ai endpoint, OpenRouter service, system prompt
├── github/              # /github/dashboard
├── profile/ skills/ tech_stack/ experiences/ education/
├── projects/ tasks/ notes/ follows/
└── users/               # Admin user endpoints
drizzle/migrations/      # Generated SQL migrations
test/                    # End-to-end tests
```

Most feature modules follow the same layout: `controller`, `service`, `dto/` and `entities/`.

## Scripts

```bash
bun run start:dev     # Start in watch mode
bun run build         # Compile to dist/
bun run start:prod    # Run the compiled build (node dist/src/main)
bun run lint          # ESLint with auto-fix
bun run format        # Prettier
bun run test          # Unit tests
bun run test:cov      # Unit tests with coverage
bun run test:e2e      # End-to-end tests
```

## Deployment notes

- Set every variable from [Environment variables](#environment-variables) on the host, and run `bunx drizzle-kit migrate` against the production database.
- Set `BETTER_AUTH_URL` to the frontend's public HTTPS URL, and use `<that URL>/api/auth/callback/github` as the GitHub OAuth callback.
- The frontend's `BACKEND_URL` must be reachable from the frontend's server (the Next.js rewrites call it server-side).
- Preview deployments with a different origin must be added to `trustedOrigins` in `src/lib/auth/auth.ts`.
- Swagger is served at `/api/docs`; consider restricting it in production.

## Current scope

The API covers profiles, portfolio data, projects, tasks, notes, follows, GitHub and AI. There is no messaging API yet; the frontend's Messages page uses demo data.

## License

This project is currently marked `UNLICENSED` in `package.json`.