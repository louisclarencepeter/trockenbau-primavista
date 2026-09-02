import { useEffect } from 'react';
import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';
import ThemeProvider from './context/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { registerContactClickTracking } from './utils/analytics';
import './styles/prima-vista-design.scss';

function App({ initialTheme = 'light' }) {
  useEffect(() => registerContactClickTracking(), []);

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
