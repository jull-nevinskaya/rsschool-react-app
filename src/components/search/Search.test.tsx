import { render, screen, fireEvent } from "@testing-library/react";
import Search from "./Search.tsx";

describe("Search component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saves the entered value to localStorage when Search button is clicked", () => {
    const mockOnSearch = jest.fn();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("Enter Pokemon name...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "Pikachu" } });
    fireEvent.click(button);

    expect(localStorage.setItem).toHaveBeenCalledWith("searchTerm", "Pikachu");

    expect(mockOnSearch).toHaveBeenCalledWith("Pikachu");
  });

  it("retrieves the value from localStorage upon mounting", () => {
    localStorage.setItem("searchTerm", "Pikachu");

    render(<Search onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText("Enter Pokemon name...");
    expect(input).toHaveValue("Pikachu");
  });
});
