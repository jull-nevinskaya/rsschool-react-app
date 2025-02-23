import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonApiResponse {
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
  image: string;
  height: number;
  weight: number;
  types: string[];
}

export interface PokemonListAPIResponse {
  count: number;
  results: { name: string; url: string }[];
}

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getPokemons: builder.query<
      { pokemons: Pokemon[]; totalCount: number },
      { searchTerm?: string; limit?: number; offset?: number }
    >({
      query: ({ searchTerm = "", limit = 15, offset = 0 }) =>
        searchTerm
          ? `/${encodeURIComponent(searchTerm.toLowerCase())}`
          : `?limit=${limit}&offset=${offset}`,
      transformResponse: async (response: PokemonListAPIResponse | PokemonApiResponse) => {
        if ("id" in response) {
          return {
            pokemons: [
              {
                id: response.id,
                name: response.name,
                image: response.sprites.front_default,
                height: response.height,
                weight: response.weight,
                types: response.types.map(t => t.type.name),
              },
            ],
            totalCount: 1,
          };
        }

        const detailedResults = await Promise.all(
          response.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            const details: PokemonApiResponse = await detailsResponse.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_default,
              height: details.height,
              weight: details.weight,
              types: details.types.map(t => t.type.name),
            };
          })
        );

        return { pokemons: detailedResults, totalCount: response.count };
      },
    }),
  }),
});

export const { useGetPokemonsQuery } = pokemonApi;
