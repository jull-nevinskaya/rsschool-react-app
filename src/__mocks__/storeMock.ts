import { createMockStore } from "./createMockStore";

export const getMockStore = () =>
  createMockStore({
    selectedPokemons: [
      {
        id: 1,
        name: "Bulbasaur",
        image: "bulbasaur.png",
        height: 7,
        weight: 69,
        types: ["Grass", "Poison"],
      },
      {
        id: 2,
        name: "Charmander",
        image: "charmander.png",
        height: 6,
        weight: 85,
        types: ["Fire"],
      },
    ],
  });
