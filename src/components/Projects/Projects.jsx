import './Projects.scss';
import useScrollReveal from '../../hooks/useScrollReveal';

import project1 from '../../assets/images/projects/project-featured-modernization.jpg';
import project2 from '../../assets/images/projects/project-ceiling-drywall.jpg';
import project3 from '../../assets/images/projects/project-existing-space-renovation.jpg';
import project4 from '../../assets/images/services/service-interior.jpg';
import project5 from '../../assets/images/projects/project-detail-ceiling.jpg';
import project6 from '../../assets/images/projects/project-finish.jpg';
import project7 from '../../assets/images/services/service-renovation.jpg';

const supportingProjects = [
  {
    image: project2,
    title: 'Decken- und Trockenbau',
    alt: 'Trockenbau-Projekt mit sichtbarer Decken- und Leitungsstruktur',
  },
  {
    image: project3,
    title: 'Sanierung im Bestand',
    alt: 'Sanierungsprojekt mit vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: project4,
    title: 'Moderner Innenausbau',
    alt: 'Innenausbau mit moderner Raumgestaltung und sauberer Ausführung',
  },
  {
    image: project5,
    title: 'Feine Detailarbeiten',
    alt: 'Ausbauprojekt mit präzise ausgeführten Decken- und Übergangsdetails',
  },
  {
    image: project6,
    title: 'Renovierung mit Finish',
    alt: 'Renovierungsprojekt mit hochwertigem Finish und sauberer Umsetzung',
  },
  {
    image: project7,
    title: 'Sanierte Wohnräume',
    alt: 'Heller sanierter Wohnraum mit hochwertiger Ausführung',
  },
];

function Projects() {
  const { sectionRef: projectsRef, isVisible } = useScrollReveal({
    once: false,
  });

  return (
    <section
      ref={projectsRef}
      className={`projects section${isVisible ? ' projects--visible' : ''}`}
      id="referenzen"
    >
      <div className="container">
        <div className="projects__header">
          <span className="projects__eyebrow projects__reveal">REFERENZEN</span>
          <h2 className="projects__title projects__reveal">Ausgewählte Projekte</h2>
          <p className="projects__text projects__reveal">
            Ein Einblick in unsere bisherigen Arbeiten im Bereich Trockenbau,
            Sanierung und Innenausbau.
          </p>
        </div>

        <div className="projects__layout">
          <article className="projects__featured projects__reveal">
            <img
              src={project1}
              alt="Innenausbau-Projekt mit moderner Trockenbau-Ausführung"
              className="projects__image"
            />
            <div className="projects__overlay projects__overlay--featured">
              <h3 className="projects__featured-title">Wohnraum-Modernisierung</h3>
              <p className="projects__featured-text">
                Hochwertiger Innenausbau mit klarer Linienführung und sauberer
                handwerklicher Ausführung.
              </p>
            </div>
          </article>

          <div className="projects__grid">
            {supportingProjects.map((project) => (
              <article className="projects__item projects__reveal" key={project.title}>
                <img
                  src={project.image}
                  alt={project.alt}
                  className="projects__image"
                />
                <div className="projects__overlay">
                  <h4 className="projects__item-title">{project.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
