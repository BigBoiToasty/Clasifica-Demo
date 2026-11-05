# Clasifica+

A bilingual (English / Español) recycling app for **Obra Padre Cacho** in Montevideo, Uruguay, made for ENGR110. Workers sign in, pick their profile, and record how collected waste is classified by material and weight.

Clasifica+ is designed as an iOS app. This repo is a web version so anyone can try it in a browser. On a laptop it shows the phone layout in a full-height column; on a phone it fills the screen.

## Try it

Live demo: `https://<your-username>.github.io/<your-repo>/`

## What works

- **Sign in → choose user → dashboard**
- **Classify:** choose an organization and location, set the date and time, then add materials by category with a weight for each. Review, edit, or delete materials, hear a spoken summary, and send.
- Help (ⓘ) for every category and material
- English / Spanish toggle

Coming next: Settings, Collect, History, Evidences, and voice entry.

## Run it locally

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serves dist/ locally
```

## Deploy

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

## Tech

React 19, TypeScript, Vite, and Tailwind CSS 4. It has no backend; data resets when the page reloads.

## Credits

Rebuilt from the team's Figma Make design. Background photo by [Sebastián Velásquez](https://unsplash.com/@haiiku) on Unsplash.
