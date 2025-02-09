import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import { fetchPokemonDetails } from "../../api/api";
import { jest } from "@jest/globals";

jest.mock("../../api/api", () => ({
  fetchPokemonDetails: jest.fn() as jest.MockedFunction<typeof fetchPokemonDetails>,
}));

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("PokemonDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays Spinner while loading", async () => {
    (fetchPokemonDetails as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithRouter("/pokemon/1");

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders Pokemon details when API call is successful", async () => {
    const mockPokemon = {
      id: 1,
      name: "Pikachu",
      height: 4,
      weight: 60,
      types: ["Electric"],
      image: "https://example.com/pikachu.png",
    };

    (fetchPokemonDetails as jest.MockedFunction<typeof fetchPokemonDetails>).mockResolvedValue(mockPokemon);

    renderWithRouter("/pokemon/1");

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();

      // ✅ Теперь TypeScript не ругается
      expect(screen.getByText((_, element) => element?.textContent === "Height: 4")).toBeInTheDocument();
      expect(screen.getByText((_, element) => element?.textContent === "Weight: 60")).toBeInTheDocument();
      expect(screen.getByText((_, element) => element?.textContent === "Types: Electric")).toBeInTheDocument();

      expect(screen.getByRole("img", { name: "Pikachu" })).toHaveAttribute("src", "https://example.com/pikachu.png");
    });
  });

  test("displays error message when API call fails", async () => {
    (fetchPokemonDetails as jest.MockedFunction<typeof fetchPokemonDetails>).mockRejectedValue(
      new Error("API error"));

    renderWithRouter("/pokemon/1");

    expect(await screen.findByText("Failed to load Pokémon details. Please try again.")).toBeInTheDocument();
  });

});
