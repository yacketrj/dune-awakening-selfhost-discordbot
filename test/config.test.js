import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../src/config.js";

function baseEnv(overrides = {}) {
  return {
    DISCORD_BOT_TOKEN: "discord-token",
    DISCORD_CLIENT_ID: "client-id",
    DUNE_CONSOLE_API_URL: "http://console-api:3000",
    DUNE_DISCORD_ADAPTER_TOKEN: "adapter-token",
    ...overrides
  };
}

test("loadConfig returns safe read-only adapter defaults", () => {
  const config = loadConfig(baseEnv());
  assert.equal(config.adapter.paths.health, "/api/integrations/discord/health");
  assert.equal(config.adapter.methods.health, "GET");
  assert.equal(config.adapter.methods.status, "POST");
  assert.equal(config.discord.defaultEphemeral, true);
});

test("loadConfig accepts endpoint overrides and role allow-list", () => {
  const config = loadConfig(baseEnv({
    DISCORD_ALLOWED_ROLE_IDS: "one, two",
    DUNE_ADAPTER_STATUS_PATH: "/api/discord/status",
    DUNE_ADAPTER_STATUS_METHOD: "get",
    DISCORD_DEFAULT_EPHEMERAL: "false"
  }));

  assert.deepEqual(config.discord.allowedRoleIds, ["one", "two"]);
  assert.equal(config.adapter.paths.status, "/api/discord/status");
  assert.equal(config.adapter.methods.status, "GET");
  assert.equal(config.discord.defaultEphemeral, false);
});

test("loadConfig rejects unsafe adapter URLs", () => {
  assert.throws(
    () => loadConfig(baseEnv({ DUNE_CONSOLE_API_URL: "file:///etc/passwd" })),
    /must use http or https/
  );
});

test("loadConfig requires adapter paths to stay absolute", () => {
  assert.throws(
    () => loadConfig(baseEnv({ DUNE_ADAPTER_SERVICES_PATH: "api/services" })),
    /must start with/
  );
});
