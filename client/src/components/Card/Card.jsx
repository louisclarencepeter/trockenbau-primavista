import './Card.scss';

const clampHeadingLevel = (level) => {
  const parsedLevel = Number(level);

  return Number.isInteger(parsedLevel) && parsedLevel >= 2 && parsedLevel <= 6
    ? parsedLevel
    : 3;
};

function Card({
  as: TagProp = 'article',
  children,
  className = '',
  headingLevel = 3,
  text,
  title,
  ...props
}) {
  const Tag = TagProp;
  const Heading = `h${clampHeadingLevel(headingLevel)}`;
  const cardClassName = ['card', className].filter(Boolean).join(' ');

  return (
    <Tag className={cardClassName} {...props}>
      {title ? <Heading className="card-title">{title}</Heading> : null}
      {text ? <p className="card-text">{text}</p> : null}
      {children}
    </Tag>
  );
}

export default Card;
