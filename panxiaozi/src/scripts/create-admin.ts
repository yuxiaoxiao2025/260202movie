import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { user } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 获取项目根目录并加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

// 加载环境变量
dotenv.config({ path: path.join(rootDir, ".env.local") });

async function createAdmin() {
  try {
    console.log("数据库连接信息:");
    console.log("HOST:", process.env.DATABASE_HOST);
    console.log("PORT:", process.env.DATABASE_PORT);
    console.log("DATABASE:", process.env.DATABASE_NAME);
    console.log("USER:", process.env.DATABASE_USERNAME);

    // 创建直接的数据库连接
    console.log("准备连接数据库...");

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

    // 生成管理员密码
    const username = "admin@qq.com";
    const plainPassword = "test123";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 检查用户是否已存在
    const existingUsers = await db
      .select()
      .from(user)
      .where(eq(user.username, username));

    if (existingUsers.length > 0) {
      console.log("用户名已存在，将更新密码");
      await db
        .update(user)
        .set({ password: hashedPassword })
        .where(eq(user.username, username));
    } else {
      console.log("创建新管理员用户");
      await db.insert(user).values({
        username,
        password: hashedPassword,
      });
    }

    console.log("加密后的密码:", hashedPassword);
    console.log("管理员用户创建/更新成功！");
    console.log("用户名:", username);
    console.log("密码:", plainPassword);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("创建管理员用户失败:", error);
    process.exit(1);
  }
}

createAdmin();
