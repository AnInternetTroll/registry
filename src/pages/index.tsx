/** @jsx h */
import { h } from "../../deps.ts";
import { CodeBlock } from "../components/code_block.tsx";
import { JSXPage } from "../utils/jsx_types.tsx";

export const Index: JSXPage = () => {
	return (
		<div>
			<head>
				<title>
					Home
				</title>
			</head>

			<h1>
				Registry
			</h1>

			<h2>
				How to use
			</h2>

			<p>
				Just import the code in your file
				<CodeBlock
					code="import { add } from 'https://example.com/x/module@HEAD/mod.js'"
					language="javascript"
				/>
			</p>

			<p>
				Or import from a specific tag
				<CodeBlock
					code="import { add } from 'https://example.com/x/module@0.153.0/mod.js'"
					language="javascript"
				/>
			</p>

			<p>
				Or import from a specific commit
				<CodeBlock
					code="import { add } from 'https://example.com/x/module@28956f795762e8dd9b6213687ce32665319fa98a/mod.js'"
					language="javascript"
				/>
			</p>

			<h2>
				<a href="/x">
					Check out all available modules
				</a>
			</h2>

			<form method="POST" action="/x" class="form-group">
				<label for="module-name">
					Enter a module name (optional)
					<br />
					<input name="name" id="module-name" placeholder="my-awesome-module" />
				</label>
				<br />
				<label for="module-url">
					Enter a module https git url (required)
					<br />
					<input
						name="url"
						id="module-url"
						required
						placeholder="https://example.com/my-awesome-module.git"
					/>
				</label>
				<br />
				<button>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Index;
