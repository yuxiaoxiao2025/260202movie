import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  getResourcePageList,
  saveResource,
  deleteResource,
} from "@/lib/db/queries/resource";
import { authMiddleware } from "@/middleware/auth";

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(10),
  title: z.string().optional(),
  category: z.string().optional(),
});

const saveSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string(),
  categoryKey: z.string(),
  url: z.string(),
  pinyin: z.string(),
  desc: z.string(),
  diskType: z.string(),
  hotNum: z.coerce.number(),
  isShowHome: z.coerce.number().optional().default(0),
});

const deleteSchema = z.object({
  id: z.coerce.number(),
});

const app = new Hono().use("*", authMiddleware);

app.get("/list", zValidator("query", querySchema), async (c) => {
  const { page, pageSize, title, category } = c.req.valid("query");
  const result = await getResourcePageList(page, pageSize, title, category);
  return c.json(result);
});

app.post("/save", zValidator("json", saveSchema), async (c) => {
  const {
    id,
    title,
    categoryKey,
    url,
    pinyin,
    desc,
    diskType,
    hotNum,
    isShowHome,
  } = c.req.valid("json");
  await saveResource(
    id,
    title,
    categoryKey,
    url,
    pinyin,
    desc,
    diskType,
    hotNum,
    isShowHome,
  );
  return c.json({
    message: "保存成功",
  });
});

app.post("/delete", zValidator("json", deleteSchema), async (c) => {
  const { id } = c.req.valid("json");
  await deleteResource(id);
  return c.json({
    message: "删除成功",
  });
});

export default app;
