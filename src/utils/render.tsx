/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, getCookies, h, Helmet, renderSSR } from "../../deps.ts";
import { JSXElement, JSXPage } from "./jsx_types.tsx";

export function render(
	Page: JSXPage,
	req: Request,
	match: Record<string, string>,
): Response {
	const element = renderSSR(() => (
		<App req={req} match={match}>
			<Page req={req} match={match} />
		</App>
	));
	const { body, head, attributes } = Helmet.SSR(element);

	const html = `
	<!DOCTYPE html>
	<html ${attributes.html}>
	  <head>
		${head.join("\n")}
	  </head>
	  <body ${attributes.body}>
		${body}
	  </body>
	<html>
	`;
	return new Response(html, {
		headers: {
			"Content-Type": "text/html",
		},
	});
}

const App = (
	{ children, req }: {
		children: JSXElement[];
		req: Request;
		match: Record<string, string>;
	},
): JSXElement => {
	const { raw: rawTmp, theme = "light" } = getCookies(req.headers);

	let raw: boolean;

	if (rawTmp === "true") raw = true;
	else raw = false;

	return (
		<Helmet>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{!raw
					? (
						<>
							<link
								rel="stylesheet"
								href="https://esm.sh/papercss@1.8.3/dist/paper.min.css"
							/>
							<link
								rel="stylesheet"
								href="https://esm.sh/prismjs@v1.29/themes/prism.min.css"
							/>
						</>
					)
					: ""}
			</head>

			<html lang="en" class={theme} />
			<body class="container">
				<main>
					{children}
				</main>

				<footer>
					<hr />

					<h1>
						Settings
					</h1>

					<form action="/set_cookie">
						<input name="name" value="raw" hidden={true} />
						<input name="value" value={!raw} type="hidden" />
						<button type="submit">
							Toggle raw mode
						</button>
					</form>

					<br />

					{
						/* I am not sure why but the background color doesn't change,
					so until that is fixed this will stay disabled */
					}

					{
						/* <form action="/set_cookie">
						<input name="name" value="theme" hidden={true} />
						<input
							name="value"
							value={theme === "light" ? "dark" : "light"}
							type="hidden"
						/>
						<button type="submit">
							Toggle theme
						</button>
					</form> */
					}
				</footer>
			</body>
		</Helmet>
	);
};
