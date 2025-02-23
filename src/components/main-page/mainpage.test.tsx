import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, NavigateFunction, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import MainPage from "./MainPage";
import { jest } from "@jest/globals";
import { ThemeProvider } from "../../ThemeContext";
import { useGetPokemonsQuery, pokemonApi } from "../../api/pokemonApi";
import { createMockStore } from "../../__mocks__/createMockStore";

jest.mock("../../api/pokemonApi", () => {
  const actual = jest.requireActual("../../api/pokemonApi") as Record<string, object>;
  return {
    ...actual,
    useGetPokemonsQuery: jest.fn(),
    pokemonApi: {
      ...actual.pokemonApi,
      reducerPath: "pokemonApi",
      reducer: (state = {}) => state,
      middleware: () => (next: (action: unknown) => void) => (action: unknown) => next(action),
    },
  };
});

jest.mock("../../hooks/useSearchTerm", () => ({
  __esModule: true,
  default: () => ["", jest.fn()],
}));

const mockNavigate = jest.fn() as unknown as NavigateFunction;

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  };
});

const createTestStore = () =>
  createMockStore({
    selectedPokemons: [],
    [pokemonApi.reducerPath]: pokemonApi.reducer(undefined, { type: '@@INIT' }),
  });

const renderWithRoute = async (initialEntries: string[]) => {
  const store = createTestStore();
  await act(async () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/search" element={<p>Search Page</p>} />
              <Route path="/search/:id" element={<MainPage />} />
              <Route path="/" element={<MainPage />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  });
};

describe("MainPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetPokemonsQuery as jest.Mock).mockReturnValue({
      data: { pokemons: [], totalCount: 0 },
      isLoading: false,
      error: undefined,
    });
  });

  test("renders search bar and card list", async () => {
    await renderWithRoute(["/"]);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toBeInTheDocument();
  });

  test("renders toggle theme button and can switch themes", async () => {
    await renderWithRoute(["/"]);
    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
    fireEvent.click(themeButton);
    expect(screen.getByTestId("container")).toHaveClass("dark");
  });

  test("closes details panel on outside click if id is present", async () => {
    await renderWithRoute(["/search/1?page=2"]);
    const container = await screen.findByTestId("container");
    await act(async () => {
      fireEvent.click(container);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/search?page=2");
  });

  test("renders details panel when id is present", async () => {
    await renderWithRoute(["/search/1"]);
    await waitFor(() => {
      expect(screen.getByTestId("details-panel")).toBeInTheDocument();
    });
  });

  test("does not render details panel when id is missing", async () => {
    await renderWithRoute(["/search"]);
    await waitFor(() => {
      expect(screen.queryByTestId("details-panel")).not.toBeInTheDocument();
    });
  });
});
