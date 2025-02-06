import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonDetails } from "../api/api"; // Функция для запроса API

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  image: string;
}

const PokemonDetails: React.FC<{ pokemonId: string }> = ({ pokemonId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Запрос в API при изменении `pokemonId`
  useEffect(() => {
    if (!pokemonId) return;

    setLoading(true);
    setError(null);

    fetchPokemonDetails(pokemonId)
      .then((data) => setPokemon(data))
      .catch(() => setError("Failed to load Pokémon details. Please try again."))
      .finally(() => setLoading(false));
  }, [pokemonId]);

  const handleClose = () => {
    searchParams.delete("details");
    setSearchParams(searchParams);
  };

  if (loading) return <p>Loading Pokémon details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!pokemon) return <p>No details available.</p>;

  return (
    <div>
      <button onClick={handleClose} style={{ marginBottom: "10px", cursor: "pointer" }}>
        ❌ Закрыть
      </button>
      <h2>Detailed info about {pokemon.name}</h2>
      <img src={pokemon.image} alt={pokemon.name} style={{ width: "150px" }} />
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>
      <p><strong>Types:</strong> {pokemon.types.join(", ")}</p>
    </div>
  );
};

export default PokemonDetails;
