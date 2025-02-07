import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import CardList from "./CardList";
import { fetchPokemons } from "../api/api";
import { jest } from "@jest/globals";

jest.mock("../api/api");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useSearchParams: jest.fn(),
  };
});

const mockFetchPokemons = fetchPokemons as jest.MockedFunction<typeof fetchPokemons>;
const mockSetSearchParams = jest.fn();

beforeEach(() => {
  (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams("?page=1"), mockSetSearchParams]);
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Подавляет все console.error
});

afterEach(() => {
  jest.restoreAllMocks(); // Восстанавливает оригинальное поведение console.error
});

describe("CardList Component", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  test("renders a list of Pokemon", async () => {
    mockFetchPokemons.mockResolvedValue({
      pokemons: [
        { id: 1, name: "Bulbasaur", image: "bulbasaur.png" },
        { id: 2, name: "Charmander", image: "charmander.png" },
      ],
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Bulbasaur/i)).toBeInTheDocument();
    expect(await screen.findByText(/Charmander/i)).toBeInTheDocument();
  });

  test("renders the correct number of Pokemon cards", async () => {
    mockFetchPokemons.mockResolvedValue({
      pokemons: [
        { id: 1, name: "Bulbasaur", image: "bulbasaur.png" },
        { id: 2, name: "Charmander", image: "charmander.png" },
        { id: 3, name: "Squirtle", image: "squirtle.png" },
      ],
      totalCount: 3,
    });

    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );

    const cards = await screen.findAllByTestId("pokemon-card");
    expect(cards).toHaveLength(3);
  });

  test("displays an error message when no Pokemon are found", async () => {
    mockFetchPokemons.mockResolvedValue({
      pokemons: [],
      totalCount: 0,
    });

    render(
      <MemoryRouter>
        <CardList searchTerm="UnknownPokemon" />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No Pokemon found for "UnknownPokemon"/i)).toBeInTheDocument();
  });

  test("adds 'details' parameter when a Pokémon card is clicked", async () => {
    mockFetchPokemons.mockResolvedValue({
      pokemons: [{ id: 1, name: "Bulbasaur", image: "bulbasaur.png" }],
      totalCount: 1,
    });

    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );

    const card = await screen.findByText(/Bulbasaur/i);
    fireEvent.click(card);

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams("?page=1&details=1"));
  });

  test("renders spinner while loading", async () => {
    (fetchPokemons as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <CardList searchTerm="" />
      </MemoryRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders error message when API returns 404", async () => {
    (fetchPokemons as jest.Mock).mockRejectedValue(new Error("404") as unknown as never);

    render(
      <MemoryRouter>
        <CardList searchTerm="Unknown" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Pokemon not found. Let's try a different name")).toBeInTheDocument();
  });

  test("renders error message when API returns 400", async () => {
    (fetchPokemons as jest.Mock).mockRejectedValue(new Error("400") as unknown as never);

    render(
      <MemoryRouter>
        <CardList searchTerm="InvalidQuery" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Invalid search query. Please try again")).toBeInTheDocument();
  });

  test("renders error message when API returns 500", async () => {
    (fetchPokemons as jest.Mock).mockRejectedValue(new Error("500") as unknown as never);

    render(
      <MemoryRouter>
        <CardList searchTerm="ServerIssue" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Server error. Please try again later")).toBeInTheDocument();
  });

  test("renders network error message when API fails unexpectedly", async () => {
    (fetchPokemons as jest.Mock).mockRejectedValue(new Error("Network timeout") as unknown as never);

    render(
      <MemoryRouter>
        <CardList searchTerm="TimeoutTest" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Network error. Please check your connection")).toBeInTheDocument();
  });
});
