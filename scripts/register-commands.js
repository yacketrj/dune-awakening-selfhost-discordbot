import { REST, Routes } from "discord.js";
import { commandDefinitions } from "../src/commands.js";
import { loadConfig } from "../src/config.js";

const config = loadConfig();
const rest = new REST({ version: "10" }).setToken(config.discord.token);
const commands = commandDefinitions();

if (config.discord.guildId) {
  await rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), { body: commands });
  console.log(`Registered ${commands.length} Dune command set to guild ${config.discord.guildId}.`);
} else {
  await rest.put(Routes.applicationCommands(config.discord.clientId), { body: commands });
  console.log(`Registered ${commands.length} global Dune command set.`);
}
