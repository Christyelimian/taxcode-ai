/**
 * Shared Prisma Client initialization
 * Use this instead of directly instantiating PrismaClient
 */

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Lazy-initialize Prisma client
let prismaInstance: PrismaClient | null = null;
let prismaError: Error | null = null;

export function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  
  if (prismaError) {
    throw prismaError;
  }
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || typeof dbUrl !== 'string' || dbUrl.trim().length === 0) {
    prismaError = new Error(
      'DATABASE_URL environment variable is not set or is empty. Cannot initialize Prisma client.'
    );
    console.error('Prisma initialization error:', prismaError.message);
    throw prismaError;
  }
  
  try {
    // Prisma 7.2.0+ requires a driver adapter for the Rust-free engine
    // Use the native pg Pool adapter for PostgreSQL
    const pool = new Pool({
      connectionString: dbUrl,
    });
    
    const adapter = new PrismaPg(pool);
    
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    return prismaInstance;
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error) || 'Unknown Prisma initialization error';
    prismaError = error instanceof Error ? error : new Error(errorMessage);
    console.error('Prisma Client initialization failed:', {
      message: errorMessage,
      error: error,
      stack: error?.stack,
      clientVersion: error?.clientVersion,
    });
    throw prismaError;
  }
}

// Export a singleton instance for convenience
export const prisma = getPrismaClient();



