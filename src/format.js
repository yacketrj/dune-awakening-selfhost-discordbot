const SENSITIVE_KEY_PATTERN = /(authorization|cookie|password|secret|token|api[_-]?key|credential)/i;
const DISCORD_MESSAGE_LIMIT = 2000;
const JSON_BODY_LIMIT = 1800;

export function formatPayload(title, value) {
  const body = JSON.stringify(redactSecrets(value), null, 2);
  const clipped = body.length > JSON_BODY_LIMIT ? `${body.slice(0, JSON_BODY_LIMIT)}\n... truncated` : body;
  return limitDiscordContent(`**${title}**\n~~~json\n${clipped}\n~~~`);
}

export function formatError(error) {
  const status = error?.status ? ` HTTP ${error.status}` : "";
  const body = error?.body ? `\n${JSON.stringify(redactSecrets(error.body), null, 2).slice(0, 1200)}` : "";
  return limitDiscordContent(`Adapter request failed${status}: ${error?.message || "Unknown error."}${body}`);
}

export function redactSecrets(value, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (Array.isArray(value)) return value.map((item) => redactSecrets(item, seen));

  return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    if (SENSITIVE_KEY_PATTERN.test(key)) return [key, "[REDACTED]"];
    return [key, redactSecrets(item, seen)];
  }));
}

function limitDiscordContent(value) {
  if (value.length <= DISCORD_MESSAGE_LIMIT) return value;
  return `${value.slice(0, DISCORD_MESSAGE_LIMIT - 16)}\n... truncated`;
}
