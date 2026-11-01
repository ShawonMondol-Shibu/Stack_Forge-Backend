import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db';
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';
import 'dotenv/config';

const githubOAuthEnabled =
  Boolean(process.env.GITHUB_CLIENT_ID) &&
  Boolean(process.env.GITHUB_CLIENT_SECRET);

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
      trustedProxies: [
        (process.env.BETTER_AUTH_URL as string) || 'http://localhost:3000',
      ],
    },
  },

  trustedOrigins: [
    (process.env.BETTER_AUTH_URL as string) || 'http://localhost:3000',
  ],

  emailAndPassword: {
    enabled: true,
  },

  ...(githubOAuthEnabled
    ? {
        socialProviders: {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            scope: ['read:user', 'user:email'],
          },
        },
      }
    : {}),

  plugins: [admin()],
});
