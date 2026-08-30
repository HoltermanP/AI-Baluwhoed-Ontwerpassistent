export type Phase =
  | "Acquisitie"
  | "Haalbaarheid"
  | "Conceptontwikkeling"
  | "VO"
  | "DO"
  | "Bestek/Inkoop"
  | "Realisatie"
  | "Beheer";

export type Layer = "Site" | "Structure" | "Skin" | "Services" | "Space plan" | "Stuff";
export type Theme = "CO2" | "Circulariteit" | "Water" | "Biodiversiteit" | "Gezondheid";
export type MeasureStatus = "verplicht" | "sterk" | "suggestie";
export type ProjectTypeKey = "egw" | "mgw" | "renovatie";
export type DataQuality = "mpg" | "benchmark" | "unknown";

export interface Measure {
  id: string;
  title: string;
  status: MeasureStatus;
  theme: Theme;
  layer: Layer;
  phases: Phase[];
  description: string;
  source: string;
  scores: {
    duurzaamheid: number;
    technisch: number;
    financieel: number;
    kansrijk: number;
  };
}

export const phases: Phase[] = [
  "Acquisitie",
  "Haalbaarheid",
  "Conceptontwikkeling",
  "VO",
  "DO",
  "Bestek/Inkoop",
  "Realisatie",
  "Beheer"
];

export const layers = ["Alle lagen", "Site", "Structure", "Skin", "Services", "Space plan", "Stuff"];
export const themes = ["Alle thema's", "CO2", "Circulariteit", "Water", "Biodiversiteit", "Gezondheid"];

export const budgets: Record<ProjectTypeKey, { label: string; value: number }> = {
  egw: { label: "Eengezinswoning", value: 159 },
  mgw: { label: "Meergezinswoning", value: 175 },
  renovatie: { label: "Renovatie/transformatie", value: 63 }
};

export const principles: { title: string; body: string }[] = [
  {
    title: "Voorkom uitstoot eerst",
    body: "Stuur op minder bouwvolume, hergebruik en ontwerpoptimalisatie voordat materiaalvervanging of compensatie in beeld komt."
  },
  {
    title: "Laagste impact binnen randvoorwaarden",
    body: "Vergelijk alternatieven op CO2, techniek, kosten en projectkansrijkheid. Gebruik MPG, NMD, NIBE of EPD-data als onderbouwing."
  },
  {
    title: "Ontwerp adaptief",
    body: "Beperk toekomstige vervangingscycli met losmaakbaarheid, flexibiliteit en materialen met hoog waardebehoud."
  }
];

export const questions: [string, string][] = [
  ["Budget", "Wat is de Paris Proof prestatie en hoeveel reductie is nodig?"],
  ["Impact", "Welke gebouwonderdelen of materialen hebben het grootste volume of de hoogste MKI/MPG-impact?"],
  ["Strategie", "Kan het ontwerp minder materiaal gebruiken, bestaande constructie benutten of een andere bouwmethode kiezen?"],
  ["Data", "Is er cat. 1 of 2 NMD-data of een betere EPD beschikbaar voor het alternatief?"],
  ["Besluit", "Welke optie scoort het best op duurzaamheid, techniek, financieel effect en kansrijkheid?"]
];

export const approachPillars: [string, string][] = [
  ["Per fase", "De ontwikkelmanager ziet per projectfase welke duurzame keuze nu op tafel ligt."],
  ["Concreet", "Elke maatregel heeft status, criteria, vervolgstap en bron."],
  ["Actueel", "Producten en leveranciers staan in een aparte, actualiseerbare databron."],
  ["Procesgericht", "Keuzes zijn gekoppeld aan fasebesluiten, 6S-laag en marktstandaarden."]
];

