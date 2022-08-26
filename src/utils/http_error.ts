export class HttpError extends Error {
	readonly status: number;
	constructor(
		message: string,
		options: ErrorOptions & { status?: number } = {},
	) {
		super(message, options);
		this.status = options.status || 500;
	}
}
