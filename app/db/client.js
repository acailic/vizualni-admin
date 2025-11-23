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
    constructor() {
        this.config = {};
        this.user = {};
        this.palette = {};
        this.configView = {};
        this.$disconnect = async () => { };
        this.$connect = async () => { };
    }
}
let prisma;
const g = global;
if (process.env.NODE_ENV === "production") {
    prisma = new MockPrismaClient();
}
else {
    if (!g.prisma) {
        g.prisma = new MockPrismaClient();
    }
    prisma = g.prisma; // Type assertion: g.prisma is guaranteed to be defined here
}
export { prisma };
