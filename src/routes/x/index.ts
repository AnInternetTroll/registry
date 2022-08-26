import { fs, git, http, join } from "../../../deps.ts";
import config from "../../config.ts";
import { HttpError } from "../../utils/http_error.ts";
import { parseBody } from "../../utils/parse_body.ts";
import { response } from "../../utils/response.ts";

export default function index(req: Request): Response | Promise<Response> {
	if (req.method === "POST") return newModule(req);
	else return response("Todo", { status: 404 });
}

async function newModule(req: Request): Promise<Response> {
	const body = await parseBody(req);

	if (!typeCheckBody(body)) {
		throw new HttpError("Not all required values of the body were found", {
			status: 400,
		});
	}

	const repoName = body.name || body.url.split("/").at(-1)?.split(".git")[0];

	if (!repoName) {
		throw new HttpError("Repo name detection failed.", { status: 500 });
	}

	const pathToRepo = join(config.REPOS, repoName);

	await git.clone({
		http,
		fs,
		dir: pathToRepo,
		gitdir: pathToRepo + ".git",
		url: body.url,
		noCheckout: true,
	});

	return response("Module saved.", {
		status: 200,
	});
}

interface PostBody {
	url: string;
	name?: string;
}

function typeCheckBody(body: unknown): body is PostBody {
	if (!body) return false;
	if (typeof body !== "object") return false;

	if (!("url" in body)) return false;
	// @ts-ignore check right above if url is in body
	if (typeof body.url !== "string") return false;

	return true;
}
