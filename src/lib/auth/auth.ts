import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db'; // your drizzle instance
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';
import 'dotenv/config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    schema,
  }),

  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
      trustedProxies: [
        process.env.BETTER_AUTH_URL as string,
        'http://localhost:3000',
      ],
    },
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    'http://localhost:3000',
  ],

  emailAndPassword: {
    enabled: true,
  },

  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientKey: process.env.GOOGLE_CLIENT_KEY,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientKey: process.env.GITHUB_CLIENT_KEY,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },

  plugins: [admin()],
});
