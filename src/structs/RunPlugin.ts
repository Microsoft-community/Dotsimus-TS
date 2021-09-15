import { DotsimusClient } from "./DotsimusClient";

export class RunPlugin {
	client: DotsimusClient;

	constructor(client: DotsimusClient) {
		this.client = client;
	}

	execute(): void {
		throw new Error("load() not implemented");
	}
}
