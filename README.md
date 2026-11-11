# O‘zbekistonga maktub

An interactive editorial love letter to Uzbekistan. Four-sheet 1991–2026 entrance animation that clears to a clean title hero, original Uzbek copy, engraved landscape, scroll-controlled poem and food still life, creators, city tabs, reversible photographic postcards, gallery filtering, lightbox, project panel and photo credits.

## Run locally

Node.js 20+ is sufficient; no dependencies or install step are required.

```sh
npm run dev
```

Open http://localhost:3000. The home page, `/gallery/` and the research-backed ecology deposit-return case and interactive illustrative bottle journey at `/ekologiya/` work directly. `npm test` checks JavaScript syntax.

## Deploy from this repository to Vercel

- Framework preset: **Other**
- Build command: leave empty
- Output directory: **.**
- Install command: leave empty

The app is plain HTML/CSS/JavaScript. `vercel.json` supplies the gallery and ecology rewrites. All photos, fonts and graphics are included locally, so the deployed app does not rely on a temporary preview server. External links are only for attribution and further reading.

## GitHub repository

Source repository: https://github.com/jasur-ai/brag

The working branch for this session is `arena/3fdaad18-brag`. Review changes before merging or deploying. The included `push-to-github.sh` is a legacy archive helper; it targets the repository's default branch and is not used by this session.

## Project structure

- `index.html` — semantic content, dialogs, route views
- `style.css` — responsive layouts, paper system and motion
- `app.js` — routing, interactions and scroll motion
- `entrance.css`, `entrance.js` — four-sheet introductory animation, skippable on interaction
- `assets/` — 15 photographs, local fonts, original SVG graphics and image credits
- `server.cjs` — dependency-free development server
- `vercel.json` — static routing and security headers

## Accessibility and performance

Native dialogs, Escape and arrow-key support, keyboard city tabs, reduced-motion mode, skip link, alt text, image lazy loading, no third-party runtime scripts, system clipboard fallback and mobile layouts. All animations are written in vanilla JavaScript/CSS.

## Credits and limitations

Visual inspiration: [The Message to Ukraine by Obys](https://themessagetoukraine.obys.agency/). The ecology story also draws on motion and layout principles surveyed in [Eleken’s design examples](https://www.eleken.co/blog-posts/best-website-design-examples). This is an independent reinterpretation, not an Obys project. The reference site's source code, Ukrainian copy and original photography were not reused. Uzbek copy and SVG graphics and the AI-assisted mountain engraving, river illustration, and mahalla engraving were created for this adaptation.

Photos: Pexels and Unsplash; individual source links are in `assets/credits.json` and the on-site credits dialog. Font families: Manrope and Cormorant Garamond (SIL Open Font License). Photograph usage remains subject to each source platform's license.

City descriptions are editorial; the site makes no current population-statistics claims. The city list is a selection, not an exhaustive geographic registry. This is not an official government or tourism website.

The title dates are 1991–2026. Change the dates deliberately when adapting the editorial concept; this is not an automatic age counter.

## Deployment

The Vercel project `brags` is connected to the repository. Deploy the desired commit using Vercel; local changes are not automatically published until pushed and deployed.

## Uzbek orthography

The visible Uzbek copy, accessibility labels, dynamically generated gallery, city and journey copy, and SVG lettering use the revised alphabet: Ö, Ğ, Ş and Ç. The 2026 law takes effect on 22 April 2027; the site adopts it early at the owner's request. Proper names of external sources, URLs, file paths and technical identifiers are preserved. See [Dunyo information agency](https://dunyo.info/kommentarii/v-uzbekskom-alfavite-poyavyatsya-bukvy-i).
