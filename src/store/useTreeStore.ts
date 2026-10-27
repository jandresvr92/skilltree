import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ImportedTree, SkillEdge, SkillNode, View } from '../core/types'
import { recomputeStatuses } from '../features/graph/graphEngine'
import { normalizeImported } from '../features/import/validator'

// Re-exportamos los tipos de dominio para mantener compatibilidad con los
// imports existentes (p. ej. `import type { SkillNodeData } from '...store...'`).
export type {
  SkillStatus,
  SkillNodeData,
  SkillNode,
  SkillEdge,
  View,
} from '../core/types'

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
// Store con persistencia en LocalStorage.
// El store solo orquesta y persiste estado: la lógica pura vive en
// `src/features/graph/graphEngine.ts` y `src/features/import/validator.ts`.
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

        // 2. Recalcular el resto con desbloqueo estricto (función pura).
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
