import './Button.scss';
import HashLink from '../HashLink/HashLink';
import PageLink from '../PageLink/PageLink';

const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
}) => {
  const className = `button button-${variant}`;

  if (href) {
    if (href.startsWith('#') || href.startsWith('/#')) {
      return (
        <HashLink to={href} className={className} onClick={onClick}>
          {children}
        </HashLink>
      );
    }

    if (href.startsWith('/')) {
      return (
        <PageLink to={href} className={className} onClick={onClick}>
          {children}
        </PageLink>
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
