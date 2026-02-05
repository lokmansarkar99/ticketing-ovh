import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: parseInt(process.env.CONNECTION_LIMIT)
});
const prisma = new PrismaClient({
    errorFormat: "minimal",
     adapter 
    });


export default prisma;
