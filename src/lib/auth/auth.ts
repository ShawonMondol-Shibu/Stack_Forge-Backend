import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../database/db'; // your drizzle instance
import * as schema from '../database/schema';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
