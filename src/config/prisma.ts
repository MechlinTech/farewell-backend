import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

// Determine if SSL should be used based on connection string
// For localhost, disable SSL; for cloud/production, enable it
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

// 1. Create a standard Postgres connection pool
const pool = new Pool({
  connectionString,
  ssl: isLocalhost 
    ? false 
    : {
        rejectUnauthorized: false,
      },
});

// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to Prisma
const prisma = new PrismaClient({ adapter });

export default prisma;