import { render, screen } from "@testing-library/react";
import Card from "./Card";

test("renders the card with correct Pokémon data", () => {
  const pokemon = {
    id: 25,
    name: "Pikachu",
    image: "pikachu.png",
  };

  render(<Card id={pokemon.id} name={pokemon.name} image={pokemon.image} />);

  expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();

  expect(screen.getByText(/#25/i)).toBeInTheDocument();

  const img = screen.getByRole("img");
  expect(img).toHaveAttribute("src", "pikachu.png");
  expect(img).toHaveAttribute("alt", "Pikachu");
});
