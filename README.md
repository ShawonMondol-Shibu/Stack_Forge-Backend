# Stack Forge Backend

Backend API for Stack Forge, a platform for developer profiles and professional portfolios. It provides authentication, profile and portfolio management, social follows, and an AI response endpoint.

## Features

- Email and password authentication powered by [Better Auth](https://www.better-auth.com/)
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
- Swagger / OpenAPI
- OpenRouter and the AI SDK

## Requirements

- Bun
- PostgreSQL
- An OpenRouter API key to use the AI endpoint

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
   ```

   `DATABASE_URL` is required. `BETTER_AUTH_URL` should be the frontend origin allowed to call this API. `PORT` defaults to `5000`. `OPENROUTER_API_KEY` is only needed for AI requests.

3. Apply database migrations:

   ```bash
   bunx drizzle-kit migrate
   ```

4. Start the development server:

   ```bash
   bun run start:dev
   ```

The API listens on `http://localhost:5000` by default.

## API documentation

With the server running, open [http://localhost:5000/api/docs](http://localhost:5000/api/docs) to browse the OpenAPI endpoint list.

## API areas

| Area | Base path | Description |
| --- | --- | --- |
| Authentication | Better Auth | Email and password authentication |
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
