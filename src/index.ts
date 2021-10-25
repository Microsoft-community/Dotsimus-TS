import "./env.js";
import { DotsimusClient } from "./structs/DotsimusClient.js";
import path from "node:path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const dotsimus = new DotsimusClient();

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token not provided.");
}

async function main() {

  const __dirname = dirname(fileURLToPath(import.meta.url));
  await dotsimus.loadPlugins(path.join(__dirname, "plugins"));

  if (dotsimus.commander) {
    await dotsimus.commander.loadCommands(path.join(__dirname, "plugins", "commander", "commands"));
  }

  await dotsimus.start(process.env.DISCORD_TOKEN as string, process.env.DB_HOST as string).catch();
}

void async function() {
  await main();
}();
