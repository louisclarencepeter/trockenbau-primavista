import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import UeberUns from './components/UeberUns/UeberUns';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Chatbot from './components/Chatbot/Chatbot';
import CookieBanner from './components/CookieBanner/CookieBanner';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <UeberUns />
        <Projects />
        <Contact />
        <Footer />
      </main>
      <Chatbot />
      <CookieBanner />
    </>
  );
}

export default App;
