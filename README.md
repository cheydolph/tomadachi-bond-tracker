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
| 6 | Exes | Dark Gray | ✖ |

Each level also uses a distinct background pattern (dots, stars, hearts, etc.) for colorblind accessibility.

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

1. Extend `BondLevel` to include `7`
2. Add an entry to `BOND_CONFIG` with `label`, `abbr`, `symbol`, `bgClass`, `textClass`, `borderClass`, `hex`, `textHex`, and `pattern`
3. Add `.bond-cell-6` to `globals.css` with a background color and optional pattern
4. Add the Tailwind classes used in the new entry to the `safelist` in `tailwind.config.js`

`ALL_BOND_LEVELS`, `cycleBond`, `validateAndSanitizeBondData`, and every component that renders bond levels all derive from `BOND_CONFIG` and `ALL_BOND_LEVELS` — no other files need editing.

---


## Running locally

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `npm install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Deploy to Cloudflare Workers

This project uses the Cloudflare Vite plugin (configured in `vite.config.ts`) and `wrangler.jsonc`:

1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Deploy: `npx wrangler deploy`

For production env vars, run `wrangler secret put MY_VAR` for each secret listed in `.env.example`. Public (non-secret) vars go in `wrangler.jsonc` under `vars`.

KV, D1, R2, and Durable Object bindings are configured in `wrangler.jsonc` — see https://developers.cloudflare.com/workers/wrangler/configuration/.

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

---