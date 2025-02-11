import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

test("renders the Spinner component", () => {
  render(<Spinner />);

  const spinnerElement = screen.getByTestId("spinner");

  expect(spinnerElement).toBeInTheDocument();
  expect(spinnerElement).toHaveClass("spinner");
});
