import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2/";

  #cache: Cache = new Cache(3600000);

  constructor() {}

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    if (pageURL == "" || !pageURL) pageURL = PokeAPI.baseURL + "location-area/";

    let ret = this.#cache.get(pageURL) ?? undefined;

    if (ret === undefined) {
      const data = await fetch(pageURL);
      return await data.json() as ShallowLocations;
    } else {
      return ret as ShallowLocations;
    }

  }

  async fetchLocation(locationName: string): Promise<Location> {
    let pageURL = PokeAPI.baseURL + "location/" + locationName;

    let ret = this.#cache.get(pageURL) ?? undefined;

    if (ret === undefined) {
      const data = await fetch(pageURL);
      return await data.json() as Location;
    } else {
      return ret as Location;
    }
  }

  async fetchLocationArea(locationArea: string): Promise<LocationArea | "Not Found"> {
    let pageURL = PokeAPI.baseURL + "location-area/" + locationArea;
    let ret = this.#cache.get(pageURL) ?? undefined;

    if (ret === undefined) {
      const data = await fetch(pageURL);
      const text = await data.text();
      if (text === "Not Found") return "Not Found";
      return JSON.parse(text) as LocationArea;
    } else {
      return ret as LocationArea;
    }
  }

  async fetchPokemon(pokemon: string): Promise<Pokemon | "Not Found"> {
    let pageURL = PokeAPI.baseURL + "pokemon/" + pokemon;
    let ret = this.#cache.get(pageURL) ?? undefined;

    if (ret === undefined) {
      const data = await fetch(pageURL);
      const text = await data.text();
      if (text === "Not Found") return "Not Found";
      return JSON.parse(text) as Pokemon;
    } else {
      return ret as Pokemon;
    }
  }
}

export type ShallowLocations = {
  count: number,
  next: string | null,
  previous: string | null,
  results: {name: string, url: string}[]
};

export type Location = {
  id: number,
  name: string,
  region: {
    name: string,
    url: string
  },
  names: {
    name: string,
    language: {
      name: string,
      url: string
    }
  }[],
  game_indices: {
    game_index: number,
    generation: {
      name: string,
      url: string
    }
  }[],
  areas: {
    name: string,
    url: string
  }[]
};

export type LocationArea = {
  id: number,
  name: string,
  game_index: number,
  encounter_method_rates: {
    encounter_method: {
      name: string,
      url: string
    },
    version_details: {
      rate: number,
      version: {
        name: string,
        url: string
      }
    }[]
  }[],
  location: {
    name: string,
    url: string
  },
  names: {
    name: string,
    language: {
      name: string,
      url: string
    }
  }[],
  pokemon_encounters: {
    pokemon: {
      name: string,
      url: string
    },
    version_details: {
      version: {
        name: string,
        url: string
      },
      max_chance: number
    }[],
    encounter_details: {
      min_level: number,
      max_level: number,
      conditon_values: {
        name: string,
        url: string
      }[],
      chance: number,
      method: {
        name: string,
        url: string
      }
    }[]
  }[]
};

export type Ability = {
  id: number,
  name: string,
  generation: NamedAPIResource,
  names: {
    name: string,
    language: NamedAPIResource
  }[],
  effect_entries: {
    effect: string,
    short_effect: string,
    language: NamedAPIResource
  }[],
  effect_changes: {
    version_group: NamedAPIResource,
    effect_entries: {
      effect: string,
      language: NamedAPIResource
    }[]
  }[],
  flavor_text_entries: {
    flavor_text: string,
    language: NamedAPIResource,
    version_group: NamedAPIResource
  }[],
  pokemon: {
    is_hidden: boolean,
    slot: number,
    pokemon: NamedAPIResource
  }[]
};

export type Pokemon = {
  id: number,
  name: string,
  base_experience: number,
  height: number,
  order: number,
  weight: number,
};

export type NamedAPIResource = {
  name: string,
  url: string
};