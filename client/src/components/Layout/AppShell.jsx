import { Suspense, lazy, startTransition, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { scrollToHashTarget } from '../../utils/hashNavigation';

const Chatbot = lazy(() => import('../Chatbot/Chatbot'));
const CookieBanner = lazy(() => import('../CookieBanner/CookieBanner'));
const Footer = lazy(() => import('../Footer/Footer'));

function AppShell() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const isHomePage = currentPath === '/';
  const [showDeferredUi, setShowDeferredUi] = useState(() => !isHomePage);
  const [showFooter, setShowFooter] = useState(() => !isHomePage);
  const previousRouteRef = useRef(`${location.pathname}${location.search}`);

  useDocumentTitle(currentPath);

  useEffect(() => {
    if (typeof window === 'undefined' || location.hash) {
      previousRouteRef.current = `${location.pathname}${location.search}`;
      return undefined;
    }

    const nextRoute = `${location.pathname}${location.search}`;
    const didRouteChange = previousRouteRef.current !== nextRoute;

    previousRouteRef.current = nextRoute;

    if (!didRouteChange) {
      return undefined;
    }

    let animationFrameId;
    let timeoutId;

    const scrollToPageTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    };

    animationFrameId = window.requestAnimationFrame(scrollToPageTop);
    timeoutId = window.setTimeout(scrollToPageTop, 80);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === 'undefined' || !location.hash) {
      return undefined;
    }

    let attempts = 0;
    let timeoutId;
    let animationFrameId;

    const tryScrollToHash = () => {
      if (scrollToHashTarget(location.hash, { behavior: attempts === 0 ? 'smooth' : 'auto' })) {
        return;
      }

      if (attempts >= 10) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(tryScrollToHash);
      }, 60);
    };

    animationFrameId = window.requestAnimationFrame(tryScrollToHash);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!isHomePage) {
      startTransition(() => {
        setShowDeferredUi(true);
        setShowFooter(true);
      });

      return undefined;
    }

    if (location.hash && location.hash !== '#top') {
      startTransition(() => {
        setShowDeferredUi(true);
        setShowFooter(true);
      });

      return undefined;
    }

    if (showDeferredUi && showFooter) {
      return undefined;
    }

    let timeoutId;
    let idleId;
    let hasRevealedSupplementalUi = false;

    const revealSupplementalUi = () => {
      if (hasRevealedSupplementalUi) {
        return;
      }

      hasRevealedSupplementalUi = true;
      startTransition(() => {
        setShowDeferredUi(true);
        setShowFooter(true);
      });
    };

    const supplementalUiEvents = ['pointerdown', 'keydown', 'touchstart', 'wheel'];

    supplementalUiEvents.forEach((eventName) => {
      window.addEventListener(eventName, revealSupplementalUi, {
        passive: true,
        once: true,
      });
    });

    window.addEventListener('scroll', revealSupplementalUi, {
      passive: true,
      once: true,
    });

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealSupplementalUi, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(revealSupplementalUi, 4000);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      supplementalUiEvents.forEach((eventName) => {
        window.removeEventListener(eventName, revealSupplementalUi);
      });
      window.removeEventListener('scroll', revealSupplementalUi);
    };
  }, [isHomePage, location.hash, showDeferredUi, showFooter]);

  return (
    <>
      <Navbar isHomePage={isHomePage} currentPath={currentPath} />
      <main id="main-content">
        <Outlet />
      </main>
      {showFooter ? (
        <Suspense fallback={null}>
          <Footer isHomePage={isHomePage} />
        </Suspense>
      ) : null}
      {showDeferredUi ? (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      ) : null}
      {showDeferredUi ? (
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      ) : null}
    </>
  );
}

export default AppShell;
