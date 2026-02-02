import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  getResourceDiskUrl,
  updateResourceDiskUrl,
} from "@/lib/db/queries/resource-disk";
import { getCategoryByKey } from "@/lib/db/queries/category";
import { notice } from "@/utils/notice";

// 定义请求体验证模式
const updateSchema = z.object({
  id: z.number(),
  title: z.string(),
  categoryKey: z.string(),
  externalUrl: z.string(),
});

const app = new Hono();

// 更新资源磁盘URL的路由
app.post("/update", zValidator("json", updateSchema), async (c) => {
  const { id, title, categoryKey, externalUrl } = c.req.valid("json");
  const url = await getResourceDiskUrl(id);
  if (url) {
    return c.json({
      message: "获取成功",
      url: url,
    });
  }
  const category = await getCategoryByKey(categoryKey);
  const quarkApi = process.env.QUARK_API;
  const response = await fetch(`${quarkApi}/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      share_url: externalUrl,
      save_path: `/${category.name}`,
      gen_passcode: false,
      expire_days: 1,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    await notice(
      `告警：资源磁盘转存失败\nhttp状态码：${response.status}\n响应体：${errorText}`,
    );
    throw new Error("转存失败");
  }

  const data = await response.json();
  console.log(data);
  if (data.message?.includes("capacity limit")) {
    await notice("告警：资源磁盘容量不足，请及时清理");
  }

  const newUrl = data.share_url; // 获取转存后的URL
  await updateResourceDiskUrl(id, newUrl);
  return c.json({
    message: "获取成功",
    url: newUrl,
  });
});

export default app;
