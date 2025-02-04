const API_URL = "https://pokeapi.co/api/v2/pokemon";

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonAPIResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: {
    front_default: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string;
  image: string;
}

export interface PokemonListAPIResponse {
  count: number;
  results: { name: string; url: string }[];
}

export const fetchPokemons = async (
  searchTerm: string = "",
  limit: number = 10,
  offset: number = 0
): Promise<Pokemon[]> => {
  try {
    const url = searchTerm
      ? `${API_URL}/${searchTerm.toLowerCase()}`
      : `${API_URL}?limit=${limit}&offset=${offset}`;

    console.log(`Fetching: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    const data: PokemonAPIResponse | PokemonListAPIResponse = await response.json();

    if (searchTerm) {
      const pokemonData = data as PokemonAPIResponse;
      return [
        {
          id: pokemonData.id,
          name: pokemonData.name,
          height: pokemonData.height,
          weight: pokemonData.weight,
          types: pokemonData.types.map((t) => t.type.name).join(", "),
          image: pokemonData.sprites.front_default,
        },
      ];
    }

    const pokemonList = data as PokemonListAPIResponse;
    const detailedResults = await Promise.all(
      pokemonList.results.map(async (pokemon) => {
        try {
          const detailsResponse = await fetch(pokemon.url);

          if (!detailsResponse.ok) {
            console.warn(`Error fetching details for ${pokemon.name}: ${detailsResponse.status}`);
            return null;
          }

          const details: PokemonAPIResponse = await detailsResponse.json();
          return {
            id: details.id,
            name: details.name,
            height: details.height,
            weight: details.weight,
            types: details.types.map((t) => t.type.name).join(", "),
            image: details.sprites.front_default,
          };
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}:`, error);
          return null;
        }
      })
    );

    return detailedResults.filter((p) => p !== null) as Pokemon[];
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
