import './Projects.scss';
import useScrollReveal from '../../hooks/useScrollReveal';
import {
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  responsiveImageSizes,
  serviceDrywallImage,
  serviceRoofSlopeImage,
  serviceSpecialImage,
} from '../../assets/responsiveImages';

const supportingProjects = [
  {
    image: projectCeilingDrywallImage,
    title: 'Decken abhängen',
    alt: 'Trockenbau-Projekt mit sichtbarer Decken- und Leitungsstruktur',
  },
  {
    image: projectExistingSpaceRenovationImage,
    title: 'Wände im Bestand',
    alt: 'Trockenbau-Projekt mit vorbereiteten Wand- und Deckenflächen',
  },
  {
    image: serviceDrywallImage,
    title: 'Estrich-Boden',
    alt: 'Rohbau-Innenraum mit vorbereitetem Boden für den weiteren Ausbau',
  },
  {
    image: projectDetailCeilingImage,
    title: 'Saubere Anschlüsse',
    alt: 'Ausbauprojekt mit präzise ausgeführten Decken- und Übergangsdetails',
  },
  {
    image: serviceRoofSlopeImage,
    title: 'Dachschrägen ausbauen',
    alt: 'Trockenbau-Ausbau an Dachschrägen mit Metallprofilen und Beplankung',
  },
  {
    image: serviceSpecialImage,
    title: 'Sonstige Leistungen',
    alt: 'Trockenbau-Sonderleistungen mit Dämmung und Installationen in einer Wand',
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
            Ein Einblick in unsere bisherigen Arbeiten rund um Decken, Wände,
            Bodenaufbau, Dachschrägen und saubere Trockenbau-Details.
          </p>
        </div>

        <div className="projects__layout">
          <article className="projects__featured projects__reveal">
            <img
              src={projectFeaturedModernizationImage.src}
              srcSet={projectFeaturedModernizationImage.srcSet}
              sizes={responsiveImageSizes.projectsFeatured}
              alt="Trockenbau-Projekt mit moderner Ausführung"
              width={projectFeaturedModernizationImage.width}
              height={projectFeaturedModernizationImage.height}
              loading="lazy"
              decoding="async"
              className="projects__image"
            />
            <div className="projects__overlay projects__overlay--featured">
              <h3 className="projects__featured-title">Trockenbau aus einer Hand</h3>
              <p className="projects__featured-text">
                Decken, Wände und Anschlussdetails sauber geplant und fachgerecht umgesetzt.
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
                  width={project.image.width}
                  height={project.image.height}
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
