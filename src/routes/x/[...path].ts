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
	if (req.method === "GET") return serveFile(req, match);
	if (req.method === "POST") return updateModule(req, match);

	throw new HttpError("Method not supported", {
		status: 400,
	});
};

const serveFile: MatchHandler = async (req, match) => {
	const url = new URL(req.url);
	const { name, version, path } = match;
	const pathToRepo = join(config.REPOS, name) + ".git";

	// If no version was specified
	// Redirect to the latest commit
	if (!version) {
		const ref: string | undefined = "HEAD";

		// This does not work
		// Sorting tags is hard
		// I think what you are meant to do is get each tag
		// then `git show` and get it's date
		// and sort by that
		// But that is very expensive

		// const tags = await git.listTags({
		// 	fs,
		// 	dir: pathToRepo,
		// 	gitdir: pathToRepo,
		// });

		// if (!tags.length) {
		// 	ref = await git.resolveRef({
		// 		fs,
		// 		dir: pathToRepo,
		// 		gitdir: pathToRepo,
		// 		ref: "HEAD",
		// 	});
		// } else {
		// 	tags.sort(compareVersions);
		// 	ref = tags.at(-1);
		// }

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
		throw new HttpError("Not found", { status: 404 });
	}

	let blob;
	try {
		blob = await git.readBlob({
			fs,
			dir: pathToRepo,
			gitdir: pathToRepo,
			oid: ref,
			filepath: path,
		});
	} catch (err) {
		if (err instanceof Error) {
			if (err.name !== "NotFoundError") throw err;
		} else throw err;
	}

	if (!blob) {
		throw new HttpError("Not found", { status: 404 });
	}

	return response(blob.blob, {
		headers: {
			"Content-Type": contentType(path.split(".").at(-1) || "text") ||
				"text/plain",
		},
	});
};

const updateModule: MatchHandler = async (req, match): Promise<Response> => {
	const url = new URL(req.url);
	const { name, version, path = "HEAD" } = match;
	const pathToRepo = join(config.REPOS, name) + ".git";

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

	return Response.redirect(`${url.host}/x/${name}`);
};

export default path;
