import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card.tsx";

test("renders the card with correct Pokemon data", () => {
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

test("clicking the card triggers onClick event", () => {
  const mockOnClick = jest.fn();

  render(
      <Card id={1} name="Bulbasaur" image="https://example.com/bulbasaur.png" onClick={mockOnClick} />
  );

  const cardElement = screen.getByTestId("pokemon-card");
  fireEvent.click(cardElement);

  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
