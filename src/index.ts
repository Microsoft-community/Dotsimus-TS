import "./env.js";

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

let UnsuppliedENV;
if (!process.env.NODE_ENV) {
  UnsuppliedENV = "NODE_ENV"
}
if (!process.env.BOT_TOKEN) {
  UnsuppliedENV = "BOT_TOKEN"
}

if (UnsuppliedENV !== undefined) {
  throw new Error(
    `${UnsuppliedENV} not set. Please confirm that the ".env" file exists and that all required variables are set.`
  );
}

dotsimus.login(process.env.BOT_TOKEN);

dotsimus.on("ready", (client) => {
  dotsimus.emit("debug", `Connected to Discord as ${client.user.tag}`);
});

if (process.env.NODE_ENV === "development") {
  dotsimus.on("debug", (message) => {
    console.debug(message);
  });
}

export { dotsimus };