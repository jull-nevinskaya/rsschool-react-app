export const fetchPokemons = async () => {
  return {
    pokemons: [
      { id: 1, name: "Bulbasaur", image: "bulbasaur.png" },
      { id: 2, name: "Charmander", image: "charmander.png" },
    ],
    totalCount: 2,
  };
};

export const fetchPokemonDetails = async (id: string) => {
  return {
    id: Number(id),
    name: id === "1" ? "Bulbasaur" : "Charmander",
    height: 10,
    weight: 50,
    types: ["grass", "poison"],
    image: "bulbasaur.png",
  };
};
