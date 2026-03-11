import { createInterface } from "node:readline";

export function cleanInput(input: string): string[] {
	return input.trim().toLowerCase().split(/\s+/).filter((elem) => elem.length > 0);
}

export function startREPL(): void {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "Pokedex > "
	});

	rl.prompt();
	rl.on("line", (input: string) => {
		const cleaned = cleanInput(input);
		if (cleaned.length === 0) {
			rl.prompt();
			return;
		}
		console.log("Your command was: " + cleaned[0]);
		rl.prompt();
		return;
	})
}