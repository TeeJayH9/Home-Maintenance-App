# Home Upkeep: Home Maintenance Tracker

A phone-first home maintenance tracker that installs to your home screen as a PWA.
There are no accounts and no server. Everything stays on your device in IndexedDB.

## Build status

| Stage | What | Status |
|---|---|---|
| 1 | Data model, Home Profile, Equipment, Appliance Info | ✅ Done |
| 2 | Parts & sizes cheat sheet | ⏳ |
| 3 | Schedule engine, seasonal checklists, dashboard | ⏳ |
| 4 | Maintenance log & history | ⏳ |
| 5 | Photo timeline (watch items) | ⏳ |
| 6 | JSON backup, CSV/PDF export, polish | ⏳ |

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev          # http://localhost:5173 with hot reload
```

To check the production build (this includes the service worker and offline support):

```bash
npm run build
npm run preview      # http://localhost:4173
```

### Try it on your iPhone before deploying

```bash
npm run dev -- --host
```

Then open the `Network:` URL it prints (e.g. `http://192.168.1.20:5173`) in Safari
on a phone on the same Wi-Fi. Your data works over plain HTTP. The offline service
worker and "Add to Home Screen" as a real app need HTTPS, so use the deployed site for those.

## Deploy for free

### Option A: GitHub Pages (set up already)

`.github/workflows/deploy.yml` builds the app and publishes it on every push to `main`.

1. On GitHub, open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
2. Merge to `main`, or run the workflow by hand from the **Actions** tab ("Deploy to GitHub Pages" → *Run workflow*).
3. Your app is at `https://<your-username>.github.io/Home-Maintenance-App/`.

The build uses relative paths and hash routes (`#/equipment`), so it works under
the repo sub-path with no extra settings.

### Option B: Netlify

1. Sign in at [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → pick this repo.
2. Build command `npm run build`, publish directory `dist`.
3. Deploy. You get a free `*.netlify.app` HTTPS URL.

## Install it on your iPhone

1. Open the deployed URL in **Safari**. Other browsers on iOS can't install PWAs.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Open it from the new icon. It runs full-screen and works offline.

**Keep using the home-screen icon.** iOS can clear data for websites you haven't
visited in Safari for a few weeks. Home-screen apps are exempt, and the app also
asks the browser for persistent storage. Even so, export a JSON backup now and then
(stage 6). Data does **not** sync between Safari and the installed app, or between devices.

## Updates

The service worker updates on its own. After a new deploy, close the app fully and
reopen it, and you'll be on the new version.

## Tech notes

- Vite + React, plain CSS with light and dark themes (Auto/Light/Dark under **More**).
- [Dexie](https://dexie.org) on IndexedDB. The schema is in `src/db.js`. All stores
  are defined up front so later stages don't need migrations.
- Photos are resized to 1600px max and saved as JPEG (about 75% quality) before
  storing. A typical iPhone photo shrinks from ~3–5 MB to ~150–300 KB.
- `vite-plugin-pwa` (Workbox) handles the manifest and offline caching.

```
src/
  db.js               IndexedDB schema + profile defaults
  lib/                dates, photos (compression), router, theme, equipment ops
  components/         Page shell, TabBar, form fields, photo picker/viewer
  pages/              Dashboard, Equipment list/detail/edit, Profile, Appliance info, More
```
