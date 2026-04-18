import './Card.scss';

const Card = ({ title, text }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
    </div>
  );
};

export default Card;