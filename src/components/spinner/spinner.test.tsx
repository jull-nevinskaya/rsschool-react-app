import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";
import { ThemeProvider } from '../../ThemeContext.tsx';

test("renders the Spinner component", () => {
  render(
    <ThemeProvider>
      <Spinner />
    </ThemeProvider>
  );

  const spinnerElement = screen.getByTestId("spinner");

  expect(spinnerElement).toBeInTheDocument();
  expect(spinnerElement).toHaveClass("spinner");
});
