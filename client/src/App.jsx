import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';
import ThemeProvider from './context/ThemeProvider';
import AppRoutes from './routes/AppRoutes';

function App({ initialTheme = 'light' }) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
