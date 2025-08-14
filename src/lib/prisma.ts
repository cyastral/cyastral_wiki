import { PrismaClient as PrismaClientWasm } from "@prisma/client/wasm";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

  //CF环境缓存PrismaClient实例
  const cache = new WeakMap<D1Database, PrismaClientWasm>()

export async function getPrisma() {
  if (process.env.NODE_ENV === 'production') {
    const { env } = await getCloudflareContext({ async: true })
    const db = env.DB as D1Database
    let client = cache.get(db)
    if (!client) {
      client = new PrismaClientWasm({ adapter: new PrismaD1(db) })
      cache.set(db, client)
    }
    return client
  }
  else {
    return new PrismaClient()
  }
}