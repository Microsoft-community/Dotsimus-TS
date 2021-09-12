import dotenv from "dotenv";
dotenv.config();

import { Client, Intents } from "discord.js";
const dotsimus = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

import { FormatString } from "./utils.js";

const tokenENV = "DISCORD_TOKEN",
devTokenENV = "DISCORD_TOKEN_DEV",
unprovidedENVString = "{0} not provided. Please confirm that the \".env\" file exists and the {1} variable is set.";

let nodeENV = process.env.NODE_ENV;

if (!nodeENV) {
  nodeENV = "production";
}

switch (nodeENV) {
  case "production":
    if (!process.env[tokenENV]) {
      throw new Error(
        FormatString(unprovidedENVString, "Bot token", tokenENV)
      );
    }
    dotsimus.login(process.env[tokenENV]);
    break;
  case "development":
    if (!process.env[devTokenENV]) {
      throw new Error(
        FormatString(unprovidedENVString, "Dev bot token", devTokenENV)
      );
    }
    dotsimus.login(process.env[devTokenENV]);
    break;
}

dotsimus.on("ready", (client) => {
  dotsimus.emit("debug", `Connected to Discord as ${client.user.tag}`);
});

if (nodeENV == "development") {
  dotsimus.on("debug", (message) => {
    console.debug(message);
  });
}

export { dotsimus };
