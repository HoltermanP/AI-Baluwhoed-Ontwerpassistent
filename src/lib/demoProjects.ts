import { ProjectData, Workspace, createProject, evidenceKey } from "./project";

/**
 * Fictieve demoprojecten in de stijl van de Blauwhoed-portefeuille (stedelijke woningbouw,
 * gebiedsontwikkeling en transformatie). Namen, adressen en personen zijn verzonnen.
 */
export function buildDemoWorkspace(): Workspace {
  const havenkwartier: ProjectData = createProject({
    id: "demo-havenkwartier",
    profile: {
      name: "Havenkwartier Zaandam",
      location: "Zaandam, voormalig bedrijventerrein aan de Zaan",
      homes: 84,
      client: "Blauwhoed i.s.m. gemeente Zaanstad",
      description:
        "Gebiedsontwikkeling met 84 appartementen in twee bouwblokken van 6 en 8 woonlagen rond een collectieve binnentuin, 40% middenhuur. Parkeren half verdiept onder het dek. Gemeente vraagt in de selectie om Paris Proof en natuurinclusief bouwen.",
      ambitions:
        "Paris Proof 2026, BENG2 = 0, NL Greenlabel B voor het gebied, houthybride bovenbouw waar de brandveiligheid dit toelaat, drinkwatergebruik richting 90 liter p.p.p.d.",
      team: [
        { role: "Ontwikkelmanager", name: "Sanne de Vries" },
        { role: "Architect", name: "Studio Kade (Rotterdam)" },
        { role: "Constructeur", name: "Ingenieursbureau Veldt" },
        { role: "Duurzaamheidsadviseur", name: "Adviesbureau Delta Duurzaam" }
      ],
      documents: [
        {
          id: "doc-hk-1",
          name: "Selectieleidraad gemeente Zaanstad.pdf",
          size: 2_340_000,
          type: "application/pdf",
          addedAt: "2026-04-14",
          note: "Gunningscriteria: 35% duurzaamheid, 30% stedenbouw, 35% grondbod."
        },
        {
          id: "doc-hk-2",
          name: "MPG-indicatie SO variant A (beton).txt",
          size: 4_800,
          type: "text/plain",
          addedAt: "2026-06-02",
          text: "MPG-indicatie schetsontwerp Havenkwartier Zaandam, variant A betoncasco. BVO 9.400 m2 BVO. Resultaat MPG 0,62 euro/m2/jaar. Embodied carbon module A1-A3: 198 kg CO2 per m2 BVO. Grootste bijdragen: vloeren (breedplaat) 34%, fundering 12%, gevel (baksteen, PIR) 17%, installaties incl. PV 14%. Gebouw 8 woonlagen. Hemelwater bergen op dek en binnentuin; wadi in openbare ruimte. Tender gemeente Zaanstad."
        },
        {
          id: "doc-hk-3",
          name: "Notitie houthybride verkenning constructeur.txt",
          size: 3_100,
          type: "text/plain",
          addedAt: "2026-06-18",
          text: "Verkenning houthybride bovenbouw: betonkern en fundering, CLT-vloeren en HSB-gevelelementen vanaf de tweede verdieping. Verwachte reductie embodied carbon 25-35%. Aandachtspunten: brandwerendheid 120 minuten boven 13 meter, contactgeluid CLT-vloeren, vochtbeheersing tijdens bouw. Bouwtijd circa 3 weken korter door prefab."
        }
      ]
    },
    state: {
      phase: "VO",
      projectType: "mgw",
      co2: 198,
      bvo: 9400,
      dataQuality: "mpg",
      impactPart: "Structure",
      existingStructure: false,
      tenderMode: true,
      highRise: true,
      waterReady: true,
      contextNotes:
        "8 woonlagen, gemeente vraagt Paris Proof en NL Greenlabel in de selectie. Breedplaatvloeren grootste post in de MPG. Houthybride bovenbouw in verkenning bij constructeur.",
      theme: "Alle thema's",
      layer: "Alle lagen",
      status: "all"
    },
    selected: ["co2-budget", "massa-reductie", "houthybride", "beton", "installatielast", "water", "greenlabel", "verplichte-berekeningen", "business-case", "drinkwater-90"],
    evidence: {
      [evidenceKey("co2-budget", 0)]: "done",
      [evidenceKey("co2-budget", 1)]: "done",
      [evidenceKey("co2-budget", 2)]: "busy",
      [evidenceKey("massa-reductie", 0)]: "done",
      [evidenceKey("massa-reductie", 1)]: "busy",
      [evidenceKey("houthybride", 0)]: "busy",
      [evidenceKey("houthybride", 1)]: "todo",
      [evidenceKey("houthybride", 2)]: "busy",
      [evidenceKey("verplichte-berekeningen", 0)]: "done",
      [evidenceKey("verplichte-berekeningen", 1)]: "done",
      [evidenceKey("greenlabel", 0)]: "done",
      [evidenceKey("water", 0)]: "busy",
      [evidenceKey("business-case", 0)]: "busy"
    },
    decisions: [
      {
        id: "d-hk-3",
        measureId: "houthybride",
        measureTitle: "Onderzoek houthybride of biobased constructie",
        phase: "VO",
        outcome: "uitgesteld",
        reason: "Besluit doorgeschoven naar eind VO: brandadvies boven 13 meter en kostenraming houthybride (+45 euro/m2) worden 15 september besproken in het projectteam.",
        date: "2026-08-21"
      },
      {
        id: "d-hk-2",
        measureId: "massa-reductie",
        measureTitle: "Reduceer constructiemassa voor materiaalvervanging",
        phase: "Conceptontwikkeling",
        outcome: "aangenomen",
        reason: "Stramien 7,2 m en compactere gebouwvorm: 11% minder betonvolume in de SO-raming, kostenneutraal.",
        date: "2026-05-27"
      },
      {
        id: "d-hk-1",
        measureId: "transformeren",
        measureTitle: "Onderzoek transformatie of renovatie voor nieuwbouw",
        phase: "Acquisitie",
        outcome: "afgewezen",
        reason: "Bestaande loodsen zijn bouwkundig niet te behouden (asbest, fundering ongeschikt); sloopmateriaal wordt wel via materiaalpaspoort aangeboden voor hergebruik.",
        date: "2026-03-10"
      }
    ],
    variants: [
      { id: "hk-a", name: "A. Betoncasco met breedplaatvloeren", co2: 198, extraCost: 0, risk: 1, weeks: 0, note: "SO-referentie, MPG 0,62" },
      { id: "hk-b", name: "B. Houthybride bovenbouw vanaf 2e verdieping", co2: 141, extraCost: 45, risk: 3, weeks: -3, note: "Brandadvies >13 m en contactgeluid CLT uitwerken" },
      { id: "hk-c", name: "C. Betoncasco geoptimaliseerd + CO2-arm beton", co2: 168, extraCost: 12, risk: 1, weeks: 0, note: "Kanaalplaat i.p.v. breedplaat, MKI-mengsel Betonakkoord koploper" }
    ],
    updatedAt: "2026-08-28T09:12:00.000Z"
  });

  const groeneLoper: ProjectData = createProject({
    id: "demo-groene-loper",
    profile: {
      name: "De Groene Loper Houten",
      location: "Houten, uitbreidingslocatie Oost",
      homes: 42,
      client: "Blauwhoed",
      description:
        "42 grondgebonden eengezinswoningen (rij en twee-onder-een-kap) in een groene setting met een centrale wadi en collectieve moestuin. Verkoop aan particulieren, start verkoop gepland Q2 2027.",
      ambitions:
        "Paris Proof, biobased gevel en isolatie, NL Greenlabel A voor de buitenruimte, 3/30/300 als ontwerpcheck, kopersopties voor waterbesparing.",
      team: [
        { role: "Ontwikkelmanager", name: "Joris Bakker" },
        { role: "Architect", name: "Bureau Erf & Laan" },
        { role: "Constructeur", name: "Constructiebureau Bruggink" },
        { role: "Landschapsarchitect", name: "Landschapsatelier Wadi" }
      ],
      documents: [
        {
          id: "doc-gl-1",
          name: "Stedenbouwkundig plan Houten Oost.pdf",
          size: 8_900_000,
          type: "application/pdf",
          addedAt: "2026-05-05",
          note: "Kavelpaspoort: max. 3 bouwlagen, minimaal 30% onverhard."
        },
        {
          id: "doc-gl-2",
          name: "Ambitiedocument duurzaamheid.txt",
          size: 2_600,
          type: "text/plain",
          addedAt: "2026-07-01",
          text: "Ambitie Groene Loper: houtskeletbouw (HSB) casco met biobased isolatie (houtvezel), natuurinclusief bouwen met nestkasten en groene erfafscheidingen, NL Greenlabel A. Hemelwater infiltreren via wadi; kopersoptie regenwatergebruik toilet. Doel drinkwater 90 liter per persoon per dag. Circa 5.100 m2 BVO."
        }
      ]
    },
    state: {
      phase: "Conceptontwikkeling",
      projectType: "egw",
      co2: 152,
      bvo: 5100,
      dataQuality: "benchmark",
      impactPart: "Skin",
      existingStructure: false,
      tenderMode: false,
      highRise: false,
      waterReady: true,
      contextNotes: "Benchmark uit vergelijkbaar HSB-project; MPG volgt in VO. Focus op gevel, isolatie en gebied.",
      theme: "Alle thema's",
      layer: "Alle lagen",
      status: "all"
    },
    selected: ["co2-budget", "gevelisolatie", "greenlabel", "groenbeleving", "drinkwater-90", "verplichte-berekeningen", "hnn-waardebehoud"],
    evidence: {
      [evidenceKey("co2-budget", 0)]: "done",
      [evidenceKey("greenlabel", 0)]: "busy",
      [evidenceKey("greenlabel", 1)]: "busy",
      [evidenceKey("groenbeleving", 0)]: "done",
      [evidenceKey("gevelisolatie", 0)]: "busy"
    },
    decisions: [
      {
        id: "d-gl-1",
        measureId: "greenlabel",
        measureTitle: "Stuur gebied op NL Greenlabel A of B",
        phase: "Haalbaarheid",
        outcome: "aangenomen",
        reason: "NL Greenlabel A als projectdoel vastgesteld; landschapsarchitect werkt gebiedspaspoort uit voor VO.",
        date: "2026-06-12"
      }
    ],
    variants: [
      { id: "gl-a", name: "A. Kalkzandsteen casco, PIR-isolatie", co2: 152, extraCost: 0, risk: 1, weeks: 0, note: "Benchmark uit referentieproject" },
      { id: "gl-b", name: "B. HSB casco, houtvezelisolatie, houten gevel", co2: 104, extraCost: 30, risk: 2, weeks: -4, note: "Onderhoud houten gevel in kopersinformatie" },
      { id: "gl-c", name: "C. HSB casco, minerale wol, baksteen", co2: 121, extraCost: 18, risk: 1, weeks: -3, note: "Compromis bij welstandseisen baksteen" }
    ],
    updatedAt: "2026-08-25T14:40:00.000Z"
  });

  const pakhuis: ProjectData = createProject({
    id: "demo-pakhuis",
    profile: {
      name: "Pakhuis Noord Rotterdam",
      location: "Rotterdam-Noord, leegstaand kantoorgebouw uit 1978",
      homes: 60,
      client: "Blauwhoed i.s.m. institutionele belegger",
      description:
        "Transformatie van een leegstaand kantoorgebouw (7 lagen, betonskelet) naar 60 appartementen met optopping van twee houten woonlagen. Belegger neemt het complex af voor middenhuur.",
      ambitions:
        "Behoud van casco en fundering, optopping in hout, circulaire gevelrenovatie met hergebruikte baksteen, Paris Proof renovatiebudget.",
      team: [
        { role: "Ontwikkelmanager", name: "Fatima el Idrissi" },
        { role: "Architect", name: "Architectenbureau Slot & Vos" },
        { role: "Constructeur", name: "Ingenieursbureau Veldt" },
        { role: "Duurzaamheidsadviseur", name: "Adviesbureau Delta Duurzaam" }
      ],
      documents: [
        {
          id: "doc-pn-1",
          name: "Bouwkundige opname bestaand gebouw.txt",
          size: 3_900,
          type: "text/plain",
          addedAt: "2026-02-20",
          text: "Bouwkundige opname kantoorgebouw Noord. Betonskelet 1978 in goede staat, kolommen en vloeren herbruikbaar. Fundering op palen, restcapaciteit voldoende voor twee extra lagen in hout (optoppen). Bestaande gevel: metselwerk met spouw, deels asbesthoudende kit. Transformatie naar wonen haalbaar. Huidig 7 lagen, na optopping 9 woonlagen. Circa 7.800 m2 BVO na transformatie."
        },
        {
          id: "doc-pn-2",
          name: "Quickscan CO2 behoud vs nieuwbouw.txt",
          size: 2_200,
          type: "text/plain",
          addedAt: "2026-03-30",
          text: "Quickscan: behoud casco bespaart circa 60% embodied carbon ten opzichte van sloop-nieuwbouw. Indicatie embodied carbon transformatie: 81 kg CO2 per m2 BVO, waarvan optopping hout 22 kg CO2 per m2 BVO en gevelrenovatie 19 kg CO2 per m2 BVO. Paris Proof renovatiebudget 63 kg CO2 per m2 BVO."
        }
      ]
    },
    state: {
      phase: "DO",
      projectType: "renovatie",
      co2: 81,
      bvo: 7800,
      dataQuality: "mpg",
      impactPart: "Skin",
      existingStructure: true,
      tenderMode: false,
      highRise: true,
      waterReady: false,
      contextNotes: "Casco en fundering behouden; optopping in hout; gevelrenovatie grootste resterende post. Asbestsanering in planning.",
      theme: "Alle thema's",
      layer: "Alle lagen",
      status: "all"
    },
    selected: ["transformeren", "hergebruik-gevel", "gevelisolatie", "glas", "binnenwanden", "producten", "beton", "hnn-waardebehoud", "business-case"],
    evidence: {
      [evidenceKey("transformeren", 0)]: "done",
      [evidenceKey("transformeren", 1)]: "done",
      [evidenceKey("transformeren", 2)]: "done",
      [evidenceKey("hergebruik-gevel", 0)]: "done",
      [evidenceKey("hergebruik-gevel", 1)]: "busy",
      [evidenceKey("gevelisolatie", 0)]: "done",
      [evidenceKey("gevelisolatie", 1)]: "busy",
      [evidenceKey("glas", 0)]: "done",
      [evidenceKey("binnenwanden", 0)]: "busy",
      [evidenceKey("business-case", 0)]: "done",
      [evidenceKey("business-case", 1)]: "done",
      [evidenceKey("business-case", 2)]: "done"
    },
    decisions: [
      {
        id: "d-pn-3",
        measureId: "hergebruik-gevel",
        measureTitle: "Pas hergebruikte baksteen of losmaakbare gevelsystemen toe",
        phase: "DO",
        outcome: "aangenomen",
        reason: "Bestaande gevelsteen wordt na sanering gereinigd en hergebruikt in de plint; optopping krijgt losmaakbare houten gevelelementen. Meerkosten 8 euro/m2, gedekt uit lagere sloopkosten.",
        date: "2026-08-14"
      },
      {
        id: "d-pn-2",
        measureId: "houthybride",
        measureTitle: "Onderzoek houthybride of biobased constructie",
        phase: "VO",
        outcome: "aangenomen",
        reason: "Optopping in CLT/HSB: 38% lichter dan beton, past binnen restcapaciteit fundering zonder versterking.",
        date: "2026-05-08"
      },
      {
        id: "d-pn-1",
        measureId: "transformeren",
        measureTitle: "Onderzoek transformatie of renovatie voor nieuwbouw",
        phase: "Haalbaarheid",
        outcome: "aangenomen",
        reason: "Behoud casco bespaart ~60% embodied carbon en 14 maanden bouwtijd t.o.v. sloop-nieuwbouw; directie akkoord 30 maart.",
        date: "2026-03-30"
      }
    ],
    variants: [
      { id: "pn-a", name: "A. Transformatie + houten optopping", co2: 81, extraCost: 0, risk: 2, weeks: 0, note: "Gekozen richting; gevel grootste resterende post" },
      { id: "pn-b", name: "B. Transformatie zonder optopping", co2: 64, extraCost: -110, risk: 1, weeks: -8, note: "18 woningen minder; business case negatief" },
      { id: "pn-c", name: "C. Sloop-nieuwbouw betoncasco", co2: 202, extraCost: 240, risk: 3, weeks: 40, note: "Alleen ter referentie" }
    ],
    updatedAt: "2026-08-29T16:05:00.000Z"
  });

  return { activeId: havenkwartier.id, projects: [havenkwartier, groeneLoper, pakhuis] };
}
