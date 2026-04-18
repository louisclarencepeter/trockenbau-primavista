import { Link, useLocation } from 'react-router-dom';

const isModifiedEvent = (event) => (
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);

const normalizePath = (value) => value.replace(/\/+$/, '') || '/';

function PageLink({
  to,
  children,
  onClick,
  ...props
}) {
  const location = useLocation();

  const handleClick = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      typeof to !== 'string' ||
      event.button !== 0 ||
      isModifiedEvent(event)
    ) {
      return;
    }

    const targetUrl = new URL(to, window.location.origin);
    const targetPath = normalizePath(targetUrl.pathname);
    const currentPath = normalizePath(location.pathname);
    const isSamePage =
      currentPath === targetPath &&
      location.search === targetUrl.search &&
      !targetUrl.hash;

    if (!isSamePage) {
      return;
    }

    event.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export default PageLink;
