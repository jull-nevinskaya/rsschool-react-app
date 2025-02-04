import { Component } from "react";
import Card from "./Card";
import Spinner from "./Spinner";
import { fetchPokemons } from "../api/api";

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

interface CardListState {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
}

class CardList extends Component<CardListProps, CardListState> {
  state: CardListState = {
    pokemons: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.loadPokemons(this.props.searchTerm);
  }

  componentDidUpdate(prevProps: CardListProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.loadPokemons(this.props.searchTerm);
    }
  }

  loadPokemons = async (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    try {
      const results = await fetchPokemons(searchTerm, 10, 0);
      setTimeout(() => {
        this.setState({ pokemons: results, loading: false });
      }, 500);
    } catch (error) {
      console.error("API Fetch Error:", error);

      let errorMessage = "Unexpected error occurred. Please try again";

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Pokemon not found. Let's try a different name";
        } else if (error.message.startsWith("4")) {
          errorMessage = "Invalid search query. Please try again";
        } else if (error.message.startsWith("5")) {
          errorMessage = "Server error. Please try again later";
        } else {
          errorMessage = "Network error. Please check your connection";
        }
      }

      this.setState({ error: errorMessage, loading: false });
    }
  };

  render() {
    const { pokemons, loading, error } = this.state;

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
  }
}

export default CardList;
