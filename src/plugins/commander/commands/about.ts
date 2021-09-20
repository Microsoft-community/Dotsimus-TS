import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandResponse } from "../structs/Command.js";
import { DotsimusClient } from "../../../structs/DotsimusClient.js";
import { DotsimusError } from "../../../structs/DotsimusError";
import { constants } from "../../../constants";

export default class AboutCommand extends Command {
  constructor(bot: DotsimusClient) {
    super(bot);

    this.name = "about";
    this.description = "About Dotsimus";
    this.schema = new SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("me")
                .setDescription("Shows general information about Dotsimus and its commands.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("uptime")
                .setDescription("Shows Dotsimus' time since last restart.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("ping")
                .setDescription("Shows Dotsimus' latency.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("restart")
                .setDescription("Restarts Dotsimus.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("usage")
                .setDescription("Shows Dotsimus' usage statistics.")
        );
  }

  async execute(interaction: CommandInteraction): Promise<CommandResponse | void> {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "me":
        return this.executeMe(interaction);
      case "uptime":
        return this.executeUptime(interaction);
      case "ping":
        return this.executePing(interaction);
      case "restart":
        return this.executeRestart(interaction);
      case "usage":
        return this.executeUsage(interaction);
      default:
        throw new DotsimusError(constants.unknownCommand);
    }
  }

  private executeMe(interaction: CommandInteraction): Promise<void> {
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
    return interaction.reply({ embeds: [embed] });
  }

  private executeUptime(interaction: CommandInteraction): Promise<void> {
    const { uptime } = this.client;

    if (!uptime) {
      throw new Error("Bot is not up.");
    }

    const startTime = Math.floor((Date.now() - uptime) / 1000);
    return interaction.reply({
      content: `Bot restarted <t:${startTime}:R>`,
    });
  }

  private executePing(interaction: CommandInteraction): Promise<void> {
    return interaction.reply({
        content: `Websocket heartbeat: ${this.client.ws.ping}ms
Roundtrip latency: ${Date.now() - interaction.createdTimestamp}ms`,
    });
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
        : Boolean(owner.members.get(owner.id));

    if (!userIsOwner) {
      throw new DotsimusError(constants.missingPerms);
    }

    await interaction.reply("Restarting...");
    process.exit(0);
  }

  private executeUsage(interaction: CommandInteraction): Promise<void> {
    return interaction.reply({
      content: `Not yet implemented.`,
    });
  }
}
