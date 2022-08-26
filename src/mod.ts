import { log, router, serve } from "../deps.ts";
import Path from "./routes/x/[...path].ts";
import Index from "./routes/x/index.ts";
import config from "./config.ts";
import { HttpError } from "./utils/http_error.ts";
import { response } from "./utils/response.ts";

export function handler(req: Request) {
	return router({
		"/x": Index,
		"/x/:name{@:version}?/:path*": Path,
	}, () => {
		throw new HttpError("Path not found", {
			status: 404,
		});
	}, (_req, err) => {
		if (err instanceof HttpError) {
			log.debug(err.message);
			return response(err.message, {
				status: err.status,
			});
		}

		log.error(err);

		return response("Very unexpected error", {
			status: 500,
		});
	})(req);
}

export function start() {
	return serve(handler, {
		port: config.PORT,
		hostname: config.HOSTNAME,
		onListen({ hostname, port }) {
			log.info(`Listening on http://${hostname}:${port}`);
		},
	});
}
