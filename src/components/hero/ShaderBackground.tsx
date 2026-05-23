'use client'

// CSS-only animated grid — identical look to the WebGL version,
// zero WebGL dependency, zero browser compatibility issues.
export default function ShaderBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-navy">
      {/* Scrolling cyan grid */}
      <div
        className="absolute inset-0 cyber-grid-anim"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(0,255,224,0.07) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(0,255,224,0.07) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '40px 40px',
        }}
      />
      {/* Finer sub-grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(0,255,224,0.03) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(0,255,224,0.03) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '8px 8px',
        }}
      />
      {/* Purple radial centre glow — pulsing */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(119,97,255,0.13) 0%, transparent 70%)',
        }}
      />
      {/* Cyan centre spot */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 35% 35% at 50% 50%, rgba(0,255,224,0.05) 0%, transparent 60%)',
        }}
      />
      {/* Vignette — keeps edges dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(10,15,30,0.85) 100%)',
        }}
      />
    </div>
  )
}
