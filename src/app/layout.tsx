import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import Navbar from '@/components/shared/Navbar'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SecureArch 3D Explorer',
  description: 'Interactive 3D visualization of a Zero Trust / SOC security architecture',
  keywords: ['Zero Trust', 'SOC', 'SIEM', 'Cybersecurity', '3D', 'Architecture'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="crt bg-navy min-h-screen font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a2540',
              border: '1px solid #00ffe040',
              color: '#f5f5f5',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
