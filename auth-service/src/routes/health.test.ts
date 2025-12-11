import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../server.js";

describe("Health Route", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer({ logger: false });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should return ok status from health endpoint", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ok",
      service: "auth-service",
    });
  });
});
