import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination.tsx";
import { jest } from "@jest/globals";
import { ThemeProvider } from '../../ThemeContext.tsx';

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useSearchParams: jest.fn(),
  };
});

const mockSetSearchParams = jest.fn();

beforeEach(() => {
  (useSearchParams as jest.MockedFunction<typeof useSearchParams>).mockReturnValue([
    new URLSearchParams("?page=1"),
    mockSetSearchParams,
  ]);
});

test("updates URL query parameter when page changes", async () => {
  render(
    <MemoryRouter>
      <ThemeProvider>
        <Pagination totalItems={30} itemsPerPage={10} />
      </ThemeProvider>
    </MemoryRouter>
  );

  const nextButton = screen.getByRole("button", { name: /→/i });

  let prevButtons = screen.getAllByRole("button", { name: /←/i });
  expect(prevButtons[0]).toBeDisabled();

  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: "2" });
  });

  (useSearchParams as jest.MockedFunction<typeof useSearchParams>).mockReturnValue([
    new URLSearchParams("?page=2"),
    mockSetSearchParams,
  ]);

  render(
    <MemoryRouter>
      <ThemeProvider>
       <Pagination totalItems={30} itemsPerPage={10} />
      </ThemeProvider>
    </MemoryRouter>
  );

  prevButtons = screen.getAllByRole("button", { name: /←/i });
  expect(prevButtons[1]).toBeEnabled();

  fireEvent.click(prevButtons[1]);

  await waitFor(() => {
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: "1" });
  });
});

test("if currentPage > totalPages, it sets page = totalPages", async () => {
  const setSearchParams = jest.fn();
  (useSearchParams as jest.Mock).mockReturnValue([
    new URLSearchParams("?page=10"),
    setSearchParams,
  ]);

  render(
    <MemoryRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Pagination totalItems={30} itemsPerPage={10} />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(setSearchParams).toHaveBeenCalledWith({ page: "3" });
  });
  expect(setSearchParams).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Page 10 / 3")).not.toBeInTheDocument();
});
