#!/usr/bin/env -S deno run --allow-net --allow-write=./repos_main --allow-read=. --no-prompt --allow-env
import { help, start, version } from "./src/mod.ts";

if (import.meta.main) {
	if (Deno.args.includes("-h") || Deno.args.includes("--help")) {
		console.log(help());
	} else if (Deno.args.includes("-v") || Deno.args.includes("--version")) {
		console.log(version());
	} else start();
}
