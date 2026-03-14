import { Cache } from "./pokecache.js";
import { test, expect } from "vitest";

test.concurrent.each([
  {
    key: "https://pokeapi.co/api/v2/location/1",
    val: "{\"areas\":[{\"name\":\"canalave-city-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/1\/\"}],\"game_indices\":[{\"game_index\":7,\"generation\":{\"name\":\"generation-iv\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/generation\/4\/\"}}],\"id\":1,\"name\":\"canalave-city\",\"names\":[{\"language\":{\"name\":\"fr\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/language\/5\/\"},\"name\":\"Joliberges\"},{\"language\":{\"name\":\"de\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/language\/6\/\"},\"name\":\"Fleetburg\"},{\"language\":{\"name\":\"en\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/language\/9\/\"},\"name\":\"Canalave City\"}],\"region\":{\"name\":\"sinnoh\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/region\/4\/\"}}",
    interval: 800, // 1/2 second
  },
  {
    key: "https://pokeapi.co/api/v2/location-area/",
    val: "{\"count\":1113,\"next\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/?offset=20&limit=20\",\"previous\":null,\"results\":[{\"name\":\"canalave-city-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/1\/\"},{\"name\":\"eterna-city-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/2\/\"},{\"name\":\"pastoria-city-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/3\/\"},{\"name\":\"sunyshore-city-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/4\/\"},{\"name\":\"sinnoh-pokemon-league-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/5\/\"},{\"name\":\"oreburgh-mine-1f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/6\/\"},{\"name\":\"oreburgh-mine-b1f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/7\/\"},{\"name\":\"valley-windworks-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/8\/\"},{\"name\":\"eterna-forest-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/9\/\"},{\"name\":\"fuego-ironworks-area\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/10\/\"},{\"name\":\"mt-coronet-1f-route-207\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/11\/\"},{\"name\":\"mt-coronet-2f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/12\/\"},{\"name\":\"mt-coronet-3f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/13\/\"},{\"name\":\"mt-coronet-exterior-snowfall\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/14\/\"},{\"name\":\"mt-coronet-exterior-blizzard\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/15\/\"},{\"name\":\"mt-coronet-4f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/16\/\"},{\"name\":\"mt-coronet-4f-small-room\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/17\/\"},{\"name\":\"mt-coronet-5f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/18\/\"},{\"name\":\"mt-coronet-6f\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/19\/\"},{\"name\":\"mt-coronet-1f-from-exterior\",\"url\":\"https:\/\/pokeapi.co\/api\/v2\/location-area\/20\/\"}]}",
    interval: 1000, // 1 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval * 2));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});