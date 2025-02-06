import React from "react";
import { Link } from "react-router-dom";
import pikachuImg from '../assets/pikachu.jpg';

const NotFound: React.FC = () => {
  return (
    <div>
      <h2>Ooops... something went wrong (404)</h2>
      <img className="error-img" src={pikachuImg} alt="Sad Pikachu" />
      <Link to="/search?page=1">Go to Home</Link>
    </div>
  )
};

export default NotFound;
