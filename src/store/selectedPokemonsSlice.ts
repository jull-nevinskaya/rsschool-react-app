import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon } from "../api/pokemonApi";

const initialState: Pokemon[] = [];

const selectedPokemonsSlice = createSlice({
  name: "selectedPokemons",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<Pokemon>) => {
      const index = state.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.splice(index, 1);
      } else {
        state.push(action.payload);
      }
    },
  },
});

export const { toggleSelection } = selectedPokemonsSlice.actions;
export default selectedPokemonsSlice.reducer;
