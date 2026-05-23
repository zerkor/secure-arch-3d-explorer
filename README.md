# SecureArch 3D Explorer

Interactive 3D visualization of a Zero Trust / SOC security architecture.
Built to impress cybersecurity companies, SOC/CERT teams, and technical hiring managers.

---

## Setup

```bash
cd secure-arch-3d-explorer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Requirements
- Node.js ≥ 18
- npm ≥ 9

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero landing with WebGL shader background + glitch text |
| `/explorer` | Interactive 3D Zero Trust architecture graph |
| `/about` | Tech stack, concepts, interview guide |

---

## Architecture Data

All node/edge/attack data lives in one file:

```
src/data/architecture.json
```

Edit this file to add nodes, reroute edges, or modify attack paths — no code changes needed.

### Adding a node

```json
{
  "id": "vpn",
  "label": "VPN Gateway",
  "type": "security",
  "position": [-2, 4, 2],
  "color": "#00ffe0",
  "glowColor": "#00ffe0",
  "shape": "box",
  "size": 0.6,
  "role": "Secure remote access enforcing device posture checks before tunneling.",
  "mitre": ["T1133", "T1078"],
  "status": "secured"
}
```

### Node shapes
- `sphere` — round nodes (Internet, SIEM, EDR, Threat Intel, Cloud)
- `box` — cubic nodes (Firewall, DMZ, Internal) — renders as wireframe unless selected
- `torus` — ring nodes (IdP, Zero Trust Policy Engine)

---

## How to Present This (Interview Guide)

### 1. Opening
_"This is a data-driven 3D visualization of a complete Zero Trust architecture.
Every node comes from a JSON config file — so it's instantly adaptable to a real client topology."_

### 2. Walk the nodes
Click each node. Read the role description aloud. Point out:
- Why the **Internet zone** is red / alert
- How the **IdP** enforces Zero Trust (never trust, always verify)
- Why the **SIEM** is the central sphere — everything feeds it
- How the **Zero Trust Policy Engine** is separate from the IdP

### 3. Simulate the attack
Hit **"Simulate Attack"**. Narrate as it runs:
- _"The attacker scans ports — WAF fires on SQLi, blocks at perimeter"_
- _"Brute force against IdP — blocked by rate limiting + MFA"_
- _"Lateral movement attempt detected by EDR — T1021.002"_
- _"Kill chain terminated at DMZ boundary — internal network secured"_

Reference each **MITRE ATT&CK technique** shown in the terminal log.

### 4. Technical depth signals
Point out:
- The `architecture.json` data contract — shows systems thinking
- Dynamic import with `ssr: false` — shows Next.js/SSR awareness
- `React.memo` + `useMemo` on all 3D node components — shows performance awareness
- Mobile SVG fallback — shows graceful degradation thinking
- GSAP + Framer Motion split — GSAP for time-based, FM for state-driven UI

### 5. Closing
_"I can extend this to any architecture in under an hour — just update the JSON.
The simulation logic and kill-chain mapping are parameterized from the data file."_

---

## Tech Stack

- **Next.js 14** — App Router, server components, dynamic imports
- **TypeScript** — strict mode, full type coverage
- **Tailwind CSS v3** — custom dark design system
- **Three.js** — WebGL shader on hero background
- **@react-three/fiber** — declarative React bindings for Three.js
- **@react-three/drei** — OrbitControls, Stars, Html overlays
- **Framer Motion** — NodeInfoPanel slide, terminal log, kill chain
- **GSAP** — glitch text reveal, entrance animations
- **Sonner** — toast notifications for attack events
- **next/font** — Space Grotesk + JetBrains Mono, zero layout shift

---

## Project Structure

```
src/
├── app/                    Next.js App Router pages
├── components/
│   ├── hero/               Landing page components
│   ├── explorer/           3D scene + all UI panels
│   └── shared/             Navbar
├── data/
│   └── architecture.json   ← Single source of truth
├── hooks/                  useAttackSimulation, useMobile
├── types/                  TypeScript interfaces
└── lib/                    cn() utility
```
# secure-arch-3d-explorer
