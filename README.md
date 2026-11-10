# O‘zbekistonga maktub

An interactive editorial love letter to Uzbekistan. Four-column 1991–2026 opening, original Uzbek copy, engraved landscape, scroll-controlled poem and food still life, creators, city tabs, reversible photographic postcards, gallery filtering, lightbox, project panel and photo credits.

## Run locally

Node.js 20+ is sufficient; no dependencies or install step are required.

```sh
npm run dev
```

Open http://localhost:3000. Both `/` and `/gallery/` work directly. `npm test` checks JavaScript syntax.

## Deploy from this repository to Vercel

- Framework preset: **Other**
- Build command: leave empty
- Output directory: **.**
- Install command: leave empty

The app is plain HTML/CSS/JavaScript. `vercel.json` supplies the gallery rewrites. All photos, fonts and graphics are included locally, so the deployed app does not rely on a temporary preview server. External links are only for attribution and further reading.

## GitHub repository

Intended repository: https://github.com/jasur-ai/brag

The agent created a local Git commit but could not authenticate a push in this session. No claim is made that the repository has been updated. Upload the contents of this folder to that repository or push from your authenticated local machine:

```sh
git init -b main
git add .
git commit -m "Build Uzbekistan interactive editorial website"
git remote add origin https://github.com/jasur-ai/brag.git
git push -u origin main
```

If the repository already contains commits, clone it first and copy these files into the clone; do not force-push.

## Project structure

- `index.html` — semantic content, dialogs, route views
- `style.css` — responsive layouts, paper system and motion
- `app.js` — routing, interactions and original procedural landscape
- `assets/` — 15 photographs, local fonts, original SVG graphics and image credits
- `server.cjs` — dependency-free development server
- `vercel.json` — static routing and security headers

## Accessibility and performance

Native dialogs, Escape and arrow-key support, keyboard city tabs, reduced-motion mode, skip link, alt text, image lazy loading, no third-party runtime scripts, system clipboard fallback and mobile layouts. All animations are written in vanilla JavaScript/CSS.

## Credits and limitations

Visual inspiration: [The Message to Ukraine by Obys](https://themessagetoukraine.obys.agency/). This is an independent reinterpretation, not an Obys project. The reference site's source code, Ukrainian copy and original photography were not reused. Uzbek copy and procedural/SVG graphics were created for this adaptation.

Photos: Pexels and Unsplash; individual source links are in `assets/credits.json` and the on-site credits dialog. Font families: Manrope and Cormorant Garamond (SIL Open Font License). Photograph usage remains subject to each source platform's license.

City descriptions are editorial; the site makes no current population-statistics claims. The city list is a selection, not an exhaustive geographic registry. This is not an official government or tourism website.

The title dates are 1991–2026. Change the dates deliberately when adapting the editorial concept; this is not an automatic age counter.

## Deployment status from this session

The `brags` Vercel project was created, but no production deployment was published. Vercel's API requires `projectSettings` on the first deployment; the connected deployment tool does not expose that parameter. The GitHub push was also blocked by missing GitHub authentication in the session.

You can publish this exact source from your own authenticated terminal:

```sh
npx vercel login
npx vercel --prod
```

Select your account/team and the existing `brags` project. Choose Other, no build command, and output directory `.`. Alternatively, upload the source to your GitHub repository and connect it through the Vercel dashboard.
