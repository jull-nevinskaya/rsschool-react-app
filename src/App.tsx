import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NotFound from "./components/404/NotFound.tsx";
import "./App.css";
import MainPage from "./components/main-page/MainPage.tsx";
import PokemonDetails from "./components/pokemon-details/PokemonDetails.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate replace to="/search?page=1" />} />
          <Route path="/search" element={<MainPage />}>
            <Route path="details/:id" element={<PokemonDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
