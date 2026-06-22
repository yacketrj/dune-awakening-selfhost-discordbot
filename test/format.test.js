import assert from "node:assert/strict";
import { test } from "node:test";
import { formatError, formatPayload, redactSecrets } from "../src/format.js";

test("redactSecrets removes nested credential-like keys", () => {
  const redacted = redactSecrets({
    ok: true,
    token: "abc",
    nested: {
      apiKey: "def",
      status: "running"
    }
  });

  assert.deepEqual(redacted, {
    ok: true,
    token: "[REDACTED]",
    nested: {
      apiKey: "[REDACTED]",
      status: "running"
    }
  });
});

test("formatPayload keeps Discord output bounded and redacted", () => {
  const formatted = formatPayload("Dune status", { token: "secret", value: "x".repeat(3000) });
  assert.match(formatted, /\[REDACTED\]/);
  assert.ok(formatted.length <= 2000);
  assert.match(formatted, /truncated/);
});

test("formatError includes status without leaking sensitive response fields", () => {
  const formatted = formatError({
    status: 401,
    message: "Unauthorized",
    body: { authorization: "Bearer secret", code: "unauthorized" }
  });

  assert.match(formatted, /HTTP 401/);
  assert.match(formatted, /\[REDACTED\]/);
  assert.doesNotMatch(formatted, /Bearer secret/);
});
