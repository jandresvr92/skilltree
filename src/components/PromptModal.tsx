import { useState } from 'react'
import { X, Copy, Check, Sparkles } from 'lucide-react'

interface PromptModalProps {
  open: boolean
  onClose: () => void
}

// Plantilla de prompt que el usuario copia hacia su IA (ver Skill 4 del steering).
const AI_PROMPT = `Actúa como un arquitecto de software y diseñador de rutas de aprendizaje. Genera un árbol de habilidades en formato JSON compatible con React Flow sobre el tema: [ESCRIBE TU TEMA AQUÍ]. Genera entre 4 y 6 nodos lógicos con ramificaciones. El primer nodo (id: 1) debe tener el status 'available', los demás deben ser 'locked'. Cada nodo en su objeto 'data' debe tener: title, status, resources (array de 2 enlaces reales) y evidence (string vacío). Calcula las posiciones {x, y} para que formen un árbol hacia abajo. Devuelve ÚNICAMENTE el JSON puro con la estructura { name, nodes, edges }.`

export function PromptModal({ open, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de título */}
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Sparkles size={20} />
            PROMPT PARA LA IA
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="border-4 border-black bg-white p-1 shadow-[3px_3px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm font-bold">
            Copia este texto, pégalo en ChatGPT / Claude / Gemini y reemplaza el
            tema. Luego pega el JSON que devuelva en la app.
          </p>

          <pre className="max-h-64 overflow-auto whitespace-pre-wrap border-4 border-black bg-[#F4F4F0] p-4 text-sm leading-relaxed">
            {AI_PROMPT}
          </pre>

          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 border-4 border-black bg-green-400 px-4 py-3 text-base font-bold shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {copied ? (
              <>
                <Check size={18} /> ¡COPIADO!
              </>
            ) : (
              <>
                <Copy size={18} /> COPIAR PROMPT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
