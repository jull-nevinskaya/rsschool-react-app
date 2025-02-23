import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "../api/pokemonApi.ts";
import selectedPokemonsReducer from "./selectedPokemonsSlice.ts";

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    selectedPokemons: selectedPokemonsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
