import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db';
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';
import 'dotenv/config';

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

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ['read:user', 'user:email'],
    },
  },

  plugins: [admin()],
});
