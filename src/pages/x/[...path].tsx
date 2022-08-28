/** @jsx h */
import { contentType, extension, h } from "../../../deps.ts";
import { Breadcrums } from "../../components/breadcrums.tsx";
import { CodeBlock } from "../../components/code_block.tsx";

export const File = ({ name, version, path, code }: {
	name: string;
	version: string;
	path: string;
	code: string;
}) => {
	return (
		<div>
			<Breadcrums path={`/x/${name}@${version}/${path}`} />
			<CodeBlock
				code={code}
				language={extension(
					contentType(path.split(".").at(-1) || ".txt") || "text/plain",
				) ||
					"plain"}
			/>
		</div>
	);
};

interface Entry {
	name: string;
	children: Entry[];
	path: string;
}

interface Level {
	// @ts-ignore if it works :/
	result: Entry[];
	[k: string]: Level;
}

export function Folder({ files, remote, name, path, version }: {
	files: string[];
	name: string;
	version: string;
	path: string;
	remote: string;
}) {
	// https://stackoverflow.com/a/57344801
	const result: Entry[] = [];
	// @ts-ignore if it works :/
	const level: Level = { result };
	files.forEach((path) => {
		path.split("/").reduce((r, name) => {
			if (!r[name]) {
				// @ts-ignore if it works :/
				r[name] = { result: [] };
				r.result.push({ name, children: r[name].result, path });
			}

			return r[name];
		}, level);
	});
	return (
		<div>
			<Breadcrums path={`/x/${name}@${version}/${path}`} />
			<h3>
				Remote:
				<br />
				<a href={remote}>
					{remote}
				</a>
			</h3>
			<form method="POST" action="">
				<button class="background-warning">
					Update
				</button>
			</form>
			<h3>
				Files:
			</h3>
			<ul>
				{result.map((entry) => (
					<ListEntry entry={entry} name={name} version={version} path={path} />
				))}
			</ul>
		</div>
	);
}

function ListEntry(
	{ entry, name, path, version }: {
		entry: Entry;
		name: string;
		version: string;
		path: string;
	},
) {
	if (!entry.path.endsWith(entry.name)) {
		const tmp = entry.path.split("/");
		tmp.pop();
		entry.path = tmp.join("/");
	}
	return (
		<li>
			<a href={`/x/${name}@${version}/${entry.path}`}>
				{entry.name}
			</a>
			<ul>
				{entry.children.map((entry) => (
					<ListEntry entry={entry} name={name} version={version} path={path} />
				))}
			</ul>
		</li>
	);
}
