# ClarityFlow

Ein ruhiges Organisations- und Klarheitssystem für Teams.

> „Operative Arbeit sollte erst starten, wenn organisatorische Klarheit existiert."

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Dann im Browser: `http://localhost:5173/clarityflow/`

## Build

```bash
npm run build
```

## Deployment auf GitHub Pages

```bash
npm run deploy
```

## Technologie

- React 18
- Vite 5
- Tailwind CSS 3

## Projektstruktur

```
src/
  components/
    Sidebar.jsx        – Navigation + User
    RequestList.jsx    – Liste aller Requests
    RequestDetail.jsx  – Detailansicht einer Request
    DecisionModal.jsx  – Modal zum Dokumentieren von Entscheidungen
  data/
    requests.js        – Mockdaten
  App.jsx              – Hauptlayout
  main.jsx             – Entry point
  index.css            – Globale Stile
```
