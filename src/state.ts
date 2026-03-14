import { createInterface, type Interface } from "node:readline";
import { getCommands } from "./repl.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";


export type CLICommand = {
	name: string,
	description: string,
	callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
	interface: Interface,
	commands: Record<string, CLICommand>,
	apiobject: PokeAPI,
	nextLocationsURL: string | null,
	prevLocationsURL: string | null,
	pokedex: Record<string, Pokemon>
}

export function initState(): State {
	const record: Record<string, CLICommand> = {};

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "Pokedex > "
	});

	const commands = getCommands();


	return {interface: rl, commands, apiobject: new PokeAPI, prevLocationsURL: null, nextLocationsURL: null, pokedex: {}};
}