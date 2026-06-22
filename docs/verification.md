# Verification

## Unit Tests

```bash
npm test
```

Expected result: all tests pass.

## Command Registration Smoke Test

Use a test guild for fast command propagation:

```bash
DISCORD_GUILD_ID=your-guild-id npm run register
```

Expected result: Discord shows one `/dune` command with `health`, `status`,
`readiness`, and `services` subcommands.

## Runtime Smoke Test

1. Enable the console's Discord adapter API.
2. Configure `.env`.
3. Run `npm start`.
4. Execute `/dune health` in Discord.

Expected result: the bot returns adapter health JSON without leaking token,
authorization, password, secret, or API key fields.

## Regression Checklist

- `npm test`
- `npm run register` against a test guild
- `/dune health`
- `/dune status`
- `/dune readiness`
- `/dune services`
- Docker start with `docker compose -f docker-compose.example.yml up --build`
