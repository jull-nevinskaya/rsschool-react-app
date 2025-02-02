import { Component } from 'react';

interface CardProps {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string;
  image: string;
}

class Card extends Component<CardProps> {
  render() {
    return (
      <div className="card">
        <h3>{this.props.name} (#{this.props.id})</h3>
        <img src={this.props.image} alt={this.props.name} />
        <p>Height: {this.props.height}</p>
        <p>Weight: {this.props.weight}</p>
        <p>Type: {this.props.types}</p>
      </div>
    );
  }
}

export default Card;
