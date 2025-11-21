// Note: For static builds (GitHub Pages), Prisma client is mocked
// The actual PrismaClient is not available without the generated types

/**
 * Global Prisma client
 *
 * Only one instance of Prisma is kept across hot reloads to prevent
 * "FATAL: sorry, too many clients already" error.
 * @see https://github.com/prisma/prisma/issues/1983
 */

// Mock PrismaClient for static builds
class MockPrismaClient {
  config = {} as any;
  user = {} as any;
  palette = {} as any;
  configView = {} as any;
  $disconnect = async () => {};
  $connect = async () => {};
}

type PrismaClient = MockPrismaClient;
let prisma: PrismaClient;

const g = global as unknown as { prisma: PrismaClient | undefined };

if (process.env.NODE_ENV === "production") {
  prisma = new MockPrismaClient() as any;
} else {
  if (!g.prisma) {
    g.prisma = new MockPrismaClient() as any;
  }

  prisma = g.prisma!; // Type assertion: g.prisma is guaranteed to be defined here
}

export { prisma };
