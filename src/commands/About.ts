import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { Command, CommandResponse } from "./base";

export default class AboutCommand extends Command {
  constructor() {
    super({
      name: "about",
      description: "About Dotsimus",
      options: [
        {
          name: "me",
          description:
            "Shows general information about Dotsimus and its commands.",
          type: "SUB_COMMAND",
        },
        {
          name: "uptime",
          description: "Shows Dotsimus' time since last restart.",
          type: "SUB_COMMAND",
        },
        {
          name: "ping",
          description: "Shows Dotsimus' latency.",
          type: "SUB_COMMAND",
        },
        {
          name: "restart",
          description: "Restarts Dotsimus.",
          type: "SUB_COMMAND",
        },
        {
          name: "usage",
          description: "Shows Dotsimus' usage statistics.",
          type: "SUB_COMMAND",
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction): Promise<CommandResponse> {
    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case "me":
        return this.executeMe();
      case "uptime":
        return this.executeUptime();
      case "ping":
        return this.executePing(interaction);
      case "restart":
        return await this.executeRestart(interaction);
      case "usage":
        return this.executeUsage();
      default:
        throw Command.unknownCommandError;
    }
  }

  private executeMe(): CommandResponse {
    const guilds = this.client.guilds.cache;
    const totalMemberCount: number = guilds.reduce((acc, guild) => {
      return acc + guild.memberCount;
    });
    const embed = new MessageEmbed({
      title: "Dotsimus",
      description:
        "Dotsimus is a machine learning powered chat moderation bot, its primary goal is to help monitor, protect the server while its secondary goal is to enhance user experience.",
      color: "ORANGE",
      fields: [
        {
          name: "Dotsimus Servers",
          value: `${guilds.size}`,
          inline: true,
        },
        {
          name: "Dotsimus Users",
          value: `${totalMemberCount}`,
          inline: true,
        },
        {
          name: "Slash Commands",
          value:
            "Dotsimus uses Discord's newly released slash command feature. You can see available slash commands and their use by typing `/` in the chat.",
        },
      ],
    });
    return { embeds: [embed] };
  }

  private executeUptime(): CommandResponse {
    const { uptime } = this.client;
    if (!uptime) {
      throw new Error("Bot is not up.");
    }
    const startTime = Math.floor((Date.now() - uptime) / 1000);
    return `Bot restarted <t:${startTime}:R>`;
  }

  private executePing(interaction: CommandInteraction): CommandResponse {
    return `Websocket heartbeat: ${this.client.ws.ping}ms
    Roundtrip latency: ${Date.now() - interaction.createdTimestamp}`;
  }

  private async executeRestart(
    interaction: CommandInteraction
  ): Promise<CommandResponse> {
    const owner = this.client.application?.owner;
    if (!owner) {
      throw new Error("Dotsimus cannot find the bot's owner.");
    }
    const userIsOwner =
      owner instanceof User
        ? owner.id === interaction.user.id
        : !!owner.members.get(owner.id);
    if (!userIsOwner) {
      throw Command.noPermissionError;
    }
    await interaction.reply("Restarting...");
    process.exit(0);
  }

  private executeUsage() {
    return `Not yet implemented.`;
  }
}
