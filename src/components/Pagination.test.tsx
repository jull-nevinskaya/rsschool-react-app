import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import { jest } from "@jest/globals";

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
      <Pagination totalItems={30} itemsPerPage={10} />
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
      <Pagination totalItems={30} itemsPerPage={10} />
    </MemoryRouter>
  );

  prevButtons = screen.getAllByRole("button", { name: /←/i });
  expect(prevButtons[1]).toBeEnabled();

  fireEvent.click(prevButtons[1]);

  await waitFor(() => {
    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: "1" });
  });
});
