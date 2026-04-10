function Impressum() {
  return (
    <article className="legal-page__card" aria-labelledby="impressum-title">
      <span className="legal-page__label">Impressum</span>
      <h2 className="legal-page__card-title" id="impressum-title">Prima Vista B&amp;G GmbH</h2>

      <div className="legal-page__block">
        <h3 className="legal-page__heading">Kontaktadresse</h3>
        <address className="legal-page__address">
          Prima Vista B&amp;G GmbH
          <br />
          Spinnereistrasse 5
          <br />
          6020 Emmenbrücke
          <br />
          Schweiz
        </address>
        <p className="legal-page__paragraph">
          E-Mail:{' '}
          <a href="mailto:info@primavista-bauprojekte.ch" className="legal-page__link">
            info@primavista-bauprojekte.ch
          </a>
        </p>
        <p className="legal-page__paragraph">
          Webseite:{' '}
          <a
            href="https://www.primavista-bauprojekte.com"
            className="legal-page__link"
            target="_blank"
            rel="noreferrer"
          >
            www.primavista-bauprojekte.com
          </a>
        </p>
        <p className="legal-page__paragraph">
          Telefon:{' '}
          <a href="tel:+41782659332" className="legal-page__link">
            +41 78 265 93 32
          </a>
        </p>
      </div>

      <div className="legal-page__block">
        <h3 className="legal-page__heading">Vertretungsberechtigte Person</h3>
        <p className="legal-page__paragraph">Daniel Mihai Cirstea</p>
      </div>

      <div className="legal-page__block">
        <h3 className="legal-page__heading">Handelsregister-Eintrag</h3>
        <dl className="legal-page__meta">
          <div className="legal-page__meta-row">
            <dt>Eingetragener Firmenname</dt>
            <dd>Prima Vista B&amp;G GmbH</dd>
          </div>
          <div className="legal-page__meta-row">
            <dt>Handelsregister-Nummer (UID)</dt>
            <dd>CHE-345.302.685</dd>
          </div>
          <div className="legal-page__meta-row">
            <dt>Handelsregisteramt</dt>
            <dd>Kanton Luzern</dd>
          </div>
        </dl>
      </div>

      <div className="legal-page__block">
        <h3 className="legal-page__heading">Haftungsausschluss</h3>
        <p className="legal-page__paragraph">
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen
          Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit
          der Informationen.
        </p>
        <p className="legal-page__paragraph">
          Haftungsansprüche gegen den Autor wegen Schäden materieller oder
          immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw.
          Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der
          Verbindung oder durch technische Störungen entstanden sind, werden
          ausgeschlossen.
        </p>
      </div>
    </article>
  );
}

export default Impressum;