export const phaseDecisions: Record<Phase, [string, string][]> = {
  Acquisitie: [
    ["Ambitie vastleggen", "Paris Proof, BENG2 = 0, NL Greenlabel en tenderstrategie bepalen."],
    ["Context scannen", "Bestaande bebouwing, locatie, wateropgave en kansrijke conceptpartners beoordelen."],
    ["Bewijslast plannen", "Welke berekeningen zijn al nodig voor tender of IJkpunt 0?"]
  ],
  Haalbaarheid: [
    ["CO2-budget bepalen", "Projectprestatie afzetten tegen Paris Proof en benodigde reductie kwantificeren."],
    ["Hoofdconcept kiezen", "Constructie, energieconcept, gebouwvorm en behoud/nieuwbouw afwegen."],
    ["Business case openen", "Meerkosten en opbrengsten van maatregelen tijdig aan directie kunnen voorleggen."]
  ],
  Conceptontwikkeling: [
    ["Materiaalstrategie", "R-ladder, grootste impactonderdelen en biobased/circulair potentieel kiezen."],
    ["Partnerstrategie", "CO2-bewuste bouwpartners of leveranciers vroeg selecteren of voorschrijven."],
    ["Gebiedsstrategie", "NL Greenlabel, water, gezondheid en groenbeleving meenemen in het concept."]
  ],
  VO: [
    ["Variantvergelijking", "MPG/NMD/LCA-alternatieven voor constructie, gevel, installaties en afbouw vergelijken."],
    ["Randvoorwaarden vastleggen", "Techniek, brand, akoestiek, onderhoud, kosten en planning valideren."],
    ["Optimalisatiebesluit", "Besluiten welke maatregelen naar DO gaan en welke afvallen met reden."]
  ],
  DO: [
    ["Specificeren", "Productdata, cat. 1/2 NMD-kaarten, EPD's en losmaakbaarheid concreet maken."],
    ["Borging", "Eisen opnemen in ontwerpdocumenten, SKO-model en vraagspecificatie."],
    ["Risico's sluiten", "Beschikbaarheid, garantie, onderhoud en uitvoerbaarheid toetsen."]
  ],
  "Bestek/Inkoop": [
    ["Uitvragen", "CO2-, MKI-, MPG- en circulariteitseisen vertalen naar inkoopstukken."],
    ["Leveranciers vergelijken", "Niet alleen laagste prijs, ook impactdata en maakbaarheid scoren."],
    ["Contracteren", "Borg prestatie-eisen, bewijsstukken en afwijkingsprocedure."]
  ],
  Realisatie: [
    ["Borgen", "Controleer dat gekozen producten, hoeveelheden en leveranciers werkelijk worden toegepast."],
    ["Afwijkingen sturen", "Wijzigingen opnieuw toetsen op CO2, techniek, financieel effect en kansrijkheid."],
    ["Data terugleggen", "Lessons learned en werkelijke productdata terug naar de database."]
  ],
  Beheer: [
    ["Waarde behouden", "Repareren, hergebruiken en uitstroom naar refurbish leveranciers organiseren."],
    ["Prestaties leren", "Onderhoud, klachten en vervangingen gebruiken om richtlijnen te verbeteren."],
    ["Database actualiseren", "Verouderde maatregelen, leveranciers en aannames markeren."]
  ]
};

export const standardsByTheme: Record<Theme, string[]> = {
  CO2: ["Paris Proof", "MPG", "BENG", "Betonakkoord"],
  Circulariteit: ["Het Nieuwe Normaal", "Building Balance 30-30-30", "NMD", "R-ladder"],
  Water: ["Manifest Bouwtafel Waterzuinige Wijken", "ISSO 70.1", "Hemelwaterverordening", "NL Greenlabel"],
  Biodiversiteit: ["NL Gebiedslabel", "NL Terreinlabel", "3/30/300-regel", "Lichtvervuiling"],
  Gezondheid: ["Gezond Binnen Label", "NL Greenlabel Gezondheid", "Groenbeleving", "BENG1"]
};

