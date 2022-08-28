/** @jsx h */
import { h, Prism } from "../../deps.ts";

export function CodeBlock({
	code,
	language,
}: {
	code: string;
	language: string;
}) {
	// let lineNumber = 0;
	// .split("\n")
	// .map(line =>
	// 	`<a href="#${lineNumber++}" id="${lineNumber}">${lineNumber}</a>: ${line}\n`
	// 	).join("")
	return (
		<div class="line-numbers">
			<pre>
					<code innerHTML={{
						__dangerousHtml: Prism.highlight(
							code,
							Prism.languages[language],
							language)
						}} />

			</pre>
		</div>
	);
}
