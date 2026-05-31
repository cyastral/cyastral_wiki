import { listLocalDatabases } from "@prisma/adapter-d1";
import "dotenv/config";
import { defineConfig, env } from "prisma/config";


const allDbs = listLocalDatabases();
const validDbs = allDbs.filter((db) => !db.endsWith("metadata.sqlite"));
const targetDbUrl = validDbs.length > 0 ? `file:${validDbs.pop()}` : "";

export default defineConfig(
    {
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: targetDbUrl,
    },
});
