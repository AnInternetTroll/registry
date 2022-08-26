export function response(
	body: BodyInit | Record<string, string>,
	init?: ResponseInit,
	incomingHeaders?: Headers,
): Response {
	const acceptHeader = incomingHeaders
		? incomingHeaders.get("content-headers")
		: "application/json";

	if (
		(body instanceof Uint32Array) || (body instanceof Uint16Array) ||
		(body instanceof Uint8Array) || (body instanceof ReadableStream) ||
		(body instanceof Blob)
	) {
		return new Response(body, init);
	}

	const responseBody = typeof body === "string" ? { message: body } : body;

	if (acceptHeader?.includes("json")) return Response.json(responseBody, init);

	return Response.json(responseBody, init);
}
