import { Hono } from "hono";

const app = new Hono();

app.patch("/save-metadata", async (c) => {});

app.patch("/save-thumbnail", async (c) => {});

export default app;
