import {
	ApplicationCommandData,
	Client,
	CommandInteraction,
	MessagePayload,
	WebhookEditMessageOptions,
} from "discord.js";
import { DotsimusClient } from "../../../structs/DotsimusClient";
import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

export type CommandResponse =
	string
	| MessagePayload
	| WebhookEditMessageOptions
	| null;

export type Schema =
	SlashCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| ApplicationCommandData
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">

export class Command {
	static noPermissionError = new Error("You do not have permission to run that command.");
	static unknownCommandError = new Error("The given command does not exist.");

	client: Client;
	name: string;
	description: string;
	schema: Schema = new SlashCommandBuilder();

	constructor(client: DotsimusClient) {
		this.client = client;
		this.name = "";
		this.description = "";
	}

	execute(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interaction: CommandInteraction
	): CommandResponse | Promise<CommandResponse | void> {
		throw new Error(
			`Execute function on default for ${this.name} command.`
		);
	}
}
