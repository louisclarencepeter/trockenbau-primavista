import { useLocation, useNavigate } from 'react-router-dom';
import PageLink from '../PageLink/PageLink';
import { scrollToHashTarget } from '../../utils/hashNavigation';

const isModifiedEvent = (event) => (
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);

function HashLink({
  to,
  children,
  onClick,
  className,
  ...props
}) {
  const location = useLocation();
  const navigate = useNavigate();

  if (typeof to !== 'string' || (!to.startsWith('#') && !to.startsWith('/#'))) {
    return (
      <PageLink to={to} className={className} onClick={onClick} {...props}>
        {children}
      </PageLink>
    );
  }

  const hash = to.startsWith('/#') ? to.slice(1) : to;
  const targetPath = '/';
  const isHomePage = location.pathname === '/';
  const href = `${targetPath}${hash}`;

  const handleClick = (event) => {
    onClick?.(event);

    if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
      return;
    }

    event.preventDefault();

    const targetId = hash.replace(/^#/, '');
    const targetExistsOnPage = !!document.getElementById(targetId);

    if (isHomePage || targetExistsOnPage) {
      scrollToHashTarget(hash);
      return;
    }

    navigate({ pathname: targetPath, hash });
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export default HashLink;
