import { MatchHandler } from "../../deps.ts";
import Index from "../pages/index.tsx";
import { render } from "../utils/render.tsx";

export const index: MatchHandler = (req, match) => {
	return render(Index, req, match);
};

export default index;
