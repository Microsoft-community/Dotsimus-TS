import "../../env.js";
import fs from "node:fs";
import path from "node:path";
import { Collection, Interaction } from "discord.js";
import { Plugin } from "../../structs/Plugin.js";
import { RunPlugin } from "../../structs/RunPlugin.js";
import { DotsimusClient } from "../../structs/DotsimusClient.js";
import { Command } from "./structs/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { DotsimusError } from "../../structs/DotsimusError.js";

export default class CommanderPlugin extends Plugin {
	load(): RunPlugin {
		const commander = new Commander(this.client);
		this.client.commander = commander;
		return commander;
	}
}

export class Commander extends RunPlugin {
	client: DotsimusClient;
	commands: Collection<string, Command>;

	// TODO: use database
	prefixes: string[];

	constructor(client: DotsimusClient) {
		super(client);
		this.client = client;

		this.commands = new Collection();
		this.prefixes = ["!"];

		this.client.on("ready", this.registerSlashCommands.bind(this));
		this.client.on("interactionCreate", this.onInteraction.bind(this));
	}

	async registerSlashCommands(): Promise<void> {
		const commands = [...this.commands.values()];
		if (!commands.length) return;

		for (const command of commands) {
			if (!command.schema) return;

			const schema = command.schema as SlashCommandBuilder;
			schema.setName(command.name);
			schema.setDescription(command.description);
		}

		if (!this.client.application?.id) throw new Error("No application");
		const slashCommands = commands.map(c => (c.schema as SlashCommandBuilder).toJSON());

		const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN as string);

		try {
			await rest.put(
				process.env.NODE_ENV === "production"
					? Routes.applicationCommands(this.client.application.id)
					: Routes.applicationGuildCommands(this.client.application.id, process.env.DEV_GUILD as string),
				{
					body: slashCommands
				}
			);
			this.client.log.debug(`Registered ${commands.length} slash commands.`);
		} catch(e) {
			this.client.log.error("Failed while registering slash commands", e);
		}
	}

	async onInteraction(interaction: Interaction): Promise<void> {
		if (!interaction.isCommand()) return;

		const command = this.commands.find(c => c.name === interaction.commandName);
		if (!command) return;

		try {
			command.execute(interaction);
		} catch (e) {
			// User-facing error
			if (e instanceof DotsimusError) {
				// Example: Missing permissions or missing command
				await interaction.reply({
					content: e.message || "Error occurred while executing command.",
				});
			} else {
				this.client.log.error(`Failed while executing command ${command.name}`, e);
			}
		}
	}

	loadCommand(CommandClass: typeof Command, name: string): void {
		const command = new CommandClass(this.client);
		this.commands.set(name, command);
		this.client.log.debug(`Loaded command ${name}.js`);
	}

	async loadCommands(dir: string): Promise<void> {
		const files = fs.readdirSync(dir).map(f => f.replace(/\.[tj]s$/, ""));

		for (const file of files) {
			const p = path.join(dir, `${file}.js`);

			if (p.endsWith(".d.js"))
				break;

			try {
				const Command = await import(p);
				this.loadCommand(Command.default, file);
			} catch (e) {
				this.client.log.error((e as Error).message);
				this.client.log.error(`Failure while parsing command: ${file}.js`, e);
			}
		}
	}
}
