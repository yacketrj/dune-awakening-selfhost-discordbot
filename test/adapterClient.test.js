import assert from "node:assert/strict";
import { test } from "node:test";
import { AdapterClient, AdapterHttpError } from "../src/adapterClient.js";

function config(overrides = {}) {
  return {
    adapter: {
      baseUrl: "http://console-api:3000",
      token: "adapter-token",
      timeoutMs: 1000,
      paths: {
        health: "/health",
        status: "/status",
        readiness: "/readiness",
        services: "/services"
      },
      methods: {
        health: "GET",
        status: "POST",
        readiness: "POST",
        services: "POST"
      },
      ...overrides
    }
  };
}

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status || 200,
    headers: { "content-type": "application/json" }
  });
}

test("AdapterClient sends bearer token and parses JSON", async () => {
  const seen = [];
  const client = new AdapterClient(config(), {
    fetchImpl: async (url, options) => {
      seen.push({ url: String(url), options });
      return jsonResponse({ ok: true });
    }
  });

  const result = await client.health({ userId: "user-1" });
  assert.deepEqual(result, { ok: true });
  assert.equal(seen[0].url, "http://console-api:3000/health");
  assert.equal(seen[0].options.method, "GET");
  assert.equal(seen[0].options.headers.authorization, "Bearer adapter-token");
  assert.equal(seen[0].options.body, undefined);
});

test("AdapterClient posts actor context to POST routes", async () => {
  let postedBody;
  const client = new AdapterClient(config(), {
    fetchImpl: async (_url, options) => {
      postedBody = JSON.parse(options.body);
      return jsonResponse({ ok: true, services: [] });
    }
  });

  await client.services({ userId: "user-1", roleIds: ["role-1"] });
  assert.deepEqual(postedBody, {
    actor: {
      userId: "user-1",
      roleIds: ["role-1"]
    }
  });
});

test("AdapterClient raises typed HTTP errors", async () => {
  const client = new AdapterClient(config(), {
    fetchImpl: async () => jsonResponse({ ok: false, error: "nope" }, { status: 503 })
  });

  await assert.rejects(
    () => client.status({ userId: "user-1" }),
    (error) => {
      assert.ok(error instanceof AdapterHttpError);
      assert.equal(error.status, 503);
      assert.equal(error.route, "status");
      assert.deepEqual(error.body, { ok: false, error: "nope" });
      return true;
    }
  );
});
