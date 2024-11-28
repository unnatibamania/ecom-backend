 import { config } from "dotenv";

 import {defineConfig} from 'drizzle-kit'

 config({ path: '.env' });

 export default defineConfig({
    out: './drizzle',
    schema: './src/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.POSTGRES_URL!,
    },
  });