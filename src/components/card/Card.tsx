interface CardProps {
  id: number;
  name: string;
  image: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, name, image, onClick }) => {
  return (
    <div className="card" onClick={onClick} data-testid="pokemon-card">
      <h3>{name} (#{id})</h3>
      <img src={image} alt={name} />
    </div>
  );
};


export default Card;
