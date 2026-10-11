# Nagaraju Vadla · Portfolio

Static portfolio whose hero is a scroll-driven experience ring: each role's card hangs from its year on the ring, drops away as you scroll, and the next card slides out of the disc. Built with Vite, React, React Three Fiber and Rapier.

## Run locally

```bash
npm install
npm run dev
```

## Change content

All text, roles, links and projects live in `src/data/profile.ts`.

- **Photo:** put a square-ish image at `public/photo.jpg`, then set ``photoUrl: `${ASSET_BASE}photo.jpg` `` in the profile. It shows as the round avatar above your name.
- **Strap text:** each card's strap prints the experience's `tag.company`, or its `company` when there is no tag.
- **Ring:** every experience becomes a stop on the ring, newest first, with a "Now" mark for the current year. `companyBlurb` sets the short description shown for a role.
- **Colours:** CSS tokens at the top of `src/styles/global.css` and the card palette in `src/config/theme.ts`.
- **Site address:** `SITE_HOST` in `src/data/profile.ts` sets the resume watermark text.

## Resume protection

The PDF is never shipped. The resume renders as HTML with selection, copy, right-click, print and the save shortcut blocked, a tiled watermark, and a blur whenever the window loses focus. This deters casual saving but cannot stop OS screenshots or a phone camera.

## Deploy to GitHub Pages

The site lives at https://vadlachary2002.github.io/chary2002/. This repo pushes through the personal SSH alias `github.com.personal`, so only this repo uses the vadlachary2002 account.

1. In the repo on GitHub, open Settings, then Pages, and set Source to "GitHub Actions" (one time).
2. Every push to `main` builds and deploys through `.github/workflows/deploy.yml`.
3. If the repo is renamed, update `GITHUB_PAGES_BASE` in `vite.config.ts` and `SITE_HOST` in `src/data/profile.ts`.

Locally, the dev server runs at http://localhost:5173/chary2002/.
