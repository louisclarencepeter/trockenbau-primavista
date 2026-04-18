export const getScrollBehavior = () => (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
);

const getAnchorOffset = () => {
  const navbar = document.querySelector('.navbar');
  const navbarHeight = navbar?.offsetHeight ?? 0;
  const extraGap = window.innerWidth <= 992 ? 24 : 32;

  return navbarHeight + extraGap;
};

export const scrollToHashTarget = (hash, options = {}) => {
  if (typeof window === 'undefined') {
    return false;
  }

  const normalizedHash = typeof hash === 'string' ? hash.trim() : '';

  if (!normalizedHash) {
    return false;
  }

  if (normalizedHash === '#top') {
    window.scrollTo({
      top: 0,
      behavior: options.behavior ?? getScrollBehavior(),
    });

    const homeUrl = `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(null, '', homeUrl || '/');
    return true;
  }

  const targetId = normalizedHash.replace(/^#/, '');
  const target = document.getElementById(targetId);

  if (!target) {
    return false;
  }

  const targetTop = window.scrollY + target.getBoundingClientRect().top - getAnchorOffset();

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: options.behavior ?? getScrollBehavior(),
  });

  window.history.replaceState(null, '', normalizedHash);
  return true;
};
