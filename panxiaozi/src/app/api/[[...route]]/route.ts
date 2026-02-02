import { Hono } from "hono";
import { handle } from "hono/vercel";
import resource from "@/routes/resource";
import category from "@/routes/category";
import user from "@/routes/user";
import resourceDisk from "@/routes/resource-disk";
import { authMiddleware } from "@/middleware/auth";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.route("/category", category);

app.route("/resource", resource);
app.route("/resource-disk", resourceDisk);
app.route("/user", user);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
