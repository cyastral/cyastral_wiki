import { PrismaClient as PrismaClientWasm } from "@prisma/client/wasm";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

//CF环境缓存PrismaClient实例
const cache = new WeakMap<D1Database, PrismaClientWasm>();

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
                client = new PrismaClientWasm({ adapter: new PrismaD1(db) });
                cache.set(db, client);
            }
            return client;
        } catch {
            // Fall back to Node Prisma client when Cloudflare runtime context is unavailable.
        }
    }
    return new PrismaClient();
}
