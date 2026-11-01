import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db';
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';
import 'dotenv/config';

const githubOAuthEnabled =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

// Backend origin (where better-auth runs).
const backendUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

// Frontend origin(s). Comma-separated, e.g. "https://app.example.com,http://localhost:3001".
// The browser sends this as the Origin header and as the absolute callbackURL,
// so better-auth must trust it.
const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:3001')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  advanced: {
    cookieOptions: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
      // `trustedProxies` was removed: it only accepts IP addresses or CIDR
      // ranges, and a URL there is ignored with a warning. If you sit behind
      // a known proxy, add its IP/CIDR, e.g. trustedProxies: ['10.0.0.0/8'].
    },
  },

  trustedOrigins: [backendUrl, ...frontendUrls],

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
