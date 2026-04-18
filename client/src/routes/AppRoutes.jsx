import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppShell from '../components/Layout/AppShell';
import HomePage from '../pages/HomePage';

const LegalPage = lazy(() => import('../components/Legal/LegalPage'));
const CalculatorPage = lazy(() => import('../components/Calculator/Calculator'));
const AnfragePage = lazy(() => import('../components/Anfrage/Anfrage'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="kalkulator" element={<CalculatorPage />} />
            <Route path="anfrage" element={<AnfragePage />} />
            <Route path="impressum" element={<LegalPage page="impressum" />} />
            <Route path="datenschutz" element={<LegalPage page="datenschutz" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
