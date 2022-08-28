import { join } from "../../deps.ts";
import config from "../config.ts";

export function getPathToRepo(name: string) {
	return join(config.REPOS, name) + ".git";
}
