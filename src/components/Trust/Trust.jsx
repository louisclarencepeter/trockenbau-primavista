import './Trust.scss';

const trustPoints = [
  {
    title: 'Saubere Ausführung',
    text: 'Wir arbeiten präzise, strukturiert und mit hohem Anspruch an ein sauberes Endergebnis.',
  },
  {
    title: 'Termintreue',
    text: 'Verlässliche Planung und pünktliche Umsetzung sorgen für einen reibungslosen Ablauf.',
  },
  {
    title: 'Klare Kommunikation',
    text: 'Transparente Abstimmung und direkte Erreichbarkeit schaffen Vertrauen in jeder Projektphase.',
  },
  {
    title: 'Individuelle Lösungen',
    text: 'Jedes Projekt wird passend zu Raum, Anforderung und Zielsetzung geplant und umgesetzt.',
  },
];

function Trust() {
  return (
    <section className="trust section" id="ueber-uns">
      <div className="container">
        <div className="trust__header">
          <span className="trust__eyebrow">WARUM KUNDEN UNS VERTRAUEN</span>
          <h2 className="trust__title">Qualität, auf die Sie sich verlassen können</h2>
          <p className="trust__text">
            Wir verbinden saubere handwerkliche Ausführung mit klarer Kommunikation,
            zuverlässiger Planung und einem hohen Anspruch an jedes Detail.
          </p>
        </div>

        <div className="trust__grid">
          {trustPoints.map((point) => (
            <article className="trust__card" key={point.title}>
              <div className="trust__icon"></div>
              <h3 className="trust__card-title">{point.title}</h3>
              <p className="trust__card-text">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Trust;