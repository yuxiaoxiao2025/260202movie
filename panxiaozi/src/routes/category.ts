import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  deleteCategory,
  getCategoryList,
  getCategoryPageList,
  saveCategory,
} from "@/lib/db/queries/category";
import { deleteResource } from "@/lib/db/queries/resource";
import { authMiddleware } from "@/middleware/auth";

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(10),
  name: z.string().optional(),
});

const saveSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string(),
  key: z.string(),
});

const deleteSchema = z.object({
  id: z.coerce.number(),
});

const app = new Hono().use("*", authMiddleware);

app.get("/all", async (c) => {
  const result = await getCategoryList();
  return c.json(result);
});

app.get("/list", zValidator("query", querySchema), async (c) => {
  const { page, pageSize, name } = c.req.valid("query");
  const result = await getCategoryPageList(page, pageSize, name);
  return c.json(result);
});

app.post("/save", zValidator("json", saveSchema), async (c) => {
  const { id, name, key } = c.req.valid("json");
  await saveCategory(id, name, key);
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
