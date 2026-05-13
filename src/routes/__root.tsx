import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

const SITE_URL =
  import.meta.env['VITE_SITE_URL'] ??
  'https://tomadachi-bond-tracker.netlify.app'

const OG_TITLE = 'Tomadachi Bond Tracker'
const OG_DESCRIPTION =
  'Track the bonds between your Tomodachi Life Miis with a fully responsive visual bond matrix!'
const OG_IMAGE = `${SITE_URL}/tdbt_card.png`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: OG_TITLE },
      { name: 'description', content: OG_DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: OG_TITLE },
      { property: 'og:description', content: OG_DESCRIPTION },
      { property: 'og:image', content: OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: OG_TITLE },
      { name: 'twitter:description', content: OG_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous' as const,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning prevents false hydration errors caused by
    // browser extensions injecting classes onto <html> after server render
    // (e.g. password managers, dark-mode extensions, a11y tools).
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 page-bg">
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold text-gray-700 font-fredoka">
        Page not found
      </h1>
      <p className="text-sm text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn-primary">
        ← Back to Bond Tracker
      </Link>
    </div>
  )
}
