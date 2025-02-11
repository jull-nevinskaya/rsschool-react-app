import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, NavigateFunction, Route, Routes } from 'react-router-dom';
import MainPage from "./MainPage";
import { jest } from "@jest/globals";

jest.mock("../../hooks/useSearchTerm.tsx", () => ({
  __esModule: true,
  default: () => ["", jest.fn()],
}));

jest.mock("../../api/api", () => ({
  fetchPokemons: jest.fn(() =>
    Promise.resolve({ pokemons: [], totalCount: 0 })
  ),
}));

const mockNavigate = jest.fn() as unknown as NavigateFunction;

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: (): NavigateFunction => mockNavigate,
  };
});
const renderWithRoute = async (initialEntries: string[]) => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/search" element={<p>Search Page</p>} />
          <Route path="/search/:id" element={<MainPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
};

describe("MainPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Search and CardList", async () => {
    await renderWithRoute(["/"]);

    expect(screen.getByTestId("container")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // Input в Search
    expect(screen.getByRole("button", { name: "Throw Error" })).toBeInTheDocument();
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
