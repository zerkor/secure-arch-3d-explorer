'use client'
import { Component, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import type Scene3D from './Scene3D'

// ── Error boundary — catches WebGL context failures at runtime ──────────────
class WebGLBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; message: string }
> {
  state = { failed: false, message: '' }

  static getDerivedStateFromError(err: Error) {
    return { failed: true, message: err.message }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center
                        bg-navy gap-6 px-8 text-center">
          <div className="w-16 h-16 rounded-full border border-alert/40 flex items-center
                          justify-center text-2xl">
            ⚠
          </div>
          <div>
            <p className="font-mono text-sm text-alert mb-2 tracking-wider">
              WebGL UNAVAILABLE
            </p>
            <p className="font-mono text-xs text-white/40 max-w-xs leading-relaxed">
              Enable hardware acceleration in your browser settings to view the 3D scene.
            </p>
            {this.state.message && (
              <p className="font-mono text-xs text-white/20 mt-3 break-all">
                {this.state.message}
              </p>
            )}
          </div>
          <button
            onClick={() => this.setState({ failed: false, message: '' })}
            className="px-4 py-2 rounded border border-cyan/30 font-mono text-xs
                       text-cyan hover:bg-cyan/10 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Lazy-loaded 3D scene ─────────────────────────────────────────────────────
const Scene3DLazy = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-t-cyan border-cyan/20 animate-spin" />
        <span className="font-mono text-xs text-cyan/60 tracking-widest">
          INITIALIZING 3D ENGINE…
        </span>
      </div>
    </div>
  ),
})

type Props = ComponentProps<typeof Scene3D>

export default function SceneWrapper(props: Props) {
  return (
    <WebGLBoundary>
      <Scene3DLazy {...props} />
    </WebGLBoundary>
  )
}
