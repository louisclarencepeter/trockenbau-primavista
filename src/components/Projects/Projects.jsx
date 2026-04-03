import './Projects.scss';
import useScrollReveal from '../../hooks/useScrollReveal';
import {
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  projectFinishImage,
  responsiveImageSizes,
  serviceInteriorImage,
  serviceRenovationImage,
} from '../../assets/responsiveImages';

const supportingProjects = [
  {
    image: projectCeilingDrywallImage,
    title: 'Decken- und Trockenbau',
    alt: 'Trockenbau-Projekt mit sichtbarer Decken- und Leitungsstruktur',
  },
  {
    image: projectExistingSpaceRenovationImage,
    title: 'Sanierung im Bestand',
    alt: 'Sanierungsprojekt mit vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: serviceInteriorImage,
    title: 'Moderner Innenausbau',
    alt: 'Innenausbau mit moderner Raumgestaltung und sauberer Ausführung',
  },
  {
    image: projectDetailCeilingImage,
    title: 'Feine Detailarbeiten',
    alt: 'Ausbauprojekt mit präzise ausgeführten Decken- und Übergangsdetails',
  },
  {
    image: projectFinishImage,
    title: 'Renovierung mit Finish',
    alt: 'Renovierungsprojekt mit hochwertigem Finish und sauberer Umsetzung',
  },
  {
    image: serviceRenovationImage,
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
              src={projectFeaturedModernizationImage.src}
              srcSet={projectFeaturedModernizationImage.srcSet}
              sizes={responsiveImageSizes.projectsFeatured}
              alt="Innenausbau-Projekt mit moderner Trockenbau-Ausführung"
              loading="lazy"
              decoding="async"
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
                  src={project.image.src}
                  srcSet={project.image.srcSet}
                  sizes={responsiveImageSizes.projectsGrid}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
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
