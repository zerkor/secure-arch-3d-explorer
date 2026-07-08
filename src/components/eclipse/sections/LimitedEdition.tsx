export default function LimitedEdition() {
  return (
    <section className="min-h-screen bg-noir-950 flex items-center justify-center py-24 px-8">
      <div className="text-center">
        <p className="font-sans text-xs uppercase tracking-widest3 text-bone-faint mb-6">
          Scarcity
        </p>
        <h2 className="font-display text-7xl sm:text-8xl font-light tracking-widest2 text-gold-400 mb-8">
          Edition
          <br />
          of 88
        </h2>
        <div className="rule-gold w-32 mx-auto my-12" />
        <p className="font-sans text-sm text-bone-dim max-w-xl mx-auto leading-relaxed mb-8">
          Eighty-eight pieces, individually numbered and registered.
          Each accompanied by a chronometer certificate and a collector's archival box in ebonized oak.
        </p>
        <p className="font-display text-4xl text-bone tracking-wide">CHF 48,000</p>
      </div>
    </section>
  )
}
