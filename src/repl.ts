import { createInterface } from "node:readline";
import { CLICommand, State } from "./state.js";

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
		map: {
			name: "map",
			description: "Displays the next 20 locations",
			callback: commandMap
		},
		mapb: {
			name: "mapb",
			description: "Displays the previous 20 locations",
			callback: commandMapBack
		},
		explore: {
			name: "explore",
			description: "Explores the area given as argument",
			callback: commandExplore
		},
		catch: {
			name: "catch",
			description: "Try to catch the pokemon given as argument",
			callback: commandCatch
		},
		pokedex: {
			name: "pokedex",
			description: "Shows a list of the pokemons you've caught",
			callback: commandPokedex
		}
	};
}

export function cleanInput(input: string): string[] {
	return input.trim().toLowerCase().split(/\s+/).filter((elem) => elem.length > 0);
}

export async function commandExit(state: State): Promise<void> {
	console.log("Closing the Pokedex... Goodbye!");
	state.interface.close();
	process.exit(0);
}

export async function commandHelp(state: State): Promise<void> {
	console.log("Welcome to the Pokedex!\nUsage:\n\n");
	for (let command of Object.values(state.commands)) {
		console.log(`${command.name}: ${command.description}`);
	}
}

export async function commandMap(state: State): Promise<void> {
	let locations = (await state.apiobject.fetchLocations(state.nextLocationsURL ?? ""));
	for (let location of locations.results) {
		console.log(location.name);
	}
	state.nextLocationsURL = locations.next;
	state.prevLocationsURL = locations.previous;
}

export async function commandMapBack(state: State): Promise<void> {
	if (state.prevLocationsURL === null) {
		console.log("You're on the first page.");
		return;
	}

	let locations = (await state.apiobject.fetchLocations(state.prevLocationsURL));
	for (let location of locations.results) {
		console.log(location.name);
	}

	state.nextLocationsURL = locations.next;
	state.prevLocationsURL = locations.previous;
}

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
	if (args[0] === undefined || args[0] === "") {
		console.log("You must choose an area to explore.");
		return;
	}

	console.log("Exploring " + args[0] + "...");
	const locationArea = await state.apiobject.fetchLocationArea(args[0]);
	if (locationArea === "Not Found") {
		console.log("No pokemon found. Did you choose the correct area?");
		return;
	}
	console.log("Found Pokemon:");
	for (let pokemon of locationArea.pokemon_encounters) {
		console.log(" - " + pokemon.pokemon.name);
	}
}

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
	if (args[0] === undefined || args[0] === "") {
		console.log("You must choose a pokemon to try to catch.");
		return;
	}

	const pokemon = await state.apiobject.fetchPokemon(args[0]);
	if (pokemon === "Not Found") {
		console.log("Pokemon not found. Did you type it correctly?");
		return;
	}

	console.log("Throwing a Pokeball at " + args[0] + "...");
	if (Math.random() > 0.5) {
		console.log(args[0] + " was caught!");
		state.pokedex[args[0]] = pokemon;
	} else {
		console.log(args[0] + " escaped!");
	}

}

export async function commandPokedex(state: State): Promise<void> {
	console.log("Your Pokedex:");
	for (const [key, value] of Object.entries(state.pokedex)) {
		console.log(" - " + key);
	}
}

export async function startREPL(state: State): Promise<void> {
	state.interface.prompt();
	state.interface.on("line", async (input: string) => {
		if (cleanInput(input)[0] in getCommands()) {
			await getCommands()[cleanInput(input)[0]].callback(state, cleanInput(input)[1]);
		} else {
			console.log("Unknown command");
		}
		state.interface.prompt();
		return;
	})
}