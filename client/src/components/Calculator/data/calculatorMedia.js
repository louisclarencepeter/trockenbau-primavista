import {
  projectCeilingDrywallImage,
  projectDetailCeilingImage,
  projectExistingSpaceRenovationImage,
  projectFeaturedModernizationImage,
  projectFinishImage,
  serviceInteriorImage,
} from '../../../assets/responsiveImages';

export const heroMedia = [
  {
    id: 'montage',
    label: 'Wände',
    title: 'Wände und Unterkonstruktion',
    image: projectFeaturedModernizationImage,
    alt: 'Trockenbauprojekt mit vorbereiteten Wandflächen',
  },
  {
    id: 'finish',
    label: 'Ausbau',
    title: 'Saubere Oberflächen',
    image: serviceInteriorImage,
    alt: 'Trockenbau-Ausbau mit sauberem Finish',
  },
  {
    id: 'sanierung',
    label: 'Bestand',
    title: 'Trockenbau im Bestand',
    image: projectExistingSpaceRenovationImage,
    alt: 'Bestandsraum während der Trockenbauphase',
  },
];

export const requestMedia = [
  {
    id: 'anschluesse',
    label: 'Detailprüfung',
    title: 'Saubere Anschlüsse',
    text: 'Wir prüfen Übergänge, Kanten und vorbereitete Flächen vor dem verbindlichen Angebot.',
    image: projectDetailCeilingImage,
    alt: 'Detailansicht eines vorbereiteten Trockenbau-Projekts',
  },
  {
    id: 'decken',
    label: 'Ausführung',
    title: 'Decken & Wände',
    text: 'Decken, Wände, Beplankung und Unterkonstruktion werden sauber nachvollziehbar geplant.',
    image: projectCeilingDrywallImage,
    alt: 'Trockenbau-Projekt mit Decken- und Wandflächen',
  },
  {
    id: 'finish',
    label: 'Finish',
    title: 'Bereit für den Abschluss',
    text: 'Zum Schluss geht es um klare Oberflächen, stimmige Details und ein gepflegtes Ergebnis.',
    image: projectFinishImage,
    alt: 'Trockenbau-Projekt mit vorbereiteten Oberflächen und Finish-Arbeiten',
  },
];
