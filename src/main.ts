import { startREPL } from "./repl.js";
import { initState } from "./state.js";

async function main() {
	const state = initState();
	try {
		await startREPL(state)
	} catch (err) {
		console.log(err);
	}
}

main();