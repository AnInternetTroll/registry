export type JSXElement =
	| ((
		{ children }: { children?: (() => JSXElement | string)[] },
	) => JSX.IntrinsicElements)
	| string;

export type JSXPage = ({ req, match }: {
	req: Request;
	match: Record<string, string>;
}) => JSXElement | Promise<JSXElement>;
