import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card.tsx";
import { ThemeProvider } from "../../ThemeContext.tsx";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { createMockStore } from '../../__mocks__/createMockStore.ts';

const renderWithProviders = (component: ReactNode, store: ReturnType<typeof createMockStore>) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>{component}</ThemeProvider>
    </Provider>
  );
};

test("renders the card with correct pokemon", () => {
  const pokemon = {
    id: 25,
    name: "Pikachu",
    image: "pikachu.png",
    height: 4,
    weight: 60,
    types: ["Electric"],
  };

  const store = createMockStore({ selectedPokemons: [] });

  renderWithProviders(
    <Card
      id={pokemon.id}
      name={pokemon.name}
      image={pokemon.image}
      height={pokemon.height}
      weight={pokemon.weight}
      types={pokemon.types}
    />,
    store
  );

  expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
  expect(screen.getByText(/#25/i)).toBeInTheDocument();

  const img = screen.getByRole("img");
  expect(img).toHaveAttribute("src", "pikachu.png");
  expect(img).toHaveAttribute("alt", "Pikachu");
});

test("onClick event", () => {
  const mockOnClick = jest.fn();

  const store = createMockStore({ selectedPokemons: [] });

  renderWithProviders(
    <Card
      id={1}
      name="Bulbasaur"
      image="https://example.com/bulbasaur.png"
      height={7}
      weight={69}
      types={["Grass", "Poison"]}
      onClick={mockOnClick}
    />,
    store
  );

  const cardElement = screen.getByTestId("pokemon-card");
  fireEvent.click(cardElement);

  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

test("checkbox toggles selection", () => {
  const pokemon = {
    id: 4,
    name: "Charmander",
    image: "charmander.png",
    height: 6,
    weight: 85,
    types: ["Fire"],
  };

  const store = createMockStore({ selectedPokemons: [] });

  renderWithProviders(
    <Card
      id={pokemon.id}
      name={pokemon.name}
      image={pokemon.image}
      height={pokemon.height}
      weight={pokemon.weight}
      types={pokemon.types}
    />,
    store
  );

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(store.getState().selectedPokemons).toContainEqual({
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.image,
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types,
  });
});
