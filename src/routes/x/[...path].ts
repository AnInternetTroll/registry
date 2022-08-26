import {
	contentType,
	fs,
	git,
	http,
	join,
	MatchHandler,
} from "../../../deps.ts";
import config from "../../config.ts";
import { HttpError } from "../../utils/http_error.ts";
import { response } from "../../utils/response.ts";

export const path: MatchHandler = (
	req,
	match,
): Response | Promise<Response> => {
	return serveFile(req, match);
};

const serveFile: MatchHandler = async (req, match) => {
	const url = new URL(req.url);
	const { name, version, path } = match;
	const pathToRepo = join(config.REPOS, name) + ".git";

	// If no version was specified
	// Redirect to the latest tag
	if (!version) {
		const tags = await git.listTags({
			fs,
			dir: pathToRepo,
			gitdir: pathToRepo,
		});
		let ref: string | undefined;
		if (!tags.length) {
			ref = await git.resolveRef({
				fs,
				dir: pathToRepo,
				gitdir: pathToRepo,
				ref: "HEAD",
			});
		} else ref = tags.at(-1);
		return Response.redirect(`${url.host}/x/${name}@${ref}/${path}`);
	}

	let ref = "";
	try {
		ref = await git.resolveRef({
			fs,
			dir: pathToRepo,
			gitdir: pathToRepo,
			ref: version,
		});
	} catch (err) {
		if (err instanceof Error) {
			if (err.name !== "NotFoundError") throw err;
		} else throw err;
	}

	if (!ref) {
		if (!ref) throw new HttpError("Not found", { status: 404 });
	}

	const blob = await git.readBlob({
		fs,
		dir: pathToRepo,
		gitdir: pathToRepo,
		oid: ref,
		filepath: path,
	});

	return response(blob.blob, {
		headers: {
			"Content-Type": contentType(path.split(".").at(-1) || "text") ||
				"text/plain",
		},
	});
};

export default path;
