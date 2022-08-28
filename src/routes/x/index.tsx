/** @jsx h */
import { fs, git, h, http, join, MatchHandler } from "../../../deps.ts";
import config from "../../config.ts";
import { HttpError } from "../../utils/http_error.ts";
import { parseBody } from "../../utils/parse_body.ts";
import { response } from "../../utils/response.ts";
import Index from "../../pages/x/index.tsx";
import { render } from "../../utils/render.tsx";
import { getPathToRepo } from "../../utils/get_path_to_repo.ts";

export const index: MatchHandler = async (
	req,
	match,
): Promise<Response> => {
	if (req.method === "POST") return newModule(req);
	else {
		const modules: string[] = [];
		for await (const module of Deno.readDir(config.REPOS)) {
			const name = module.name.split(".git").at(0)!;
			modules.push(
				name,
			);
		}

		return render(() => <Index modules={modules} />, req, match);
	}
};

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

	if (req.headers.get("Accept")?.includes("html")) {
		const url = new URL(req.url);
		return new Response(null, {
			headers: {
				"Location": `${url.protocol}//${url.host}/x/${repoName}`,
			},
			status: 303,
		});
	} else {
		return response("Module saved.", {
			status: 200,
		});
	}
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

export default index;
