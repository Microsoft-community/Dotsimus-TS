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

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Discord token not provided.");
}

dotsimus.login(process.env.DISCORD_TOKEN);

dotsimus.on("ready", (client) => {
  dotsimus.emit("debug", `Connected to Discord as ${client.user.tag}`);
});

if (process.env.NODE_ENV === "development") {
  dotsimus.on("debug", (message) => {
    console.debug(message);
  });
}

export { dotsimus };
