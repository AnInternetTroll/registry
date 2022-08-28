/** @jsx h */
import { h } from "../../deps.ts";

export function Breadcrums({ path }: {
	path: string;
}) {
	return (
		<nav>
			<ul class="breadcrumb">
				{path.split("/").filter((a) => a).map((entry, index, arr) => (
					<li>
						<a href={`/${arr.slice(0, index + 1).join("/")}`}>
							{entry}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
