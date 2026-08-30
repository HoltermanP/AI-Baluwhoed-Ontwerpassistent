import { Measure, Phase, phases } from "./data";

/**
 * Verdiepende gegevens per maatregel:
 * - reduction: indicatieve CO2-reductie in kg CO2/m2 BVO (bandbreedte, alleen embodied carbon).
 * - evidence: concrete bewijsstukken die nodig zijn om de maatregel hard te maken.
 *
 * De reductiewaarden zijn indicatief en bedoeld om richting te geven in een vroege fase;
 * ze worden pas betrouwbaar na een MPG/LCA-variantberekening.
 */
export interface MeasureDetail {
  reduction: [number, number];
  evidence: string[];
}

export const measureDetails: Record<string, MeasureDetail> = {
  transformeren: {
    reduction: [40, 90],
    evidence: ["Bouwkundige opname bestaande constructie", "Quickscan behoud vs. nieuwbouw (CO2 en kosten)", "Constructieve haalbaarheid optoppen/uitbreiden"]
  },
  "co2-budget": {
    reduction: [0, 0],
    evidence: ["Vastgesteld CO2-budget in projectdossier", "MPG- of CO2-indicatie per variant", "Toetsmoment per fase afgesproken"]
  },
  "massa-reductie": {
    reduction: [10, 25],
    evidence: ["Stramien- en overspanningsstudie constructeur", "Vergelijking vloerdikten/betonvolumes", "Onderbouwing gebouwvorm en compactheid"]
  },
  houthybride: {
    reduction: [25, 60],
    evidence: ["Variantvergelijking beton / hout / hybride (MPG, CO2)", "Brandveiligheids- en akoestisch advies", "Kostenraming en bouwtijdvergelijking"]
  },
  beton: {
    reduction: [8, 20],
    evidence: ["MKI-waarde mengsel volgens Betonakkoord", "NMD cat. 1/2 productkaart of EPD", "Aandeel secundaire grondstoffen aangetoond"]
  },
  "prefab-paal": {
    reduction: [2, 6],
    evidence: ["Funderingsadvies met varianten", "CO2-vergelijking paaltypen", "Sondering en bodemcondities"]
  },
  gevelisolatie: {
    reduction: [3, 8],
    evidence: ["NMD-data isolatiealternatieven", "Brandklasse en vochthuishouding gecontroleerd", "Rc-waarde en gevelopbouw vastgelegd"]
  },
  "hergebruik-gevel": {
    reduction: [4, 12],
    evidence: ["Beschikbare hergebruikstroom of leverancier", "Losmaakbaarheidsindex gevelsysteem", "Onderhoudsplan gevel"]
  },
  glas: {
    reduction: [1, 4],
    evidence: ["BENG-effect per glasvariant", "Comfortberekening (oververhitting/daglicht)", "Materiaalimpact glasalternatieven"]
  },
  installatielast: {
    reduction: [4, 12],
    evidence: ["BENG1-berekening per variant", "Installatieconcept met vermogensonderbouwing", "PV-dimensionering op werkelijk gebruik"]
  },
  pv: {
    reduction: [1, 5],
    evidence: ["Productdata / EPD PV-panelen", "Herkomst en recyclebaarheid onderbouwd", "Terugverdientijd en opbrengstberekening"]
  },
  water: {
    reduction: [0, 0],
    evidence: ["Leidingconcept met waterverdeelstation", "Ruimtereservering hemelwateropvang", "Toets ISSO 70.1 en hemelwaterverordening"]
  },
  binnenwanden: {
    reduction: [2, 6],
    evidence: ["MKI-vergelijking wandsystemen", "Akoestisch en brandadvies", "Flexibiliteitsanalyse plattegrond"]
  },
  "biobased-afwerking": {
    reduction: [1, 4],
    evidence: ["Productdata biobased afwerking", "Toepasbaarheid (vocht, onderhoud) getoetst", "Kopersopties uitgewerkt"]
  },
  producten: {
    reduction: [1, 3],
    evidence: ["Lijst refurbished / vervallen producten", "Garantieafspraken leverancier", "Kopersinformatie aangepast"]
  },
  greenlabel: {
    reduction: [0, 0],
    evidence: ["NL Greenlabel gebiedspaspoort (voorlopige score)", "Groen- en waterplan gebied", "Beheerplan openbare ruimte"]
  },
  "verplichte-berekeningen": {
    reduction: [0, 0],
    evidence: ["BENG-berekening", "MPG-berekening", "Het Nieuwe Normaal rapportage", "Betonakkoord-toets", "NL Greenlabel-score"]
  },
  "business-case": {
    reduction: [0, 0],
    evidence: ["Meer-/minderkosten per maatregel", "Rendementseffect en opbrengsten", "Directiebesluit vastgelegd"]
  },
  "hnn-waardebehoud": {
    reduction: [2, 6],
    evidence: ["Losmaakbaarheidsindex", "Adaptiviteitsanalyse (HNN)", "Materiaalpaspoort of grondstoffenlijst"]
  },
  "drinkwater-90": {
    reduction: [0, 0],
    evidence: ["Waterbalans per woning (l/p/dag)", "Specificatie waterzuinig sanitair", "Voorbereiding grijswater-/hemelwaterhergebruik"]
  },
  lichtvervuiling: {
    reduction: [0, 0],
    evidence: ["Verlichtingsplan buitenruimte", "Toets sociale veiligheid", "Afstemming beheerder / gemeente"]
  },
  groenbeleving: {
    reduction: [0, 0],
    evidence: ["3/30/300-toets op plankaart", "Boomkroonbedekking en zichtlijnen", "Afstand tot groen per woning"]
  },
  beheer: {
    reduction: [0, 2],
    evidence: ["Onderhouds- en reparatieplan", "Afspraken refurbish-leveranciers", "Bestelregime zonder overmaat"]
  }
};

export function detail(measure: Measure): MeasureDetail {
  return measureDetails[measure.id] ?? { reduction: [0, 0], evidence: [] };
}

export function reductionMid(measure: Measure): number {
  const [low, high] = detail(measure).reduction;
  return (low + high) / 2;
}

export function phaseIndex(phase: Phase): number {
  return phases.indexOf(phase);
}

/** Laatste fase waarin de maatregel nog kan worden besloten. */
export function lastPhase(measure: Measure): Phase {
  return [...measure.phases].sort((a, b) => phaseIndex(b) - phaseIndex(a))[0];
}

/** Maatregel verloopt na de huidige fase: nu besluiten of bewust laten vallen. */
export function isLastChance(measure: Measure, phase: Phase): boolean {
  return lastPhase(measure) === phase;
}

/** Maatregel had in een eerdere fase al besloten moeten zijn. */
export function isExpired(measure: Measure, phase: Phase): boolean {
  return phaseIndex(lastPhase(measure)) < phaseIndex(phase);
}
