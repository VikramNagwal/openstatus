import { expect, test } from "bun:test";

import { app } from "@/index";
import { PageSchema } from "./schema";

test("create a valid page", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-openstatus-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "OpenStatus",
      description: "OpenStatus website",
      slug: "openstatus",
      monitors: [1],
    }),
  });

  const result = PageSchema.safeParse(await res.json());

  expect(res.status).toBe(200);
  expect(result.success).toBe(true);
});

test("create a page with invalid monitor ids should return a 400", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-openstatus-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "OpenStatus",
      description: "OpenStatus website",
      slug: "another-openstatus",
      monitors: [404],
    }),
  });

  expect(res.status).toBe(400);
});

test("create a page with password on free plan should return a 402", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-openstatus-key": "2",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: "OpenStatus",
      description: "OpenStatus website",
      slug: "password-openstatus",
      passwordProtected: true,
    }),
  });

  expect(res.status).toBe(402);
});

test("create a email page with invalid payload should return a 400", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "x-openstatus-key": "1",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "OpenStatus",
      provider: "email",
      payload: { hello: "world" },
    }),
  });

  expect(res.status).toBe(400);
});

test("no auth key should return 401", async () => {
  const res = await app.request("/v1/page", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  expect(res.status).toBe(401);
});
