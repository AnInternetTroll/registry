import { log } from "../deps.ts";
import config from "./config.ts";

await log.setup({
	handlers: {
		console: new log.handlers.ConsoleHandler(config.LOG_LEVEL),

		file: new log.handlers.FileHandler("WARNING", {
			filename: "./log.txt",
			// you can change format of output message using any keys in `LogRecord`.
			formatter: "{levelName} {msg}",
		}),
	},

	loggers: {
		// configure default logger available via short-hand methods above.
		default: {
			level: "DEBUG",
			handlers: ["console", "file"],
		},

		tasks: {
			level: "ERROR",
			handlers: ["console"],
		},
	},
});

export { log };
