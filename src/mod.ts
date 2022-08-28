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

export function version() {
	return `registry 1.0
Copyright (C) 2022  Luca Matei Pintilie
This program comes with ABSOLUTELY NO WARRANTY;
This is free software, and you are welcome to redistribute it
under certain conditions; 
Check out the \`LICENSE\` file included with this source code.
A copy may be found at <https://www.gnu.org/licenses/gpl-3.0-standalone.html>.
`;
}

export function help() {
	return `USAGE: 
	./registry [OPTIONS]

OPTIONS:
	-h, --help
		Display this help and exit

	-v, --version
		Output version information and exit

	--env-file=file
		Point to a .env file. 
		The file is parsed by the rules over at 
		https://github.com/denoland/deno_std/tree/0.153.0/dotenv#parsing-rules
		For acceptable variables check out ENVIRONMENT VARIABLES
		Defaults to ./.env

	--repos=folder
		Points to a folder where all git repositories will be saved and read from.
		Defaults to ./repos

	-p, --port=number
		A full integer between 0 and 65 535. 
		Numbers below 1023 may require you to run as root.
		Some ports may be taken up by other programs.
		Defaults to 8000

	--hostname=string
		A hostname to bind to.
		Such as an IP address or a domain.
		Defaults to 0.0.0.0

	--log-level=string
		How much should the program log.
		Defaults to WARNING

ENVIRONMENT VARIABLES:
	REPOS
		See --repos

	PORT
		See -p, --port

	HOSTNAME
		See --hostname

	LOG_LEVEL
		See --log-level
	
	NO_COLOR
		When set, colors will not be used for logs.
`;
}

export function start() {
	// @ts-ignore Deno.serve is a new unstable API
	// If it's not available fall back on std/http's serve
	// https://deno.com/blog/v1.25#new-experimental-http-server-api
	// https://doc.deno.land/deno/unstable/~/Deno.serve
	const serveFunc: typeof serve = Deno.serve || serve;
	return serveFunc(handler, {
		port: config.PORT,
		hostname: config.HOSTNAME,
		onListen({ hostname, port }) {
			log.info(`Listening on http://${hostname}:${port}`);
		},
	});
}
