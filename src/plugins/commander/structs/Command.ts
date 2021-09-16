import {
	ApplicationCommandData,
	CommandInteraction,
	MessagePayload,
	WebhookEditMessageOptions,
} from "discord.js";
import { DotsimusClient } from "../../../structs/DotsimusClient.js";
import { DotsimusError} from "../../../structs/DotsimusError.js";
import {
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import pino from "pino";

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
	static noPermissionError = new DotsimusError("You do not have permission to run that command.");
	static unknownCommandError = new DotsimusError("The given command does not exist.");

	client: DotsimusClient;
	name: string;
	description: string;
	schema: Schema = new SlashCommandBuilder();
	log: pino.Logger;

	constructor(client: DotsimusClient) {
		this.client = client;
		this.name = "";
		this.description = "";
		this.log = this.client.log;
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
