const API_URL = "https://pokeapi.co/api/v2/pokemon";

export interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonApiResponse {
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
): Promise<{ pokemons: Pokemon[]; totalCount: number }> => {
  try {
    const url = searchTerm
      ? `${API_URL}/${encodeURIComponent(searchTerm.toLowerCase())}`
      : `${API_URL}?limit=${limit}&offset=${offset}`;

    console.log(`Fetching: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();

    if (searchTerm) {
      return {
        pokemons: [
          {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            types: data.types.map((t: PokemonType) => t.type.name).join(", "),
            image: data.sprites.front_default,
          },
        ],
        totalCount: 1,
      };
    }

    const detailedResults = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailsResponse = await fetch(pokemon.url);
        const details = await detailsResponse.json();
        return {
          id: details.id,
          name: details.name,
          height: details.height,
          weight: details.weight,
          types: details.types.map((t: PokemonType) => t.type.name).join(", "),
          image: details.sprites.front_default,
        };
      })
    );

    return { pokemons: detailedResults, totalCount: data.count };
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const fetchPokemonDetails = async (id: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Failed to fetch Pokémon data");

  const data: PokemonApiResponse = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
    image: data.sprites.front_default,
  };
};
