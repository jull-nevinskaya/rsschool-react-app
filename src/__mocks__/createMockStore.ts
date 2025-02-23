import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "../api/pokemonApi";
import selectedPokemonsReducer from "../store/selectedPokemonsSlice";
import { RootState } from "../store/store";

export const createMockStore = (initialState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
      selectedPokemons: selectedPokemonsReducer,
    },
    preloadedState: {
      selectedPokemons: initialState?.selectedPokemons ?? [], // Явно задаем начальное состояние
      ...initialState,
      [pokemonApi.reducerPath]: initialState?.[pokemonApi.reducerPath] ?? pokemonApi.reducer(undefined, { type: "@@INIT" }),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};
