import { MatchHandler, setCookie } from "../../deps.ts";
import { HttpError } from "../utils/http_error.ts";

export const SetCookie: MatchHandler = (req) => {
	const url = new URL(req.url);
	const name = url.searchParams.get("name");
	const value = url.searchParams.get("value");

	if (!name || !value) {
		throw new HttpError("Missing name or value query parameter.", {
			status: 400,
		});
	}

	const headers = new Headers();

	setCookie(headers, {
		name,
		value,
		httpOnly: true,
	});

	const location = req.headers.get("Location");
	headers.set(
		"Location",
		location ? `${url.protocol}//${location}` : `${url.protocol}//${url.host}`,
	);

	// headers.set("Refresh", "0");

	return new Response(null, {
		headers,
		status: 307,
	});
};
