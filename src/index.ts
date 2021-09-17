import "./env.js";

import { Client, Intents } from "discord.js";
import { FormatString } from "./utils/index.js";
import strings from './utils/strings.json';
const dotsimus = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

if (!process.env.NODE_ENV) {
  throw new Error(
    FormatString(strings.UnsuppliedENV, "Run environment", "NODE_ENV")
  );
}

if (!process.env.BOT_TOKEN) {
  throw new Error(
    FormatString(strings.UnsuppliedENV, "Bot token", "BOT_TOKEN")
  );
}

dotsimus.login(process.env.BOT_TOKEN);

dotsimus.on("ready", (client) => {
  dotsimus.emit("debug", `Connected to Discord as ${client.user.tag}`);
});

if (process.env.NODE_ENV == "development") {
  dotsimus.on("debug", (message) => {
    console.debug(message);
  });
}

export { dotsimus };