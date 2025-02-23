import { fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from "./ErrorBoundary.tsx";
import { useState } from 'react';

const ThrowError = () => {
  throw new Error("Test error");
};

const ToggleErrorComponent = () => {
  const [throwError, setThrowError] = useState(false);
  if (throwError) {
    throw new Error("Test error");
  }
  return (
    <button onClick={() => setThrowError(true)}>Trigger Error</button>
  );
};


beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ErrorBoundary component", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">No Error</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("displays error message when an error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Ooops... something went wrong(")).toBeInTheDocument();
    expect(screen.getByText("Try refreshing the page or click the button below")).toBeInTheDocument();
  });

  it("resets error state when 'Try Again' button is clicked", () => {
    render(
      <ErrorBoundary>
        <ToggleErrorComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText("Trigger Error"));

    expect(screen.getByText("Ooops... something went wrong(")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Try Again"));

    expect(screen.queryByText("Ooops... something went wrong(")).not.toBeInTheDocument();
    expect(screen.getByText("Trigger Error")).toBeInTheDocument();
  });
});
