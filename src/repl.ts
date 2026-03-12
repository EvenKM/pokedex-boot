import { createInterface } from "node:readline";

export type CLICommand = {
	name: string,
	description: string,
	callback: (commands: Record<string, CLICommand>) => void;
};

export function getCommands(): Record<string, CLICommand> {
	return {
		exit: {
			name: "exit",
			description: "Exits the pokedex",
			callback: commandExit
		},
		help: {
			name: "help",
			description: "Displays a help message",
			callback: commandHelp
		},
	};
}

export function cleanInput(input: string): string[] {
	return input.trim().toLowerCase().split(/\s+/).filter((elem) => elem.length > 0);
}

export function commandExit(): void {
	console.log("Closing the Pokedex... Goodbye!");
	process.exit(0);
}

export function commandHelp(commands: Record<string, CLICommand>): void {
	console.log("Welcome to the Pokedex!\nUsage:\n\n");
	for (let command of Object.values(commands)) {
		console.log(`${command.name}: ${command.description}`);
	}
}

export function startREPL(): void {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "Pokedex > "
	});

	rl.prompt();
	rl.on("line", (input: string) => {
		if (cleanInput(input)[0] in getCommands()) {
			getCommands()[cleanInput(input)[0]].callback(getCommands());
		} else {
			console.log("Unknown command");
		}
		rl.prompt();
		return;
	})
}