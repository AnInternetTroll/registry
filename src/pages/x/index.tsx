/** @jsx h */
import { h } from "../../../deps.ts";

export function Index({ modules }: {
	modules: string[];
}) {
	return (
		<div>
			<h1>
				Module list
			</h1>
			{modules.length
				? (
					<table>
						<thead>
							<tr>
								<th>
									Module name
								</th>
							</tr>
						</thead>
						<tbody>
							{modules.map((module) => (
								<tr>
									<td>
										<a href={"/x/" + module}>
											{module}
										</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)
				: (
					<p>
						No modules available.{" "}
						<a href="/">
							Follow the steps on the home page to add a new module.
						</a>
					</p>
				)}
		</div>
	);
}

export default Index;
