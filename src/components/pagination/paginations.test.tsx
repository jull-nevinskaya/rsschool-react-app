import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Router } from "react-router-dom";
import Pagination from "./Pagination";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../ThemeContext";

describe("Pagination Component", () => {
  test("does not render if total pages are less than 1", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/?page=1"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Pagination totalItems={0} itemsPerPage={10} />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  test("does not render if only 1 page exists", () => {
    const { container } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination totalItems={10} itemsPerPage={10} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders if total pages are more than 1", () => {
    render(
      <MemoryRouter initialEntries={["/?page=1"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Pagination totalItems={25} itemsPerPage={10} />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Page 1 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /←/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /→/ })).toBeEnabled();
  });

  test("displays the correct current page", () => {
    render(
      <MemoryRouter initialEntries={["/?page=2"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Pagination totalItems={30} itemsPerPage={10} />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Page 2 / 3")).toBeInTheDocument();
  });

  test("back button is disabled on the first page", () => {
    render(
      <MemoryRouter initialEntries={["/?page=1"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Pagination totalItems={30} itemsPerPage={10} />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /←/ })).toBeDisabled();
  });

  test("next button is disabled on the last page", () => {
    render(
      <MemoryRouter initialEntries={["/?page=3"]}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Pagination totalItems={30} itemsPerPage={10} />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /→/ })).toBeDisabled();
  });

  test("switches to the next page", async () => {
    const history = createMemoryHistory({ initialEntries: ["/?page=1"] });

    render(
      <ThemeProvider>
        <Router location={history.location} navigator={history}>
          <Pagination totalItems={30} itemsPerPage={10} />
        </Router>
      </ThemeProvider>
    );

    const nextButton = screen.getByRole("button", { name: /→/ });

    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(history.location.search).toBe("?page=2");
    });
  });

  test("switches to the previous page", async () => {
    const history = createMemoryHistory({ initialEntries: ["/?page=2"] });

    render(
      <ThemeProvider>
        <Router location={history.location} navigator={history}>
          <Pagination totalItems={30} itemsPerPage={10} />
        </Router>
      </ThemeProvider>
    );

    const backButton = screen.getByRole("button", { name: /←/ });

    await userEvent.click(backButton);

    await waitFor(() => {
      expect(history.location.search).toBe("?page=1");
    });
  });

});

