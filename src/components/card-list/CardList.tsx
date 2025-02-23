import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetPokemonsQuery } from "../../api/pokemonApi.ts";
import Card from "../card/Card.tsx";
import Spinner from "../spinner/Spinner.tsx";
import Pagination from "../pagination/Pagination.tsx";
import { useTheme } from "../../hooks/useTheme.ts";

const DEFAULT_LIMIT = 15;

const CardList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const offset = (page - 1) * DEFAULT_LIMIT;
  const navigate = useNavigate();

  const { data, error, isLoading, isFetching } = useGetPokemonsQuery({ searchTerm, limit: DEFAULT_LIMIT, offset });

  const handleClick = (id: number) => {
    navigate(`details/${id}?page=${page}`);
  };

  const pokemons = data?.pokemons ?? [];

  if (isLoading) return <Spinner />;
  if (error) {
    console.error("Failed to load pokemons:", error);
    return <p className="error-message">Failed to load pokemons. Try again later.</p>;
  }

  return (
    <div className="col-1">
      {isFetching && <Spinner />}

      <div className={`card-list ${theme}`} data-testid="card-list">
        {pokemons.length > 0 ? (
          pokemons.map((pokemon) => (
            <Card
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              height={pokemon.height}
              weight={pokemon.weight}
              types={pokemon.types}
              onClick={() => handleClick(pokemon.id)}
            />
          ))
        ) : (
          <p className="error-message">No Pokemon found for "{searchTerm}". Try a different name.</p>
        )}
      </div>

      {data?.totalCount && data.totalCount > DEFAULT_LIMIT && (
        <Pagination totalItems={data.totalCount} itemsPerPage={DEFAULT_LIMIT} />
      )}
    </div>
  );
};

export default CardList;
