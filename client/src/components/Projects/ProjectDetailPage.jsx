import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator, Check, ChevronRight } from 'lucide-react';
import './ProjectDetailPage.scss';
import { responsiveImageSizes } from '../../assets/responsiveImages';
import PageLink from '../PageLink/PageLink';
import ResponsivePicture from '../ResponsivePicture/ResponsivePicture';
import useScrollReveal from '../../hooks/useScrollReveal';
import { allProjects, getProjectBySlug } from './data/projectsCatalog';

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  const { sectionRef: heroRef, isVisible: isHeroVisible } = useScrollReveal({
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  });
  const { sectionRef: contentRef, isVisible: isContentVisible } = useScrollReveal({
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  });

  if (!project) {
    return <Navigate to="/#referenzen" replace />;
  }

  const otherProjects = allProjects.filter((entry) => entry.slug !== project.slug).slice(0, 3);
  const calculatorHref = project.calculatorChoiceId
    ? `/kalkulator?choice=${project.calculatorChoiceId}#kalkulator-konfiguration`
    : '/kalkulator';

  return (
    <div className="project-detail">
      <section
        ref={heroRef}
        className={`project-detail__hero${isHeroVisible ? ' project-detail__hero--visible' : ''}`}
      >
        <div className="container project-detail__hero-container">
          <nav className="project-detail__breadcrumb project-detail__reveal" aria-label="Breadcrumb">
            <Link to="/">Startseite</Link>
            <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
            <PageLink to="/#referenzen">Referenzen</PageLink>
            <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>{project.title}</span>
          </nav>

          <div className="project-detail__hero-grid">
            <div className="project-detail__hero-content project-detail__reveal">
              {project.eyebrow ? (
                <span className="project-detail__eyebrow">{project.eyebrow}</span>
              ) : (
                <span className="project-detail__eyebrow">Referenzprojekt</span>
              )}
              <h1 className="project-detail__title">{project.title}</h1>
              <p className="project-detail__lead">{project.summary}</p>

              <div className="project-detail__actions">
                <PageLink className="project-detail__cta" to={calculatorHref}>
                  <Calculator size={18} strokeWidth={2.1} aria-hidden="true" />
                  Ähnliches Projekt kalkulieren
                  <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
                </PageLink>
                <PageLink className="project-detail__cta project-detail__cta--ghost" to="/anfrage">
                  Anfrage stellen
                </PageLink>
              </div>
            </div>

            <div className="project-detail__hero-media project-detail__reveal">
              <ResponsivePicture
                image={project.image}
                sizes={responsiveImageSizes.projectsFeatured}
                alt={project.alt}
                loading="eager"
                decoding="async"
                className="project-detail__hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={contentRef}
        className={`project-detail__content${isContentVisible ? ' project-detail__content--visible' : ''}`}
      >
        <div className="container project-detail__content-container">
          <div className="project-detail__highlights project-detail__reveal">
            <h2 className="project-detail__section-title">Was wir umgesetzt haben</h2>
            <ul className="project-detail__list">
              {project.highlights.map((item) => (
                <li className="project-detail__list-item" key={item}>
                  <Check size={18} strokeWidth={2.3} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="project-detail__facts project-detail__reveal" aria-label="Projektdaten">
            <h2 className="project-detail__section-title">Projektdaten</h2>
            <dl className="project-detail__facts-list">
              {Object.entries(project.facts).map(([label, value]) => (
                <div className="project-detail__facts-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {project.gallery?.length ? (
        <section className="project-detail__gallery">
          <div className="container">
            <div className="project-detail__gallery-header">
              <span className="project-detail__eyebrow">Eindrücke</span>
              <h2 className="project-detail__section-title">Weitere Aufnahmen</h2>
            </div>

            <div className="project-detail__gallery-grid">
              {project.gallery.map((item, index) => (
                <figure className="project-detail__gallery-item" key={`${item.alt}-${index}`}>
                  <ResponsivePicture
                    image={item.image}
                    sizes={responsiveImageSizes.projectsGrid}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="project-detail__gallery-image"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="project-detail__related">
        <div className="container">
          <div className="project-detail__related-header">
            <span className="project-detail__eyebrow">Weitere Referenzen</span>
            <h2 className="project-detail__section-title">Mehr aus unseren Projekten</h2>
          </div>

          <div className="project-detail__related-grid">
            {otherProjects.map((entry) => (
              <PageLink
                key={entry.slug}
                className="project-detail__related-item"
                to={`/referenzen/${entry.slug}`}
              >
                <ResponsivePicture
                  image={entry.image}
                  sizes={responsiveImageSizes.projectsGrid}
                  alt={entry.alt}
                  loading="lazy"
                  decoding="async"
                  className="project-detail__related-image"
                />
                <div className="project-detail__related-overlay">
                  <h3 className="project-detail__related-title">{entry.title}</h3>
                </div>
              </PageLink>
            ))}
          </div>

          <PageLink className="project-detail__back" to="/#referenzen">
            <ArrowLeft size={18} strokeWidth={2.1} aria-hidden="true" />
            Zurück zur Übersicht
          </PageLink>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetailPage;
