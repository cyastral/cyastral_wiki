import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
//CF环境缓存PrismaClient实例
const cache = new WeakMap<D1Database, PrismaClient>();

const useD1 =
    process.env.PRISMA_TARGET === "d1" ||
    (process.env.PRISMA_TARGET !== "node" &&
        process.env.NODE_ENV === "production");

export async function getPrisma() {

    if (useD1) {
        try {
            const { env } = await getCloudflareContext({ async: true });
            const db = env.DB as D1Database;
            let client = cache.get(db);
            if (!client) {
                client = new PrismaClient({ adapter: new PrismaD1(db) });
                cache.set(db, client);
            }
            return client;
        } catch {
            // Fall back to Node Prisma client when Cloudflare runtime context is unavailable.
        }
    }
    {
        const connectionString = `${process.env.DATABASE_URL}`;
        const adapter = new PrismaBetterSqlite3({url : connectionString})
        return new PrismaClient({adapter});
    }
}
