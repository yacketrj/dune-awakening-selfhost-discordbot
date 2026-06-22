import { Client, Events, GatewayIntentBits } from "discord.js";
import { AdapterClient } from "./adapterClient.js";
import { executeDuneCommand } from "./commands.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const adapterClient = new AdapterClient(config);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Dune Discord bot signed in as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    await executeDuneCommand(interaction, adapterClient, config);
  } catch (error) {
    console.error("Failed to handle Discord interaction:", error);
  }
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    console.log(`Received ${signal}; shutting down Discord bot.`);
    await client.destroy();
    process.exit(0);
  });
}

await client.login(config.discord.token);
