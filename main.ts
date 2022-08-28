#!/usr/bin/env -S deno run --allow-net --allow-write=./repos_main --allow-read=. --no-prompt --allow-env
import { start } from "./src/mod.ts";

start();
