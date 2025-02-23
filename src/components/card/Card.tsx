import React from 'react';
import { useTheme } from '../../ThemeContext.tsx';
import { useDispatch, useSelector } from "react-redux";
import { toggleSelection } from "../../store/selectedPokemonsSlice";
import { RootState } from "../../store/store";

interface CardProps {
  id: number;
  name: string;
  image: string;
  height: number;
  weight: number;
  types: string[];
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, name, image, height, weight, types, onClick }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isSelected = useSelector((state: RootState) =>
    state.selectedPokemons.some((p) => p.id === id)
  );

  const handleCheckboxChange = () => {
    dispatch(toggleSelection({ id, name, image, height, weight, types }));
  };

  return (
    <div className={`card ${theme}`} onClick={onClick} data-testid="pokemon-card">
      <input
        className="custom-checkbox"
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
      />
      <h3>{name} (#{id})</h3>
      <img src={image} alt={name} />
    </div>
  );
};


export default Card;
