import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Lock, Zap, CheckCircle2 } from 'lucide-react'
import type { SkillNode as SkillNodeType } from '../store/useTreeStore'

// ---------------------------------------------------------------------------
// Custom Node Neo-Brutalista. Lee data.status y aplica la gamificación visual.
//   locked    -> gris, candado, no clickeable
//   available -> amarillo pulsante, efecto botón físico
//   completed -> verde
// ---------------------------------------------------------------------------

const BASE =
  'relative flex w-48 items-center gap-3 border-4 border-black px-4 py-3 font-mono font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all'

const STATUS_STYLES: Record<string, string> = {
  locked: 'bg-gray-400 opacity-90 cursor-not-allowed',
  available:
    'bg-yellow-400 animate-pulse cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none',
  completed:
    'bg-green-400 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none',
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'locked') return <Lock size={18} strokeWidth={2.5} />
  if (status === 'completed') return <CheckCircle2 size={18} strokeWidth={2.5} />
  return <Zap size={18} strokeWidth={2.5} />
}

export function SkillNode({ data }: NodeProps<SkillNodeType>) {
  const status = data.status

  return (
    <div className={`${BASE} ${STATUS_STYLES[status] ?? STATUS_STYLES.locked}`}>
      {/* Punto de entrada (desde los padres) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-black !bg-white"
      />

      <span className="flex h-7 w-7 shrink-0 items-center justify-center border-4 border-black bg-white">
        <StatusIcon status={status} />
      </span>

      <span className="text-sm leading-tight">{data.title}</span>

      {/* Punto de salida (hacia los hijos) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-black !bg-white"
      />
    </div>
  )
}
