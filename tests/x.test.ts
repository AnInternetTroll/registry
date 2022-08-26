import {
	afterAll,
	beforeAll,
} from "https://deno.land/std@0.153.0/testing/bdd.ts";
import { assertEquals, describe, it } from "../deps_testing.ts";
import config from "../src/config.ts";
import { handler } from "../src/mod.ts";

const BASE_URL = "http://localhost:8000";

describe("module", () => {
	const url = "https://github.com/denoland/deno_std";
	const name = "std";

	beforeAll(async () => {
		const body = {
			url, name
		};
		const request = new Request(`${BASE_URL}/x`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const response = await handler(request);

		assertEquals(response.status, 200);

		const responseBody = await response.json();

		assertEquals(responseBody.message, "Module saved.");
	});

	it("get file by specific version", async () => {
		const request = new Request(`${BASE_URL}/x/${name}@0.153.0/version.ts`, {
			headers: {
				"Accept": "application/typescript",
			},
		});

		const response = await handler(request);
		assertEquals(
			response.headers.get("Content-Type"),
			"video/mp2t",
		);
		const file = await response.text();

		assertEquals(
			file,
			`// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
/** Version of the Deno standard modules
 *
 * Deno std is versioned differently than Deno cli because it is still unstable;
 * the cli's API is stable. In the future when std becomes stable, likely we
 * will match versions with cli as we have in the past.
 */
export const VERSION = "0.153.0";
`,
		);
	});

	afterAll(async () => {
		await Deno.remove(config.REPOS, {
			recursive: true,
		});
	});

});
