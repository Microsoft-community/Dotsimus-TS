import "../env.js";
import { Client, Intents } from "discord.js";
import { Plugin } from "./Plugin";
import { RunPlugin } from "./RunPlugin";
import { logger } from "../logger.js";
import { Commander } from "../plugins/commander";
import pino from "pino";

import fs from "node:fs";
import path from "node:path";

export class DotsimusClient extends Client {
	plugins: RunPlugin[];
	commander?: Commander;
	#loggedIn: boolean;
	log: pino.Logger = logger;

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Intents.FLAGS.GUILD_PRESENCES,
			],
		});

		this.plugins = [];
		this.#loggedIn = false;
		this.commander = undefined;

		this.on("ready", this.onReady);
	}

	onReady(): void {
		this.log.info("Ready.");
	}

	async loadPlugin(PluginClass: typeof Plugin): Promise<void> {
		if (this.#loggedIn) throw new Error("Plugins must be loaded before logging in.");

		const pluginObj = new PluginClass(this);
		const p = pluginObj.load();
		this.plugins.push(p);
	}

	async loadPlugins(dir: string): Promise<void> {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const p = path.join(dir, file, "index.js");
			const plugin = await import(p);
			await this.loadPlugin(plugin.default);
		}
	}

	login(token?: string): Promise<string> {
		if (this.#loggedIn) throw new Error("Already logged in.");

		this.#loggedIn = true;
		return super.login(token);
	}
}

