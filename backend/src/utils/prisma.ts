import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: parseInt(process.env.CONNECTION_LIMIT || '50'),
  idleTimeout: 60, // Close idle connections after 60s to prevent silent drops
  connectTimeout: 10000, // 10s timeout for connecting
  minDelayValidation: 0, // Validate connection on every acquire
  allowPublicKeyRetrieval: true // FIX: Required for MySQL 8 caching_sha2_password without TLS
});
const prisma = new PrismaClient({
    errorFormat: "minimal",
     adapter 
    });


export default prisma;
