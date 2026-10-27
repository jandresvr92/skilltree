import type { Edge, Node } from '@xyflow/react'

// ---------------------------------------------------------------------------
// Tipos de dominio globales (ver SPEC.md - Sección 2)
// ---------------------------------------------------------------------------

export type SkillStatus = 'locked' | 'available' | 'completed'

export interface SkillNodeData {
  title: string
  status: SkillStatus
  resources: string[]
  evidence: string
  // Firma de índice requerida por @xyflow/react v12 para el tipo de `data`.
  [key: string]: unknown
}

export type SkillNode = Node<SkillNodeData>
export type SkillEdge = Edge

// Estructura del JSON que genera la IA e importa el usuario.
export interface ImportedTree {
  name?: string
  nodes?: Array<{
    id: string
    position: { x: number; y: number }
    data: {
      title: string
      status?: SkillStatus
      resources?: string[]
      evidence?: string
    }
  }>
  edges?: Array<{
    id?: string
    source: string
    target: string
    animated?: boolean
  }>
}

// Resultado estructurado tras normalizar un árbol importado.
export interface NormalizedTree {
  planName: string
  nodes: SkillNode[]
  edges: SkillEdge[]
}

export type View = 'home' | 'map'
