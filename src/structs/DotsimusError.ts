export class DotsimusError extends Error {
	code: string;

	constructor(message: string) {
		super(message);
		this.code = message;

		Object.setPrototypeOf(this, DotsimusError.prototype);
	}

	get name(): string {
		return "DotsimusError";
	}
}
