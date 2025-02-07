import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import { fetchPokemonDetails } from "../api/api";
import { jest } from "@jest/globals";

jest.mock("../api/api");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useSearchParams: jest.fn(),
  };
});
const mockFetchPokemonDetails = fetchPokemonDetails as jest.MockedFunction<typeof fetchPokemonDetails>;
const mockSetSearchParams = jest.fn();

beforeEach(() => {
  (useSearchParams as jest.MockedFunction<typeof useSearchParams>).mockReturnValue([
    new URLSearchParams("?page=1&details=25"),
    mockSetSearchParams,
  ]);
});

describe("PokemonDetails Component", () => {
  test("displays a loading spinner while fetching data", () => {
    mockFetchPokemonDetails.mockReturnValue(new Promise(() => {
    }));

    render(
      <MemoryRouter>
        <PokemonDetails pokemonId="1" />
      </MemoryRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders detailed Pokemon data correctly", async () => {
    mockFetchPokemonDetails.mockResolvedValue({
      id: 25,
      name: "Pikachu",
      height: 4,
      weight: 60,
      types: ["Electric"],
      image: "pikachu.png",
    });

    render(
      <MemoryRouter>
        <PokemonDetails pokemonId="25" />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/Height:/i)).toBeInTheDocument();
    expect(screen.getByText(/4/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
    expect(screen.getByText(/60/i)).toBeInTheDocument();
    expect(screen.getByText(/Types:/i)).toBeInTheDocument();
    expect(screen.getByText(/Electric/i)).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "pikachu.png");
    expect(img).toHaveAttribute("alt", "Pikachu");
  });

  test("hides the component when close button is clicked", async () => {
    mockFetchPokemonDetails.mockResolvedValue({
      id: 25,
      name: "Pikachu",
      height: 4,
      weight: 60,
      types: ["Electric"],
      image: "pikachu.png",
    });

    render(
      <MemoryRouter>
        <PokemonDetails pokemonId="25" />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Pikachu/i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeButton);

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams("?page=1"));
  });
})
