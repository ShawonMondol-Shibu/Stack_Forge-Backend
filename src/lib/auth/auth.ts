import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db';
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';
import 'dotenv/config';

const githubOAuthEnabled =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

// Public URL of the FRONTEND (the Next.js app), e.g. http://localhost:3000 or
// https://app.example.com. Browsers only talk to Next; Next forwards
// /api/auth/* and /backend/* to this Nest app (see next.config.ts), so
// better-auth must build its URLs (OAuth redirect_uri, redirects, cookies)
// from the frontend origin, not from the Nest address (localhost:5000).
const appUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const auth = betterAuth({
  baseURL: appUrl,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  // No `advanced.cookieOptions` override: requests are same-origin now, so the
  // defaults apply (SameSite=Lax, HttpOnly, Secure when appUrl is https).
  // `sameSite: 'none'` is only needed when the browser calls this API directly
  // from a different site.
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
    },
  },

  // Origins allowed to send auth requests and to be used as callbackURL.
  // Add extra origins here if you need them (e.g. preview deployments).
  trustedOrigins: [appUrl],

  emailAndPassword: {
    enabled: true,
  },

  // Optional: encrypt stored OAuth tokens. The GitHub token can read the
  // user's repositories, so it shouldn't sit in the database as plain text.
  // After enabling, users may need to reconnect GitHub once.
  // account: { encryptOAuthTokens: true },

  ...(githubOAuthEnabled
    ? {
        socialProviders: {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            // Add 'repo' to also list private repositories. It is a broad
            // permission, so only do it if you really need private repos.
            scope: ['read:user', 'user:email'],
          },
        },
      }
    : {}),

  plugins: [admin()],
});
