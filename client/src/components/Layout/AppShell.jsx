import { Suspense, lazy, startTransition, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Chatbot = lazy(() => import('../Chatbot/Chatbot'));
const CookieBanner = lazy(() => import('../CookieBanner/CookieBanner'));
const Footer = lazy(() => import('../Footer/Footer'));

function AppShell() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const isHomePage = currentPath === '/';
  const [showDeferredUi, setShowDeferredUi] = useState(() => !isHomePage);
  const [showFooter, setShowFooter] = useState(() => !isHomePage);

  useDocumentTitle(currentPath);

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
