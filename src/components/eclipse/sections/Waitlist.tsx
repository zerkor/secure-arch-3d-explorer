'use client'

import { useState } from 'react'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setTimeout(() => {
        setEmail('')
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <section className="min-h-screen bg-noir-900 flex items-center justify-center py-24 px-8">
      <div className="w-full max-w-lg">
        <h2 className="font-display text-5xl font-light tracking-widest2 text-bone text-center mb-4">
          Private Waitlist
        </h2>
        <p className="font-sans text-sm text-bone-faint text-center mb-12 tracking-wide">
          Join the list. We'll send you an invitation when your timepiece is ready.
        </p>

        {submitted ? (
          <div className="text-center py-12">
            <p className="font-sans text-bone tracking-wide">
              Thank you. You'll hear from us soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-noir"
            />
            <button
              type="submit"
              className="w-full py-3 font-sans text-sm uppercase tracking-widest2 border border-bone text-bone transition-all duration-500 hover:bg-bone hover:text-noir-950"
            >
              Request Invitation
            </button>
          </form>
        )}

        <p className="font-sans text-xs text-bone-faint text-center mt-12">
          Available exclusively through AURUM & NOIR's private network.
          <br />
          Inquiries: reservations@aurumnoir.ch
        </p>
      </div>
    </section>
  )
}
