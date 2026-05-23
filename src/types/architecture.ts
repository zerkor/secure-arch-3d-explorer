export type NodeType =
  | 'threat' | 'security' | 'zone' | 'identity'
  | 'soc' | 'endpoint' | 'network' | 'intel' | 'policy' | 'cloud'

export type NodeStatus = 'secured' | 'monitoring' | 'alert'
export type NodeShape  = 'sphere' | 'box' | 'torus'
export type ThreatLevel = 'low' | 'medium' | 'high'
export type LogLevel    = 'ALERT' | 'BLOCK' | 'INFO'

export interface ArchNode {
  id:        string
  label:     string
  type:      NodeType
  position:  [number, number, number]
  color:     string
  glowColor: string
  shape:     NodeShape
  size:      number
  role:      string
  mitre:     string[]
  status:    NodeStatus
}

export interface ArchEdge {
  id:          string
  from:        string
  to:          string
  animated:    boolean
  threatLevel: ThreatLevel
  color:       string
}

export interface AttackLog {
  time:    string
  level:   LogLevel
  message: string
}

export interface ArchitectureData {
  nodes:      ArchNode[]
  edges:      ArchEdge[]
  attackPath: string[]
  attackLogs: AttackLog[]
}
