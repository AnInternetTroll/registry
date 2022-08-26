import { HttpError } from "./http_error.ts";

export type json =
	| string
	| number
	| boolean
	| null
	| json[]
	| { [key: string]: json };

export async function parseBody(
	req: Request,
): Promise<Record<string, string> | json> {
	const contentType = req.headers.get("Content-Type");
	if (!contentType) {
		throw new HttpError("Missing Content-Type header.", {
			status: 400,
		});
	}

	if (contentType.includes("json")) {
		return await req.json() as json;
	}

	if (contentType.includes("form")) {
		const formData = await req.formData();
		const output: Record<string, string> = {};

		for (const [key, value] of formData) {
			if (value instanceof Blob) output[key] = await value.text();
			else output[key] = value;
		}

		return output;
	}

	throw new HttpError("Content-Type not supported", {
		status: 400,
	});
}
