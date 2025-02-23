import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPokemonsQuery } from "../../api/pokemonApi.ts";
import { useTheme } from "../../ThemeContext.tsx";

const PokemonDetails: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data } = useGetPokemonsQuery({});

  const pokemon = data?.pokemons.find((p) => p.id === Number(id));

  const handleClose = () => {
    const currentParams = new URLSearchParams(window.location.search);
    const page = currentParams.get("page") || "1";
    navigate(`/search?page=${page}`);
  };

  if (!pokemon) return <p>No details available</p>;

  return (
    <div className={`detail-info ${theme}`}>
      <div className="detail-header">
        <button className={`btn-close ${theme}`} onClick={handleClose}>&times;</button>
        <h2>{pokemon.name}</h2>
      </div>
      <img src={pokemon.image} alt={pokemon.name} style={{ width: "200px" }} />
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Types:</strong> {pokemon.types.join(", ")}</p>
    </div>
  );
};

export default PokemonDetails;
