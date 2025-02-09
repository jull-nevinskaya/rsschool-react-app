import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetails } from "../../api/api.ts";
import Spinner from '../spinner/Spinner.tsx';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  image: string;
}

const PokemonDetails: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchPokemonDetails(id)
      .then((data) => setPokemon(data))
      .catch(() => setError("Failed to load Pokémon details. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = () => {
    const currentParams = new URLSearchParams(window.location.search);
    const page = currentParams.get("page") || "1";

    navigate(`/search?page=${page}`);
  };

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;
  if (!pokemon) return <p>No details available</p>;

  return (
    <div className="detail-info">
      <div className="detail-header">
        <button className="btn-close" onClick={handleClose}>&times;</button>
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
