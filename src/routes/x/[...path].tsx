/** @jsx h */
import { contentType } from "https://deno.land/std@0.153.0/media_types/mod.ts";
import { fs, git, h, http, join, MatchHandler } from "../../../deps.ts";
import config from "../../config.ts";
import { File, Folder } from "../../pages/x/[...path].tsx";
import { getFile } from "../../utils/get_file.ts";
import { getLatestTag } from "../../utils/get_latest_tag.ts";
import { getPathToRepo } from "../../utils/get_path_to_repo.ts";
import { HttpError } from "../../utils/http_error.ts";
import { render } from "../../utils/render.tsx";
import { response } from "../../utils/response.ts";

const textDecoder = new TextDecoder();

export const path: MatchHandler = async (
	req,
	match,
): Promise<Response> => {
	if (req.method === "GET" || req.method === "HEAD") {
		const { name, version, path } = match;
		const url = new URL(req.url);

		if (!version) {
			return Response.redirect(
				`${url.protocol}${url.host}/x/${name}@${await getLatestTag(
					getPathToRepo(name),
				)}/${path}`,
			);
		}

		if (req.headers.get("Accept")?.includes("html")) {
			let file: Uint8Array;
			try {
				file = await getFile({ name, version, path });
			} catch (err) {
				if (err instanceof Error && err.message.includes("but it is a tree.")) {
					if (req.headers.get("Accept")?.includes("html")) {
						const files = await git.listFiles({
							fs,
							ref: version,
							dir: getPathToRepo(name),
							gitdir: getPathToRepo(name),
						}).then((files) => files.filter((file) => file.startsWith(path)));
						const remote = await git.getConfig({
							fs,
							dir: getPathToRepo(name),
							gitdir: getPathToRepo(name),
							path: "remote.origin.url",
						});

						return render(
							() => (
								<Folder
									remote={remote}
									files={files}
									name={name}
									version={version}
									path={path}
								/>
							),
							req,
							match,
						);
					}
				}
			}

			return render(
				() => (
					<File
						code={textDecoder.decode(file)}
						name={name}
						version={version}
						path={path}
					/>
				),
				req,
				match,
			);
		} else return serveFile(req, match);
	}
	if (req.method === "POST") return updateModule(req, match);

	throw new HttpError("Method not supported", {
		status: 400,
	});
};

const serveFile: MatchHandler = async (req, match) => {
	const url = new URL(req.url);
	const { name, version, path } = match;
	if (!path) {
		throw new HttpError("Not found", {
			status: 404,
		});
	}
	if (!version) {
		return Response.redirect(`${url.host}/${name}@${await getLatestTag(
			getPathToRepo(name),
		)}/${path}`);
	}
	try {
		return response(await getFile({ name, version, path }), {
			headers: {
				"Content-Type": contentType(path.split(".").at(-1) || ".txt") ||
					"text/plain",
			},
		});
	} catch (err) {
		if (err instanceof Error && err.name === "NotFoundError") {
			throw new HttpError("Not found", {
				status: 404,
			});
		} else throw err;
	}
};

const updateModule: MatchHandler = async (req, match): Promise<Response> => {
	const url = new URL(req.url);
	const { name, version, path } = match;
	const pathToRepo = getPathToRepo(name);

	if (path) {
		throw new HttpError("File path must not be specified when updating.", {
			status: 400,
		});
	}

	await git.pull({
		fs,
		http,
		dir: pathToRepo,
		gitdir: pathToRepo,
		ref: version,
		author: { name: "registrybot" },
	});

	return new Response(null, {
		headers: {
			"Location": `${url.protocol}//${url.host}/x/${name}`,
		},
		status: 307,
	});
};

export default path;
