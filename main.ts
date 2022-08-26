#!/usr/bin/env -S deno run --allow-net --allow-write=./repos --allow-read=. --no-prompt --allow-env --watch
import { start } from "./src/mod.ts";

start();
