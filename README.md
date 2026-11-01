# Stack Forge Backend

Backend API for Stack Forge, a platform for developer profiles and professional portfolios. It provides authentication, profile and portfolio management, social follows, GitHub integration, and an AI response endpoint.

## Features

- Email and password authentication powered by [Better Auth](https://www.better-auth.com/)
- Optional GitHub OAuth account linking for the GitHub workspace
- Authenticated GitHub profile, repository, and recent activity aggregation
- User profiles with skills, projects, notes, tech stack, experience, and education
- Follow and unfollow users; retrieve follower and following lists
- AI response streaming through OpenRouter
- PostgreSQL persistence with Drizzle ORM and migrations
- Interactive API documentation with Swagger UI
- Request validation and CORS configuration

## Tech stack

- [NestJS](https://nestjs.com/) 11 and TypeScript
- [Bun](https://bun.sh/)
- PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/), and Drizzle Kit
- Better Auth
- GitHub OAuth + GitHub REST API
- Swagger / OpenAPI
- OpenRouter and the AI SDK

## Requirements

- Bun
- PostgreSQL
- An OpenRouter API key to use the AI endpoint
- A GitHub OAuth App for the GitHub workspace integration

## Getting started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   DATABASE_URL=postgres://user:password@localhost:5432/stackforge
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=replace-with-a-long-random-secret
   PORT=5000
   OPENROUTER_API_KEY=your-openrouter-api-key

   # GitHub OAuth — required for the GitHub dashboard
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
   ```

   `DATABASE_URL` is required. `BETTER_AUTH_URL` should be the frontend origin allowed to call this API. `PORT` defaults to `5000`. `OPENROUTER_API_KEY` is only needed for AI requests. GitHub OAuth variables are required only when using the GitHub workspace.

3. Create a GitHub OAuth App and set its authorization callback URL to:

   ```text
   http://localhost:5000/api/auth/callback/github
   ```

   For production, use the equivalent callback URL for your deployed backend.

4. Apply database migrations:

   ```bash
   bunx drizzle-kit migrate
   ```

5. Start the development server:

   ```bash
   bun run start:dev
   ```

The API listens on `http://localhost:5000` by default.

## API documentation

With the server running, open [http://localhost:5000/api/docs](http://localhost:5000/api/docs) to browse the OpenAPI endpoint list.

## API areas

| Area | Base path | Description |
| --- | --- | --- |
| Authentication | Better Auth | Email/password and GitHub OAuth |
| Users | `/users` | User lookup |
| Profiles | `/profile` | Create, retrieve, and update profiles |
| Skills | `/skills` | Manage profile skills |
| Projects | `/projects` | Manage projects |
| Tasks | `/tasks` | Manage tasks |
| Tech stack | `/tech-stack` | Manage technologies |
| Follows | `/follows` | Follow, unfollow, and list followers/following |
| Notes | `/notes` | Manage notes |
| Experiences | `/experiences` | Manage work experience |
| Education | `/education` | Manage education records |
| GitHub | `/github/dashboard` | Authenticated GitHub workspace data |
| AI | `/ai` | Stream AI responses |

Most endpoints use the authenticated Better Auth session. Some read endpoints and the AI endpoint are public. Swagger UI lists the NestJS API routes.

## Development commands

```bash
# Start in watch mode
bun run start:dev

# Build
bun run build

# Run unit tests
bun run test

# Run end-to-end tests
bun run test:e2e

# Run tests with coverage
bun run test:cov
```

## Database workflow

Update the Drizzle schema, then generate and apply a migration:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

## License

This project is currently marked `UNLICENSED` in `package.json`.
