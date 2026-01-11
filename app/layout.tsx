import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NOTIFICATION HELL',
  description: 'A chaotic form-filling puzzle game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>{children}</main>
        <div id="overlay-root"></div>
      </body>
    </html>
  )
}

