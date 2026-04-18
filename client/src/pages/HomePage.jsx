import { Suspense, lazy } from 'react';
import Hero from '../components/Hero/Hero';
import Services from '../components/Services/Services';
import CalculatorTeaser from '../components/CalculatorTeaser/CalculatorTeaser';
import About from '../components/About/About';
import Projects from '../components/Projects/Projects';
import Contact from '../components/Contact/Contact';

const Reviews = lazy(() => import('../components/Reviews/Reviews'));

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <CalculatorTeaser />
      <About />
      <Projects />
      <Suspense fallback={null}>
        <Reviews />
      </Suspense>
      <Contact />
    </>
  );
}

export default HomePage;
