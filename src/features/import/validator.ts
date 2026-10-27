import type {
  ImportedTree,
  NormalizedTree,
  SkillEdge,
  SkillNode,
} from '../../core/types'

// ---------------------------------------------------------------------------
// Validador / normalizador del JSON importado hacia el modelo interno.
// Función pura: recibe el árbol crudo y retorna los datos estructurados
// o lanza un Error con un mensaje legible para el usuario.
// ---------------------------------------------------------------------------

export function normalizeImported(tree: ImportedTree): NormalizedTree {
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

/**
 * Parsea una cadena JSON cruda y la normaliza al modelo interno.
 * Lanza un Error con mensaje legible si el texto no es JSON válido
 * o si la estructura es inválida.
 */
export function parseAndNormalize(jsonString: string): NormalizedTree {
  const parsed = JSON.parse(jsonString) as ImportedTree
  return normalizeImported(parsed)
}
