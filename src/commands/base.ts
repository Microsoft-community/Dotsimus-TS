import {
  ApplicationCommandData,
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  MessagePayload,
  WebhookEditMessageOptions,
} from "discord.js";
import { dotsimus } from "../index.js";

export type CommandInfo = ApplicationCommandData & {
  guildOnly?: true;
  defer?: true;
  ownerOnly?: true;
};

export type GuildCommandInteraction = CommandInteraction & {
  guildId: string;
  member: GuildMember;
  guild: Guild;
  inGuild(): true;
};

export type CommandResponse =
  | string
  | MessagePayload
  | WebhookEditMessageOptions
  | null;

export class Command {
  static noPermissionError: Error = new Error(
    "You do not have permission to run that command."
  );
  static noCommandError: Error = new Error("The given command does not exist.");
  info: CommandInfo;
  client: Client;
  constructor(info: CommandInfo) {
    this.info = info;
    this.client = dotsimus;
  }

  execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interaction: CommandInteraction
  ): CommandResponse | Promise<CommandResponse> {
    throw new Error(
      `Execute function on default for ${this.info.name} command.`
    );
  }
}
