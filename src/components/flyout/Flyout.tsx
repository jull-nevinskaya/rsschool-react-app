import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleSelection } from "../../store/selectedPokemonsSlice";
import { saveAs } from "file-saver";

const Flyout: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPokemons = useSelector((state: RootState) => state.selectedPokemons);

  if (selectedPokemons.length === 0) return null;

  const handleUnselectAll = () => {
    selectedPokemons.forEach((pokemon) => dispatch(toggleSelection(pokemon)));
  };

  const handleDownloadCSV = () => {
    if (selectedPokemons.length === 0) return;

    const csvData = [
      ["ID", "Name", "Height", "Weight", "Types"],
      ...selectedPokemons.map((pokemon) => [
        pokemon.id,
        pokemon.name,
        pokemon.height,
        pokemon.weight,
        pokemon.types
      ]),
    ];

    const csvContent = csvData.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${selectedPokemons.length}_pokemons.csv`);
  };

  return (
    <div className="flyout">
      <p>{selectedPokemons.length} item(s) selected</p>
      <button onClick={handleUnselectAll}>Unselect all</button>
      <button onClick={handleDownloadCSV}>Download</button>
    </div>
  );
};

export default Flyout;
