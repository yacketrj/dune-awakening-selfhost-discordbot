# Configuration

## Required

| Variable | Purpose |
| --- | --- |
| `DISCORD_BOT_TOKEN` | Discord bot token. |
| `DISCORD_CLIENT_ID` | Discord application client ID. |
| `DUNE_CONSOLE_API_URL` | Base URL for the console API. |
| `DUNE_DISCORD_ADAPTER_TOKEN` | Bearer token accepted by the console adapter. |

Secrets can also be loaded from files with `DISCORD_BOT_TOKEN_FILE` and
`DUNE_DISCORD_ADAPTER_TOKEN_FILE`.

## Optional

| Variable | Default | Purpose |
| --- | --- | --- |
| `DISCORD_GUILD_ID` | empty | Register commands to one guild for testing. |
| `DISCORD_ALLOWED_ROLE_IDS` | empty | Comma-separated role allow-list. |
| `DISCORD_DEFAULT_EPHEMERAL` | `true` | Keep command responses private by default. |
| `REQUEST_TIMEOUT_MS` | `8000` | Console adapter request timeout. |

## Adapter Overrides

| Variable | Default |
| --- | --- |
| `DUNE_ADAPTER_HEALTH_PATH` | `/api/integrations/discord/health` |
| `DUNE_ADAPTER_STATUS_PATH` | `/api/integrations/discord/status` |
| `DUNE_ADAPTER_READINESS_PATH` | `/api/integrations/discord/readiness` |
| `DUNE_ADAPTER_SERVICES_PATH` | `/api/integrations/discord/services` |
| `DUNE_ADAPTER_HEALTH_METHOD` | `GET` |
| `DUNE_ADAPTER_STATUS_METHOD` | `POST` |
| `DUNE_ADAPTER_READINESS_METHOD` | `POST` |
| `DUNE_ADAPTER_SERVICES_METHOD` | `POST` |
