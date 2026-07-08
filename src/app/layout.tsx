import type { Metadata, Viewport } from 'next'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURUM & NOIR — The Eclipse',
  description:
    'The Eclipse. The first chronograph by AURUM & NOIR. Edition of 88, crafted in Genève.',
}

export const viewport: Viewport = {
  themeColor: '#050506',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain vignette bg-noir-900 font-sans">
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-display:'Playfair Display';--font-sans:'Inter';}`,
          }}
        />
        {children}
      </body>
    </html>
  )
}
