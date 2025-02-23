import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardList from "./CardList";
import { ThemeProvider } from "../../ThemeContext";
import { Provider } from "react-redux";
import { createMockStore } from "../../__mocks__/createMockStore";
import { useGetPokemonsQuery } from "../../api/pokemonApi";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: jest.fn(() => [new URLSearchParams("?page=1"), jest.fn()]),
}));

jest.mock("../../api/pokemonApi", () => ({
  ...jest.requireActual("../../api/pokemonApi"),
  useGetPokemonsQuery: jest.fn(),
}));


const renderWithProviders = (ui: React.ReactNode, initialState?: Record<string, unknown>) => {

  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe("CardList", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation((message) => {
      if (typeof message === "string" && message.includes("Failed to load pokemons")) {
        return;
      }
      console.warn(message);
    });

    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: { pokemons: [], totalCount: 0 },
      isLoading: false,
      error: undefined,
    });
  });


  test("renders list of pokemons", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [
          { id: 1, name: "Bulbasaur", image: "bulbasaur.png", height: 7, weight: 69, types: ["Grass", "Poison"] },
          { id: 2, name: "Charmander", image: "charmander.png", height: 6, weight: 85, types: ["Fire"] },
        ],
        totalCount: 2,
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    expect(await screen.findByText(/Bulbasaur/i)).toBeInTheDocument();
    expect(await screen.findByText(/Charmander/i)).toBeInTheDocument();
  });

  test("correct number of pokemon cards", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [
          { id: 1, name: "Bulbasaur", image: "bulbasaur.png", height: 7, weight: 69, types: ["Grass", "Poison"] },
          { id: 2, name: "Charmander", image: "charmander.png", height: 6, weight: 85, types: ["Fire"] },
          { id: 3, name: "Squirtle", image: "squirtle.png", height: 5, weight: 90, types: ["Water"] },
        ],
        totalCount: 3,
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    const cards = await screen.findAllByTestId("pokemon-card");
    expect(cards).toHaveLength(3);
  });

  test("error message when no found", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: { pokemons: [], totalCount: 0 },
      isLoading: false,
      isFetching: false,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="UnknownPokemon" />);

    expect(await screen.findByText(/No Pokemon found for "UnknownPokemon"/i)).toBeInTheDocument();
  });

  test("detail page", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [{ id: 1, name: "Bulbasaur", image: "bulbasaur.png", height: 7, weight: 69, types: ["Grass", "Poison"] }],
        totalCount: 1,
      },
      isLoading: false,
      isFetching: false,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    const card = await screen.findByText(/Bulbasaur/i);
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("details/1?page=1");
  });

  test("renders spinner while loading", () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders error message when API call fails", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: new Error("API Error"),
    });

    renderWithProviders(<CardList searchTerm="ErrorTest" />);

    expect(await screen.findByText("Failed to load pokemons. Try again later.")).toBeInTheDocument();
  });

  test("correct theme from context", () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: { pokemons: [], totalCount: 0 },
      isLoading: false,
      isFetching: false,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    const cardList = screen.getByTestId("card-list");
    expect(cardList).toHaveClass("card-list light");
  });

  test("renders spinner when isFetching is true", async () => {
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: {
        pokemons: [{ id: 1, name: "Bulbasaur", image: "bulbasaur.png", height: 7, weight: 69, types: ["Grass", "Poison"] }],
        totalCount: 1,
      },
      isLoading: false,
      isFetching: true,
      error: undefined,
    });

    renderWithProviders(<CardList searchTerm="" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    expect(await screen.findByText(/Bulbasaur/i)).toBeInTheDocument();
  });

});
