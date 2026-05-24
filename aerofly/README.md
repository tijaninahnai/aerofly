# AeroFly ✈️

Premium travel booking interface — Flights · Hotels · Experiences

## Structure

```
aerofly/
├── index.html              ← Landing hub (links to all pages)
├── css/
│   ├── global.css          ← Tokens, header, search, popups, booking modal, cinematic
│   ├── flights.css         ← Flight cards, timeline, seat map, globe
│   └── hotels.css          ← Hotel cards, detail modal, skyscraper tabs, map
├── js/
│   ├── global.js           ← Nav, date picker, travelers, skyscraper builder, autofill
│   ├── flights.js          ← Flights data, filter, booking modal, seat select, cinematic
│   └── hotels.js           ← Hotels data, filter, detail modal, booking form, flip cinematic
└── pages/
    ├── flights.html        ← Flights search + booking
    └── hotels.html         ← Hotel search + detail + booking
```

## Stack

Pure HTML/CSS/JS — no build step, no frameworks.
FA icons via CDN. Google Fonts via CDN.

## Local dev

Just open `index.html` in a browser, or run:
```bash
npx serve .
```
