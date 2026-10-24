import { useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type NodeTypes,
  type DefaultEdgeOptions,
  type Node,
} from '@xyflow/react'
import { ArrowLeft, Sprout } from 'lucide-react'
import { useTreeStore, type SkillNode as SkillNodeType } from '../store/useTreeStore'
import { SkillNode } from './SkillNode'
import { SidePanel } from './SidePanel'

const nodeTypes: NodeTypes = { skill: SkillNode }

// Edges Neo-Brutalistas: ortogonales (step), negras y gruesas.
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'step',
  style: { stroke: '#000000', strokeWidth: 4 },
}

export function MapBoard() {
  const planName = useTreeStore((s) => s.planName)
  const nodes = useTreeStore((s) => s.nodes)
  const edges = useTreeStore((s) => s.edges)
  const setView = useTreeStore((s) => s.setView)

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Nodo seleccionado SIEMPRE fresco del store para reflejar cambios de status.
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const handleNodeClick = (_: unknown, node: Node) => {
    const status = (node as SkillNodeType).data.status
    if (status === 'locked') return
    setSelectedNodeId(node.id)
  }

  return (
    <div className="relative h-screen w-full bg-[#F4F4F0] font-mono">
      {/* Overlay superior: nombre del plan + volver */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-6">
        <button
          onClick={() => setView('home')}
          className="pointer-events-auto flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-bold shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <ArrowLeft size={18} />
          NUEVO ÁRBOL
        </button>

        <div className="pointer-events-auto flex items-center gap-2 border-4 border-black bg-yellow-400 px-4 py-2 text-sm font-bold shadow-[6px_6px_0px_0px_#000]">
          <Sprout size={18} />
          {planName}
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#000000" />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <SidePanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      )}
    </div>
  )
}
