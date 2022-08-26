import { log, parseArgs, parseFlags, praseDotenv } from "../deps.ts";

interface IConfig {
	REPOS: string;
	PORT: number;
	HOSTNAME: string;
	LOG_LEVEL: "NOTSET" | "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
}

const logLevels = ["NOTSET", "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]

let flags: parseArgs = {
	_: [],
};

if (Deno?.args && Deno.args.length) flags = parseFlags(Deno.args);

let envFile = ".env";

if (flags["env-file"]) {
	if (typeof flags["env-file"] !== "string") {
		throw new TypeError("--env-file must point to a file.");
	}
	envFile = flags["env-file"];
}

let envFileContents = "";

try {
	envFileContents = await Deno.readTextFile(envFile);
} catch (err: unknown) {
	if (!(err instanceof Deno.errors.NotFound)) throw err;
}

const dotenvConfig = praseDotenv(envFileContents);

const config: IConfig = {
	REPOS: flags.repos ||
		await getEnvVariable("REPOS") || "./repos",
	PORT: flags.port ||
		flags.p ||
		await getEnvVariable("PORT") || 8000,
	HOSTNAME: flags.hostname ||
		await getEnvVariable("HOSTNAME") || "0.0.0.0",
	LOG_LEVEL: flags["log-level"] ||
		await getEnvVariable("LOG_LEVEL") || "WARNING",
};

async function getEnvVariable(variable: string): Promise<string | undefined> {
	if (dotenvConfig[variable]) return dotenvConfig[variable];

	const permissionStatus = await Deno.permissions.query({
		name: "env",
		variable,
	});
	if (permissionStatus.state === "granted") return Deno.env.get(variable);

	// throw new Error(`${variable} env variable not found.`);
}

export default config;
