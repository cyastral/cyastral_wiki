import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

//CF环境缓存PrismaClient实例
const cache = new WeakMap<D1Database, PrismaClient>();

export async function getPrisma() {
    const { env } = await getCloudflareContext({ async: true });
    if (!env || !env.DB) {
        throw new Error("Cloudflare env.DB is not defined. Please check your bindings in wrangler.toml or dev script.");
    }

    const db = env.DB as D1Database;
    let client = cache.get(db);

    if (!client) {
        client = new PrismaClient({ adapter: new PrismaD1(db) });
        cache.set(db, client);
    }

    return client;
}
