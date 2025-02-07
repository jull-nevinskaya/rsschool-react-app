import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Подавляем console.error
});

afterEach(() => {
  jest.restoreAllMocks(); // Восстанавливаем console.error после тестов
});

describe("ErrorBoundary component", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">No Error</div>
      </ErrorBoundary>
    );

    // Проверяем, что отрендерен дочерний элемент
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("displays error message when an error occurs", () => {
    // Рендерим компонент, который вызывает ошибку
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Проверяем, что появилось сообщение об ошибке
    expect(screen.getByText("Ooops... something went wrong(")).toBeInTheDocument();
    expect(screen.getByText("Try refreshing the page or click the button below")).toBeInTheDocument();
  });
});
