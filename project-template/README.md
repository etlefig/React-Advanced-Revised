## AI Disclosure

Voor dit project heb ik gebruikgemaakt van AI (ChatGPT / OpenAI) als ondersteunend hulpmiddel tijdens het ontwikkelen van de applicatie.

### Hoe en waar ik AI heb gebruikt

Ik heb AI ingezet bij:

- Het responsive maken van componenten (Navigation, EventsPage en EventPage).
- Het verbeteren en structureren van Chakra UI layouts.
- Het implementeren van toaster-notificaties (Chakra v3).
- Het oplossen van bugs, met name rondom categorie-validatie en formulierverwerking.
- Het refactoren van bestaande code (bijvoorbeeld van inline styles naar Chakra componenten).

### Waarom ik AI heb gebruikt

Ik heb AI gebruikt als ondersteuning om:

- Sneller bugs te kunnen oplossen.
- Mijn code-structuur te verbeteren.
- Requirements te vertalen naar concrete implementaties.
- Mijn aanpak te controleren en waar nodig te verbeteren.

### Welke code is beïnvloed

De volgende bestanden bevatten (deels) AI-ondersteunde code:

- `src/components/Root.jsx`
- `src/pages/EventsPage.jsx`
- `src/pages/EventPage.jsx`
- De integratie van `toaster.create(...)`

Concreet gaat het onder andere om:

- Responsive layout props zoals `direction={{ base: "column", md: "row" }}`
- De implementatie van toaster-notificaties
- Validatielogica voor categorie-selectie
- Het herschrijven en structureren van componenten

Alle AI-suggesties heb ik zelf beoordeeld, getest en waar nodig aangepast voordat ik ze heb toegepast in mijn project.