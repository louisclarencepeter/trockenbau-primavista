import { Link } from 'react-router-dom';
import './Button.scss';

const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
}) => {
  const className = `button button-${variant}`;

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={className} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
}

  return (
    <button className={className} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
