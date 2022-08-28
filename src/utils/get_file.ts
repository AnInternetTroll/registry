import { fs, git } from "../../deps.ts";
import { getPathToRepo } from "./get_path_to_repo.ts";

export async function getFile({ name, version, path }: {
	name: string;
	version?: string;
	path: string;
}): Promise<Uint8Array> {
	const pathToRepo = getPathToRepo(name);

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

		return getFile({
			name,
			version: ref,
			path,
		});
	}

	const ref = await git.resolveRef({
		fs,
		dir: pathToRepo,
		gitdir: pathToRepo,
		ref: version,
	});

	const blob = await git.readBlob({
		fs,
		dir: pathToRepo,
		gitdir: pathToRepo,
		oid: ref,
		filepath: path,
	});

	return blob.blob;
}
