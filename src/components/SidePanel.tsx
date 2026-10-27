import { useState } from 'react'
import { X, BookOpen, NotebookPen, Save, ExternalLink } from 'lucide-react'
import { useTreeStore } from '../store/useTreeStore'
import { useUiStore } from '../store/useUiStore'

// ---------------------------------------------------------------------------
// Ventana flotante maciza sobre el mapa. Componente autónomo: se suscribe al
// useUiStore para saber qué nodo está seleccionado y lee sus datos del
// useTreeStore. Dos secciones:
//   📚 Material de Apoyo (resources, solo lectura)
//   📝 Mi Bitácora (textarea + guardar si 'available'; evidencia si 'completed')
// ---------------------------------------------------------------------------

export function SidePanel() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId)

  // Si no hay nodo seleccionado, el panel no se muestra. Montamos el contenido
  // con una `key` por ID para que el borrador local se reinicie por nodo.
  if (!selectedNodeId) return null

  return <SidePanelContent key={selectedNodeId} />
}

// Contenido real del panel. Se monta con una `key` por nodo, de modo que el
// borrador local (`draft`) se reinicia limpio al cambiar de nodo.
function SidePanelContent() {
  const selectedNodeId = useUiStore((s) => s.selectedNodeId)
  const selectNode = useUiStore((s) => s.selectNode)
  const completeNode = useTreeStore((s) => s.completeNode)

  // Nodo SIEMPRE fresco del store para reflejar cambios de status.
  const node = useTreeStore((s) =>
    selectedNodeId ? s.nodes.find((n) => n.id === selectedNodeId) ?? null : null,
  )

  const [draft, setDraft] = useState(node?.data.evidence ?? '')

  if (!node) return null

  const { title, status, resources, evidence } = node.data
  const onClose = () => selectNode(null)

  const handleSave = () => {
    completeNode(node.id, draft)
    onClose()
  }

  return (
    <div className="absolute right-6 top-6 z-40 w-[22rem] max-w-[calc(100vw-3rem)] border-[6px] border-black bg-white font-mono shadow-[12px_12px_0px_0px_#000]">
      {/* Barra de título */}
      <div className="flex items-center justify-between border-b-[6px] border-black bg-yellow-400 px-4 py-3">
        <h2 className="truncate pr-2 text-lg font-bold">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="shrink-0 border-4 border-black bg-white p-1 shadow-[3px_3px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-[70vh] space-y-5 overflow-auto p-5">
        {/* --- Material de Apoyo --- */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <BookOpen size={18} /> 📚 Material de Apoyo
          </h3>
          {resources.length === 0 ? (
            <p className="border-4 border-black bg-[#F4F4F0] p-3 text-xs font-bold">
              No hay recursos para este nodo.
            </p>
          ) : (
            <ul className="space-y-2">
              {resources.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 border-4 border-black bg-[#F4F4F0] p-2 text-xs font-bold underline decoration-2 underline-offset-2 transition-all hover:bg-white"
                  >
                    <ExternalLink size={14} className="shrink-0" />
                    <span className="truncate">{url}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* --- Mi Bitácora --- */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <NotebookPen size={18} /> 📝 Mi Bitácora
          </h3>

          {status === 'available' ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck={false}
                placeholder="Escribe aquí tu evidencia / apuntes para iluminar este nodo..."
                className="h-32 w-full resize-none border-4 border-black bg-[#F4F4F0] p-3 text-sm outline-none focus:bg-white"
              />
              <button
                onClick={handleSave}
                disabled={!draft.trim()}
                className="mt-3 flex w-full items-center justify-center gap-2 border-4 border-black bg-orange-500 px-4 py-3 text-base font-bold text-black shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} /> GUARDAR PROGRESO
              </button>
            </>
          ) : (
            <div className="border-4 border-black bg-green-400 p-3 text-sm font-bold">
              {evidence?.trim() ? (
                <p className="whitespace-pre-wrap">{evidence}</p>
              ) : (
                <p className="italic">Nodo completado (sin bitácora registrada).</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
