# Cyastral Wiki

基于 Next.js + Cloudflare Workers（OpenNext）+ Prisma + Cloudflare D1 的项目。

## 数据库工作流

### 职责分工

- **Prisma** 只负责"根据 `prisma/schema.prisma` 生成 SQL"，它**不直连 D1**（D1 不支持 Prisma Migrate 所需的 shadow database）。
- **Wrangler** 负责把 SQL **应用**到数据库（本地模拟 / 远程），并在 D1 的 `d1_migrations` 表里追踪已应用的迁移。
- 二者通过 `prisma/migrations/` 下的**扁平 `.sql` 文件**衔接。注意：**Wrangler 只读取扁平 `.sql`，不会进入子目录**。

### 修改 schema 后的标准流程

```bash
# 1. 修改 prisma/schema.prisma

pnpm db:create <name>

# 3. 生成增量 SQL 写入该文件
pnpm db:diff prisma/migrations/000X_<name>.sql

# 4. 应用到本地模拟 D1（.wrangler/state/v3/d1）
pnpm db:apply:local

# 5. 重新生成 Prisma Client
pnpm prisma generate

# 6. 确认远程缺哪些迁移，然后推到云端
pnpm db:check
pnpm db:deploy
```

### 命令速查

| 命令                    | 作用                           |
| ----------------------- | ------------------------------ |
| `pnpm db:create <name>` | 创建空迁移文件                 |
| `pnpm db:diff`          | 据 schema 生成增量 SQL         |
| `pnpm db:apply:local`   | 把迁移应用到本地模拟 D1        |
| `pnpm db:check`         | 查看远端 D1 有哪些迁移尚未应用 |
| `pnpm db:deploy`        | 把迁移同步到云端 D1            |
| `pnpm deploy`           | 构建并发布前端到 Cloudflare    |
