import "./env.js";
import { DotsimusClient } from "./structs/DotsimusClient.js";
import path from "node:path";

const dotsimus = new DotsimusClient();

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token not provided.");
}

async function main() {
  await dotsimus.loadPlugins(path.join(process.cwd(), "src", "plugins"));

  if (dotsimus.commander) {
    await dotsimus.commander.loadCommands(path.join(process.cwd(), "src", "plugins", "commander", "commands"));
  }

  await dotsimus.start(process.env.DISCORD_TOKEN as string, process.env.DB_HOST as string).catch();
}

void async function() {
  await main();
}();
