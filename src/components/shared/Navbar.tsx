'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Cpu, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',         label: 'Home',     icon: Shield },
  { href: '/explorer', label: 'Explorer', icon: Cpu    },
  { href: '/about',    label: 'About',    icon: Info   },
]

export default function Navbar() {
  const path = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6
                    bg-navy/80 backdrop-blur-md border-b border-cyan/10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-8 group">
        <span className="w-7 h-7 rounded border border-cyan/60 flex items-center justify-center
                         group-hover:border-cyan transition-colors">
          <Shield size={14} className="text-cyan" />
        </span>
        <span className="font-mono text-sm text-cyan hidden sm:block tracking-wider">
          SecureArch
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all',
              path === href
                ? 'text-cyan bg-cyan/10 border border-cyan/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            )}
          >
            <Icon size={12} />
            {label}
          </Link>
        ))}
      </div>

      {/* Right: live indicator */}
      <div className="ml-auto flex items-center gap-2 font-mono text-xs text-white/40">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
        <span className="hidden sm:block">SYSTEM LIVE</span>
      </div>
    </nav>
  )
}
