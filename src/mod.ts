import { log, router, serve } from "../deps.ts";
import XPath from "./routes/x/[...path].tsx";
import XIndex from "./routes/x/index.tsx";
import Index from "./routes/index.ts";
import config from "./config.ts";
import { HttpError } from "./utils/http_error.ts";
import { response } from "./utils/response.ts";
import { getLatestTag } from "./utils/get_latest_tag.ts";
import { getPathToRepo } from "./utils/get_path_to_repo.ts";
import { SetCookie } from "./routes/set_cookie.ts";

export function handler(req: Request) {
	const url = new URL(req.url);
	return router({
		"/": Index,
		"/x": XIndex,
		"/set_cookie": SetCookie,
		"/x/": () => Response.redirect(`${url.protocol}${url.host}/x`),
		"/x/:name{@:version}?/": (_req, match) =>
			Response.redirect(
				`${url.protocol}${url.host}/x/${match.name}@${
					match.version || getLatestTag(getPathToRepo(match.name))
				}`,
			),
		"/x/:name{@:version}?/:path*/": (_req, match) =>
			Response.redirect(
				`${url.protocol}${url.host}/x/${match.name}@${
					match.version || getLatestTag(getPathToRepo(match.name))
				}/${match.path}`,
			),
		"/x/:name{@:version}?/:path*": XPath,
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
