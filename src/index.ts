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

const envNotProvided ="{0} not provided. Please confirm that the \".env\" file exists and the {1} variable is set.";

if (!process.env.NODE_ENV)
{
  throw new Error(
    FormatString(envNotProvided, "NODE_ENV variable", "NODE_ENV")
  );
}

switch (process.env.NODE_ENV) {
  case "production":
    if (!process.env.DISCORD_TOKEN) {
      throw new Error(
        FormatString(envNotProvided, "Discord token", "DISCORD_TOKEN")
      );
    }
    dotsimus.login(process.env.DISCORD_TOKEN);
    break;
  case "development":
    if (!process.env.DISCORD_TOKEN_DEV) {
      throw new Error(
        FormatString(envNotProvided, "Discord token", "DISCORD_TOKEN_DEV")
      );
    }
    dotsimus.login(process.env.DISCORD_TOKEN_DEV);
    break;
}

dotsimus.on("ready", (client) => {
  dotsimus.emit("debug", `Connected to Discord as ${client.user.tag}`);
});

if (process.env.NODE_ENV === "development") {
  dotsimus.on("debug", (message) => {
    console.debug(message);
  });
}

export { dotsimus };
