import React from "react";
import { Link } from "react-router-dom";
import pikachuImg from '../../assets/pikachu.jpg';
import { useTheme } from '../../hooks/useTheme.ts';

const NotFound: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div>
      <h2>Ooops... something went wrong (404)</h2>
      <img className="error-img" src={pikachuImg} alt="Sad Pikachu" />
      <Link to="/search?page=1" className={`home-link ${theme}`}>Main page</Link>
    </div>
  )
};

export default NotFound;
