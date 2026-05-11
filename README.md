# Tomadachi Bond Tracker

A fan-made relationship matrix tool for Tomodachi Life: Living the Dream. Track bonds between your Miis in a fully interactive grid / ordered list — no account, no server, no database. Everything lives in your local browser!

> **Not affiliated with Nintendo.**

Live: [tomadachi-bond-tracker.netlify.app](https://tomadachi-bond-tracker.netlify.app)

---

## What it does

- Add up to **70 Miis** by name
- Track the bond level between every pair in a **color-coded matrix** or **filterable list**
- Click a cell to cycle through levels; long-press (desktop) or tap the badge (mobile) to pick a specific level
- All bonds are **symmetric** — changing a relationship for one Mii updates it for the other as well!
- **Filter** the matrix by bond type to focus on a specific relationship tier
- **Export** your data as JSON and **import** it back later — the file includes a `version` field for forward-compatibility
- Fully responsive: desktop shows the matrix + sidebar; mobile switches to a card-based view with person and ALL modes

### Bonds

| Level | Name | Color | Symbol |
| ------- | ------ | ------- | -------- |
| 0 | Strangers | Gray | ○ |
| 1 | Acquaintances | Emerald | ◎ |
| 2 | Friends | Yellow | ★ |
| 3 | Sweethearts | Pink | ♥ |
| 4 | Family | Orange | ⌂ |
| 5 | One-Sided Love | Purple | → |

Each level also uses a distinct background pattern (dots, stars, hearts, etc.) for colorblind accessibility.

---

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS v3**
- **Netlify** via `@netlify/plugin-nextjs`
- No backend, no auth, no external data — `localStorage` only

---

## Running locally

```bash
npm install
npm run build
npm run lint
npm run dev
```

Open [localhost:3000](http://localhost:3000). The build requires Node 18+.

## Deploying to Netlify

The repo is built to be ready to connect to Netlify as-is. `netlify.toml` handles everything:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Steps:**

1. Push to GitHub
2. Connect the repo in Netlify (New site → Import from Git)
3. Netlify runs `npm install` then `npm run build` automatically

---

## Data format

All data is stored under the key `tomadachi-data` in `localStorage`. The shape:

```json
{
  "version": 1,
  "names": ["John", "Paul", "George"],
  "bonds": {
    "John": { "Paul": 2, "George": 0 },
    "Paul":   { "John": 2, "George": 1 },
    "George": { "John": 0, "Paul": 1 }
  }
}
```

Bond values are always integers 0–5. Bonds are always symmetric — `bonds[A][B]` always equals `bonds[B][A]`. On load, the app runs a migration pass that detects and corrects any asymmetric pairs from older exports (resolves by taking the higher of the two values).

Exports are pretty-printed JSON. Imports are validated and sanitized before touching state — invalid files are rejected with an error message.

---

## Adding a new bond

Everything derives from `lib/types.ts`. To add another Bond type:

1. Extend `BondLevel` to include `6`
2. Add an entry to `BOND_CONFIG` with `label`, `abbr`, `symbol`, `bgClass`, `textClass`, `borderClass`, `hex`, `textHex`, and `pattern`
3. Add `.bond-cell-6` to `globals.css` with a background color and optional pattern
4. Add the Tailwind classes used in the new entry to the `safelist` in `tailwind.config.js`

`ALL_BOND_LEVELS`, `cycleBond`, `validateAndSanitizeBondData`, and every component that renders bond levels all derive from `BOND_CONFIG` and `ALL_BOND_LEVELS` — no other files need editing.

---
