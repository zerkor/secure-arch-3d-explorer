import ExplorerPage from '@/components/explorer/ExplorerPage'
import data from '@/data/architecture.json'
import type { ArchitectureData } from '@/types/architecture'

export const metadata = {
  title: 'SecureArch — 3D Architecture Explorer',
  description: 'Interactive Zero Trust network graph — click nodes, simulate attacks',
}

export default function ExplorerRoute() {
  return <ExplorerPage data={data as ArchitectureData} />
}
