import { PrismaClient } from '@prisma/client';

class PrismaClientPool {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient({
      log: ["query", "info", "warn", "error"]
    });
  }
  getClient() {
    return this.client;
  }
}

const clientPool = new PrismaClientPool();

export type Context = {
  prisma: PrismaClient
};

export const context: Context = {
  prisma: clientPool.getClient()
}