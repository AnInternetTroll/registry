# Registry

Working title

# Features

- Lightweight
  - No frontend JavaScript and optional no CSS version available
- Uses an existing version control tool, git
- Works great in console browsers, such as `w3m` or `lynx`

# Cons

- Unlike `deno.land` or `nest.land`, there is no guarantee to immutability. If
  the git history changes so will the files. If the git repository is lost on
  the server then there is no way to recover it (unless external backups).

# Instructions

`deno task dev` can be used to start the server in development mode. This will
use `.env.example` by default. `deno task start` can be used to start the server
in production mode. This will use `.env` by default.

Check out `--help` as well

```
USAGE: 
	./registry [OPTIONS]

OPTIONS:
	-h, --help
		Display this help and exit

	-v, --version
		Output version information and exit

	--env-file=file
		Point to a .env file. 
		The file is parsed by the rules over at 
		https://github.com/denoland/deno_std/tree/0.153.0/dotenv#parsing-rules
		For acceptable variables check out ENVIRONMENT VARIABLES
		Defaults to ./.env

	--repos=folder
		Points to a folder where all git repositories will be saved and read from.
		Defaults to ./repos

	-p, --port=number
		A full integer between 0 and 65 535. 
		Numbers below 1023 may require you to run as root.
		Some ports may be taken up by other programs.
		Defaults to 8000

	--hostname=string
		A hostname to bind to.
		Such as an IP address or a domain.
		Defaults to 0.0.0.0

	--log-level=string
		How much should the program log.
		Defaults to WARNING

ENVIRONMENT VARIABLES:
	REPOS
		See --repos

	PORT
		See -p, --port

	HOSTNAME
		See --hostname

	LOG_LEVEL
		See --log-level
	
	NO_COLOR
		When set, colors will not be used for logs.
```
