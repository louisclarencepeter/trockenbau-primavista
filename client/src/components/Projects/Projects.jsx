import './Projects.scss';
import useScrollReveal from '../../hooks/useScrollReveal';
import { responsiveImageSizes } from '../../assets/responsiveImages';
import PageLink from '../PageLink/PageLink';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';
import { featuredProject, supportingProjects } from './data/projectsCatalog';

function Projects() {
  const { sectionRef: projectsRef, isVisible } = useScrollReveal();

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
          <PageLink
            className="projects__featured projects__reveal"
            to={`/referenzen/${featuredProject.slug}`}
          >
            <ResponsivePicture
              image={featuredProject.image}
              sizes={responsiveImageSizes.projectsFeatured}
              alt={featuredProject.alt}
              loading="lazy"
              decoding="async"
              className="projects__image"
            />
            <div className="projects__overlay projects__overlay--featured">
              <h3 className="projects__featured-title">{featuredProject.title}</h3>
              <p className="projects__featured-text">{featuredProject.shortText}</p>
            </div>
          </PageLink>

          <div className="projects__grid">
            {supportingProjects.map((project) => (
              <PageLink
                className="projects__item projects__reveal"
                key={project.slug}
                to={`/referenzen/${project.slug}`}
              >
                <ResponsivePicture
                  image={project.image}
                  sizes={responsiveImageSizes.projectsGrid}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                  className="projects__image"
                />
                <div className="projects__overlay">
                  <h4 className="projects__item-title">{project.title}</h4>
                </div>
              </PageLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
