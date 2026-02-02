import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { resource, resourceDisk } from "../lib/db/schema";
import * as dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取项目根目录并加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

// 加载环境变量
dotenv.config({ path: path.join(rootDir, ".env.local") });

async function migrateResourceDisk() {
  try {
    console.log("开始迁移网盘数据...");

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    console.log("数据库连接成功");

    // 创建 Drizzle 实例
    const db = drizzle(connection);

    // 获取所有资源数据
    const resources = await db.select().from(resource);
    console.log(`找到 ${resources.length} 条资源数据`);

    // 迁移数据
    let successCount = 0;
    let errorCount = 0;

    for (const res of resources) {
      try {
        await db.insert(resourceDisk).values({
          resourceId: res.id,
          diskType: res.diskType,
          externalUrl: res.url, // 将原 url 作为 externalUrl
          url: res.url,
          updatedAt: res.updatedAt,
        });
        successCount++;
      } catch (error) {
        console.error(`迁移资源 ID ${res.id} 失败:`, error);
        errorCount++;
      }
    }

    console.log("迁移完成！");
    console.log(`成功: ${successCount} 条`);
    console.log(`失败: ${errorCount} 条`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("迁移失败:", error);
    process.exit(1);
  }
}

migrateResourceDisk();
