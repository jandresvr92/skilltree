import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Edge, Node } from '@xyflow/react'

// ---------------------------------------------------------------------------
// Modelo de datos (ver SPEC.md - Sección 2)
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
interface ImportedTree {
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

export type View = 'home' | 'map'

interface TreeState {
  view: View
  planName: string
  nodes: SkillNode[]
  edges: SkillEdge[]
  setView: (view: View) => void
  importTree: (jsonString: string) => { ok: true } | { ok: false; error: string }
  completeNode: (nodeId: string, evidence: string) => void
  resetTree: () => void
}

// ---------------------------------------------------------------------------
// Árbol de prueba inicial para que la app no arranque vacía.
// ---------------------------------------------------------------------------

const DEFAULT_TREE: Pick<TreeState, 'planName' | 'nodes' | 'edges'> = {
  planName: 'Bases de Datos Node.js',
  nodes: [
    {
      id: '1',
      position: { x: 250, y: 0 },
      type: 'skill',
      data: {
        title: 'Intro SQL',
        status: 'completed',
        resources: ['https://youtube.com/sql'],
        evidence: 'Mis primeros apuntes',
      },
    },
    {
      id: '2',
      position: { x: 100, y: 150 },
      type: 'skill',
      data: {
        title: 'PostgreSQL',
        status: 'available',
        resources: ['https://postgresql.org'],
        evidence: '',
      },
    },
    {
      id: '3',
      position: { x: 400, y: 150 },
      type: 'skill',
      data: {
        title: 'ORM (Prisma)',
        status: 'locked',
        resources: ['https://prisma.io'],
        evidence: '',
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: false },
  ],
}

// ---------------------------------------------------------------------------
// Normalización del JSON importado hacia el modelo interno.
// ---------------------------------------------------------------------------

function normalizeImported(tree: ImportedTree): {
  planName: string
  nodes: SkillNode[]
  edges: SkillEdge[]
} {
  if (!Array.isArray(tree.nodes) || tree.nodes.length === 0) {
    throw new Error('El JSON debe incluir un arreglo "nodes" con al menos un nodo.')
  }

  const nodes: SkillNode[] = tree.nodes.map((n) => {
    if (!n.id || !n.position || !n.data) {
      throw new Error('Cada nodo necesita "id", "position" y "data".')
    }
    return {
      id: String(n.id),
      position: {
        x: Number(n.position.x) || 0,
        y: Number(n.position.y) || 0,
      },
      type: 'skill',
      data: {
        title: n.data.title ?? 'Sin título',
        status: n.data.status ?? 'locked',
        resources: Array.isArray(n.data.resources) ? n.data.resources : [],
        evidence: n.data.evidence ?? '',
      },
    }
  })

  const edges: SkillEdge[] = Array.isArray(tree.edges)
    ? tree.edges.map((e, i) => ({
        id: e.id ?? `e${e.source}-${e.target}-${i}`,
        source: String(e.source),
        target: String(e.target),
        animated: Boolean(e.animated),
      }))
    : []

  return {
    planName: tree.name?.trim() || 'Mi Ruta de Aprendizaje',
    nodes,
    edges,
  }
}

// ---------------------------------------------------------------------------
// Recalculo de estados con desbloqueo ESTRICTO.
// Un nodo no-completed pasa a 'available' si no tiene padres o si TODOS sus
// padres están 'completed'; de lo contrario queda 'locked'.
// Los nodos ya 'completed' se mantienen intactos.
// ---------------------------------------------------------------------------

function recomputeStatuses(
  nodes: SkillNode[],
  edges: SkillEdge[],
): SkillNode[] {
  // Mapa de padres: target -> lista de sources (dependencias).
  const parents = new Map<string, string[]>()
  for (const edge of edges) {
    const list = parents.get(edge.target) ?? []
    list.push(edge.source)
    parents.set(edge.target, list)
  }

  const completedIds = new Set(
    nodes.filter((n) => n.data.status === 'completed').map((n) => n.id),
  )

  return nodes.map((node) => {
    if (node.data.status === 'completed') return node

    const nodeParents = parents.get(node.id) ?? []
    const allParentsCompleted =
      nodeParents.length === 0 ||
      nodeParents.every((parentId) => completedIds.has(parentId))

    const nextStatus: SkillStatus = allParentsCompleted ? 'available' : 'locked'

    if (node.data.status === nextStatus) return node
    return { ...node, data: { ...node.data, status: nextStatus } }
  })
}

// ---------------------------------------------------------------------------
// Store con persistencia en LocalStorage.
// ---------------------------------------------------------------------------

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      view: 'home',
      ...DEFAULT_TREE,

      setView: (view) => set({ view }),

      importTree: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString) as ImportedTree
          const normalized = normalizeImported(parsed)
          set({ ...normalized, view: 'map' })
          return { ok: true }
        } catch (err) {
          const message =
            err instanceof SyntaxError
              ? 'El texto no es un JSON válido. Revisa que lo hayas pegado completo.'
              : err instanceof Error
                ? err.message
                : 'No se pudo importar el árbol.'
          return { ok: false, error: message }
        }
      },

      completeNode: (nodeId, evidence) => {
        const { nodes, edges } = get()

        // 1. Guardar evidencia y marcar el nodo como completado.
        const withCompleted = nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, evidence, status: 'completed' as const },
              }
            : node,
        )

        // 2. Recalcular el resto con desbloqueo estricto.
        set({ nodes: recomputeStatuses(withCompleted, edges) })
      },

      resetTree: () => set({ ...DEFAULT_TREE, view: 'home' }),
    }),
    {
      name: 'skilltree-storage',
      partialize: (state) => ({
        view: state.view,
        planName: state.planName,
        nodes: state.nodes,
        edges: state.edges,
      }),
    },
  ),
)
