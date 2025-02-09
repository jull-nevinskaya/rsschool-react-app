import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound Component", () => {
  test("renders error message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("Ooops... something went wrong (404)")).toBeInTheDocument();
  });

  test("renders error image", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const image = screen.getByRole("img", { name: "Sad Pikachu" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "mock-file");
  });

  test("renders link to main page", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Main page" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/search?page=1");
  });
});
