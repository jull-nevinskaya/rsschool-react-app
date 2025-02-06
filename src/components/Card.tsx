interface CardProps {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string;
  image: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, name, height, weight, types, image, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <h3>{name} (#{id})</h3>
      <img src={image} alt={name} />
      <p>Height: {height}</p>
      <p>Weight: {weight}</p>
      <p>Type: {types}</p>
    </div>
  );
};


export default Card;
