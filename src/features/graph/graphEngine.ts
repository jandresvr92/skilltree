import type { SkillEdge, SkillNode, SkillStatus } from '../../core/types'

// ---------------------------------------------------------------------------
// Motor del grafo: lógica pura de recorrido y desbloqueo de nodos.
// Sin dependencias de Zustand ni de React.
// ---------------------------------------------------------------------------

/**
 * Recalcula los estados de los nodos con desbloqueo ESTRICTO.
 *
 * Un nodo no-completed pasa a 'available' si no tiene padres o si TODOS sus
 * padres están 'completed'; de lo contrario queda 'locked'.
 * Los nodos ya 'completed' se mantienen intactos.
 *
 * Función pura: recibe `nodes` y `edges` y retorna un nuevo arreglo de nodos
 * sin mutar las entradas.
 */
export function recomputeStatuses(
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