export const sourceLayer: [string, string, string][] = [
  ["NMD", "Cat. 1/2/3 productkaarten, MKI en GWP voor toetsing van alternatieven.", "maandelijks checken"],
  ["NIBE / EPD", "Verdieping wanneer NMD-data ontbreekt of te generiek is.", "per maatregel checken"],
  ["Projectdata", "MPG, BENG, SKO, plankaarten, PvE, BIM-export en ontwerpnotities.", "per fase verversen"],
  ["Ervaringsbank", "Lessons learned, partnerprestaties, business cases en afwijkingen.", "na elk project"]
];

export const measures: Measure[] = [
  {
    id: "transformeren",
    title: "Onderzoek transformatie of renovatie voor nieuwbouw",
    status: "verplicht",
    theme: "CO2",
    layer: "Structure",
    phases: ["Acquisitie", "Haalbaarheid"],
    description: "Bij bestaande bebouwing eerst bepalen of behoud, renovatie of optoppen mogelijk is. Dit heeft vaak het grootste reductiepotentieel.",
    source: "Werkwijze CO2 reducerende maatregelen",
    scores: { duurzaamheid: 5, technisch: 3, financieel: 4, kansrijk: 4 }
  },
  {
    id: "co2-budget",
    title: "Werk met maximaal kg CO2-budget per m2 BVO",
    status: "verplicht",
    theme: "CO2",
    layer: "Structure",
    phases: ["Acquisitie", "Haalbaarheid", "Conceptontwikkeling"],
    description: "Leg vroeg een projectbudget vast en toets ontwerpvarianten tegen de Paris Proof grenswaarde.",
    source: "Stappenplan CO2 bewuste keuzes",
    scores: { duurzaamheid: 5, technisch: 4, financieel: 4, kansrijk: 5 }
  },
  {
    id: "massa-reductie",
    title: "Reduceer constructiemassa voor materiaalvervanging",
    status: "sterk",
    theme: "CO2",
    layer: "Structure",
    phases: ["Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "Optimaliseer stramienen, overspanningen, gebouwvorm en overdimensionering voordat een alternatief materiaal wordt gekozen.",
    source: "Mailvoorstel en Copper8 werkwijze",
    scores: { duurzaamheid: 5, technisch: 4, financieel: 5, kansrijk: 4 }
  },
  {
    id: "houthybride",
    title: "Onderzoek houthybride of biobased constructie",
    status: "verplicht",
    theme: "CO2",
    layer: "Structure",
    phases: ["Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "Vergelijk beton, hout en hybride concepten op MPG, CO2, bouwtijd, brandveiligheid en maakbaarheid.",
    source: "Mailvoorstel, PvE 30-30-30 Building Balance",
    scores: { duurzaamheid: 5, technisch: 3, financieel: 3, kansrijk: 4 }
  },
  {
    id: "beton",
    title: "Gebruik beton met lage MKI en secundaire grondstoffen",
    status: "sterk",
    theme: "CO2",
    layer: "Structure",
    phases: ["VO", "DO", "Bestek/Inkoop"],
    description: "Vraag mengseloptimalisatie, circulair beton of CO2-arm beton uit volgens Betonakkoord plafond- en koploperwaarden.",
    source: "PvE Duurzaamheid 2026 en maatregelenlijst",
    scores: { duurzaamheid: 4, technisch: 5, financieel: 4, kansrijk: 5 }
  },
  {
    id: "prefab-paal",
    title: "Vergelijk prefab heipalen met in het werk gevormde palen",
    status: "suggestie",
    theme: "CO2",
    layer: "Structure",
    phases: ["VO", "DO"],
    description: "Toets funderingsalternatieven op CO2-reductie, bodemcondities, planning en risico.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 3, technisch: 4, financieel: 3, kansrijk: 3 }
  },
  {
    id: "gevelisolatie",
    title: "Vervang PUR/PIR door houtvezel, vlas of lage-impact isolatie",
    status: "sterk",
    theme: "CO2",
    layer: "Skin",
    phases: ["Conceptontwikkeling", "VO", "DO"],
    description: "Neem isolatiewaarde, dikte, brandklasse, vochtgedrag en NMD-data mee in de vergelijking.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 4, technisch: 3, financieel: 3, kansrijk: 4 }
  },
  {
    id: "hergebruik-gevel",
    title: "Pas hergebruikte baksteen of losmaakbare gevelsystemen toe",
    status: "sterk",
    theme: "Circulariteit",
    layer: "Skin",
    phases: ["Conceptontwikkeling", "VO", "DO", "Bestek/Inkoop"],
    description: "Koppel materiaalkeuze aan losmaakbaarheid, onderhoud en beschikbare hergebruikstromen.",
    source: "Maatregelenlijst Copper8 en mailvoorstel",
    scores: { duurzaamheid: 5, technisch: 3, financieel: 3, kansrijk: 3 }
  },
  {
    id: "glas",
    title: "Kies glasniveau op integrale prestatie in plaats van standaard maximaal",
    status: "suggestie",
    theme: "CO2",
    layer: "Skin",
    phases: ["VO", "DO"],
    description: "Vergelijk HR++, drievoudig glas en vacuumglas op materiaalimpact, comfort, BENG en installatielast.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 3, technisch: 4, financieel: 4, kansrijk: 4 }
  },
  {
    id: "installatielast",
    title: "Verlaag BENG1 en beperk installatiemateriaal",
    status: "sterk",
    theme: "CO2",
    layer: "Services",
    phases: ["Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "Ontwerp passiever en voorkom onnodige installaties, PV-overmaat of te grote warmtepompen.",
    source: "PvE Duurzaamheid 2026 en toelichting",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 5, kansrijk: 4 }
  },
  {
    id: "pv",
    title: "Gebruik PV-panelen met duurzame productie of hergebruik",
    status: "suggestie",
    theme: "CO2",
    layer: "Services",
    phases: ["DO", "Bestek/Inkoop"],
    description: "Vraag productdata op en beoordeel of hergebruik of lage-impact productie passend is.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 3, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "water",
    title: "Maak het ontwerp waterbespaarklaar",
    status: "verplicht",
    theme: "Water",
    layer: "Services",
    phases: ["Conceptontwikkeling", "VO", "DO"],
    description: "Voorzie waterverdeelstation, leidingwerk, ruimte voor hemelwateropvang en waar nodig voorbereiding voor grijswaterhergebruik.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "binnenwanden",
    title: "Vergelijk lage-impact binnenwanden",
    status: "suggestie",
    theme: "CO2",
    layer: "Space plan",
    phases: ["VO", "DO", "Bestek/Inkoop"],
    description: "Vergelijk metal-stud, HSB, FAAY en kalkzandsteen op MKI, flexibiliteit, akoestiek en brand.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 3, technisch: 4, financieel: 4, kansrijk: 5 }
  },
  {
    id: "biobased-afwerking",
    title: "Gebruik biobased afwerking waar technisch passend",
    status: "suggestie",
    theme: "Circulariteit",
    layer: "Space plan",
    phases: ["DO", "Bestek/Inkoop"],
    description: "Denk aan leem, hennepplaten of andere biobased afbouwmaterialen met onderbouwde productdata.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 4, technisch: 3, financieel: 3, kansrijk: 3 }
  },
  {
    id: "producten",
    title: "Voorkom of hergebruik losse producten",
    status: "suggestie",
    theme: "Circulariteit",
    layer: "Stuff",
    phases: ["DO", "Bestek/Inkoop", "Realisatie"],
    description: "Onderzoek vervallen keukenblok, hergebruikte producten of refurbished installatiedelen zoals thermostaten en WTW-units.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 4, technisch: 3, financieel: 4, kansrijk: 3 }
  },
  {
    id: "greenlabel",
    title: "Stuur gebied op NL Greenlabel A of B",
    status: "sterk",
    theme: "Biodiversiteit",
    layer: "Site",
    phases: ["Acquisitie", "Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "Neem biodiversiteit, water, gezondheid, groenbeleving en beperking van lichtvervuiling mee in het gebiedsontwerp.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "verplichte-berekeningen",
    title: "Start verplichte berekeningen vanaf SO of tenderfase",
    status: "verplicht",
    theme: "CO2",
    layer: "Services",
    phases: ["Acquisitie", "Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "BENG, MPG, Het Nieuwe Normaal, Betonakkoord en NL Greenlabel zijn de bewijslast voor het halen van doelen.",
    source: "PvE Duurzaamheid 2026 proceskaders",
    scores: { duurzaamheid: 5, technisch: 4, financieel: 4, kansrijk: 5 }
  },
  {
    id: "business-case",
    title: "Leg duurzame meer- en minderkosten als business case voor",
    status: "verplicht",
    theme: "Circulariteit",
    layer: "Site",
    phases: ["Haalbaarheid", "Conceptontwikkeling", "VO", "DO"],
    description: "Maak kosten, opbrengsten, rendementseffect en doelbijdrage expliciet voor directiebesluitvorming.",
    source: "PvE Duurzaamheid 2026 proceskaders",
    scores: { duurzaamheid: 3, technisch: 5, financieel: 5, kansrijk: 5 }
  },
  {
    id: "hnn-waardebehoud",
    title: "Toets adaptief vermogen, losmaakbaarheid en hergebruikpotentie",
    status: "sterk",
    theme: "Circulariteit",
    layer: "Space plan",
    phases: ["Conceptontwikkeling", "VO", "DO"],
    description: "Gebruik Het Nieuwe Normaal om waardebehoud en afvalloos bouwen concreet te beoordelen.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "drinkwater-90",
    title: "Ontwerp richting 90 liter drinkwater p.p.p.d.",
    status: "verplicht",
    theme: "Water",
    layer: "Services",
    phases: ["Haalbaarheid", "Conceptontwikkeling", "VO", "DO"],
    description: "Combineer waterzuinig sanitair, kranen, kopersopties en voorbereiding op hemelwater- of grijswaterhergebruik.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "lichtvervuiling",
    title: "Beperk lichtvervuiling zonder sociale veiligheid te verliezen",
    status: "suggestie",
    theme: "Biodiversiteit",
    layer: "Site",
    phases: ["Conceptontwikkeling", "VO", "DO"],
    description: "Stuur verlichting op biodiversiteit en gezondheid, in samenhang met sociale veiligheid en beheer.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 3, technisch: 4, financieel: 4, kansrijk: 3 }
  },
  {
    id: "groenbeleving",
    title: "Gebruik 3/30/300 als ontwerpcheck voor groenbeleving",
    status: "sterk",
    theme: "Gezondheid",
    layer: "Site",
    phases: ["Acquisitie", "Haalbaarheid", "Conceptontwikkeling", "VO"],
    description: "Vertaal groenbeleving naar gebiedsontwikkeling en beinvloed waar mogelijk ook opstalontwikkelingen.",
    source: "PvE Duurzaamheid 2026",
    scores: { duurzaamheid: 4, technisch: 4, financieel: 3, kansrijk: 4 }
  },
  {
    id: "beheer",
    title: "Repareer en borg materiaalstromen in beheer",
    status: "suggestie",
    theme: "Circulariteit",
    layer: "Stuff",
    phases: ["Realisatie", "Beheer"],
    description: "Repareer in plaats van vervangen, bestel niet te veel en organiseer uitstroom naar erkende refurbish leveranciers.",
    source: "Maatregelenlijst Copper8",
    scores: { duurzaamheid: 3, technisch: 5, financieel: 5, kansrijk: 4 }
  }
];
