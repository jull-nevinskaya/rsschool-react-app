import React, { useState, useEffect } from 'react';
import Card from './Card';
import Spinner from './Spinner';
import { fetchPokemons } from '../api/api';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string;
  image: string;
}

interface CardListProps {
  searchTerm: string;
}

const CardList: React.FC<CardListProps> = ({ searchTerm }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPokemons = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchPokemons(searchTerm, 10, 0);
      setTimeout(() => {
        setPokemons(results);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setError("Pokemon not found!");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons(searchTerm);
  }, [searchTerm]);

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="card-list">
      {pokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          height={pokemon.height}
          weight={pokemon.weight}
          types={pokemon.types}
          image={pokemon.image}
        />
      ))}
    </div>
  );
};

export default CardList;
