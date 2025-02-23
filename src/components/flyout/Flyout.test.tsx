import { render, screen, fireEvent } from "@testing-library/react";
import Flyout from "./Flyout";
import { Provider } from "react-redux";
import { getMockStore } from "../../__mocks__/storeMock.ts";
import { toggleSelection } from "../../store/selectedPokemonsSlice";
import { saveAs } from "file-saver";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const renderWithProviders = (store: ReturnType<typeof getMockStore>) => {
  return render(
    <Provider store={store}>
      <Flyout />
    </Provider>
  );
};

describe("Flyout Component", () => {
  let store: ReturnType<typeof getMockStore>;

  beforeEach(() => {
    store = getMockStore();
  });

  test("does't render when pokemons arent selected", () => {
    const emptyStore = getMockStore();
    emptyStore.getState().selectedPokemons = [];

    renderWithProviders(emptyStore);

    expect(screen.queryByText(/item\(s\) selected/i)).not.toBeInTheDocument();
  });

  test("renders correctly with selected pokemons", () => {
    renderWithProviders(store);

    expect(screen.getByText(/2 item\(s\) selected/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download/i })).toBeInTheDocument();
  });

  test("unselects all pokemons button", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");

    renderWithProviders(store);

    fireEvent.click(screen.getByRole("button", { name: /Unselect all/i }));

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      toggleSelection(expect.objectContaining({ id: 1, name: "Bulbasaur" }))
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      toggleSelection(expect.objectContaining({ id: 2, name: "Charmander" }))
    );
  });


  test("downloads CSV file when clicking button", () => {
    renderWithProviders(store);

    fireEvent.click(screen.getByRole("button", { name: /Download/i }));

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "2_pokemons.csv");
  });

});
