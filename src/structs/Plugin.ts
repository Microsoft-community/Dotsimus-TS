import { DotsimusClient } from "./DotsimusClient";
import { RunPlugin } from "./RunPlugin";

export class Plugin {
	client: DotsimusClient;

	constructor(client: DotsimusClient) {
		this.client = client;
	}

	load(): RunPlugin {
		throw new Error("load() not implemented");
	}
}
