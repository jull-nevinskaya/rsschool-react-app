import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import { ThemeProvider } from "../../ThemeContext";
import { useGetPokemonsQuery } from "../../api/pokemonApi";

jest.mock("../../api/pokemonApi", () => ({
  ...jest.requireActual("../../api/pokemonApi"),
  useGetPokemonsQuery: jest.fn(),
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

  test("displays Spinner while loading", () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    renderWithRouter("/pokemon/1");

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders Pokemon details when API call is successful", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [
          {
            id: 1,
            name: "Pikachu",
            height: 4,
            weight: 60,
            types: ["Electric"],
            image: "https://example.com/pikachu.png",
          },
        ],
      },
      isLoading: false,
      error: undefined,
    });

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
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API error"),
    });

    renderWithRouter("/pokemon/1");

    expect(await screen.findByText("Error loading Pokemon details.")).toBeInTheDocument();
  });

  test("closes details when close button is clicked", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [
          {
            id: 1,
            name: "Pikachu",
            height: 4,
            weight: 60,
            types: ["Electric"],
            image: "https://example.com/pikachu.png",
          },
        ],
      },
      isLoading: false,
      error: undefined,
    });

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

  test("renders 'No details available' when no data is found", () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: { pokemons: [] },
      isLoading: false,
      error: undefined,
    });

    renderWithRouter("/pokemon/1");

    expect(screen.getByText("No details available")).toBeInTheDocument();
  });
});
