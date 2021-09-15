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

	constructor(client: DotsimusClient) {
		super(client);
		this.client = client;

		this.commands = new Collection();

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
				Routes.applicationCommands(this.client.application.id),
				{
					body: slashCommands,
				}
			);
		} catch(e) {
			console.error("Failed while registering slash commands");
			console.error(e);
		}
	}

	onInteraction(interaction: Interaction): void {
		if (!interaction.isCommand()) return;

		const command = this.commands.find(c => c.name === interaction.commandName);
		if (!command) return;

		command.execute(interaction);
	}

	loadCommand(CommandClass: typeof Command, name: string): void {
		console.log(`Loading command ${name}.js`);

		const command = new CommandClass(this.client);
		this.commands.set(name, command);
	}

	async loadCommands(dir: string): Promise<void> {
		const files = fs.readdirSync(dir).map(f => f.replace(/\.ts$/, ".js"));

		for (const file of files) {
			const p = path.join(dir, file);
			const name = file.replace(/\.js$/, "");

			try {
				const Command = await import(p);
				this.loadCommand(Command.default, name);
			} catch (e) {
				console.log(`Failure while parsing command: ${file}`);
				console.log(e);
			}
		}
	}
}
