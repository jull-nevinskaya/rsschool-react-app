import { renderHook, act } from "@testing-library/react";
import useSearchTerm from "./useSearchTerm";

beforeEach(() => {
  localStorage.clear();
});

test("initial state is empty if localStorage is empty", () => {
  const { result } = renderHook(() => useSearchTerm());

  expect(result.current[0]).toBe("");
});

test("initial state is taken from localStorage", () => {
  localStorage.setItem("searchTerm", "Pikachu");

  const { result } = renderHook(() => useSearchTerm());

  expect(result.current[0]).toBe("Pikachu");
});

test("updates searchTerm and saves to localStorage", () => {
  const { result } = renderHook(() => useSearchTerm());

  act(() => {
    result.current[1]("Charmander");
  });

  expect(result.current[0]).toBe("Charmander");
  expect(localStorage.getItem("searchTerm")).toBe("Charmander");
});
