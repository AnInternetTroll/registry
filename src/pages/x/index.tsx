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
		</div>
	);
}

export default Index;
