import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import { fetchPokemonDetails } from "../../api/api";
import { jest } from "@jest/globals";
import { ThemeProvider } from '../../ThemeContext.tsx';

jest.mock("../../api/api", () => ({
  fetchPokemonDetails: jest.fn() as jest.MockedFunction<typeof fetchPokemonDetails>,
}));

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <Routes>
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/pokemon" element={<PokemonDetails />} />
          <Route path="/search" element={<p>Search Page</p>} />
        </Routes>
      </ThemeProvider>
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

      expect(screen.getByText((_, element) =>
        element?.textContent === "Height: 4"
      )).toBeInTheDocument();

      expect(screen.getByText((_, element) =>
        element?.textContent === "Weight: 60"
      )).toBeInTheDocument();

      expect(screen.getByText((_, element) =>
        element?.textContent === "Types: Electric"
      )).toBeInTheDocument();

      expect(screen.getByRole("img", { name: "Pikachu" })).toHaveAttribute("src", "https://example.com/pikachu.png");
    });
  });

  test("displays error message when API call fails", async () => {
    (fetchPokemonDetails as jest.MockedFunction<typeof fetchPokemonDetails>).mockRejectedValue(
      new Error("API error")
    );

    renderWithRouter("/pokemon/1");

    expect(await screen.findByText("Failed to load Pokémon details. Please try again.")).toBeInTheDocument();
  });

  test("closes details when close button is clicked", async () => {
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
    });

    const closeButton = screen.getByRole("button", { name: /×/ });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Search Page")).toBeInTheDocument();
    });
  });

  test("renders 'No details available' when id is missing", () => {
    renderWithRouter("/pokemon");

    expect(screen.getByText("No details available")).toBeInTheDocument();
  });
});
