import { useState } from 'react'
import { TreePine, Wand2, Sprout } from 'lucide-react'
import { useTreeStore } from './store/useTreeStore'
import { useUiStore } from './store/useUiStore'
import { PromptModal } from './components/PromptModal'
import { MapBoard } from './components/MapBoard'
import { SidePanel } from './components/SidePanel'

function App() {
  // Datos de dominio
  const importTree = useTreeStore((s) => s.importTree)
  const planName = useTreeStore((s) => s.planName)
  const nodeCount = useTreeStore((s) => s.nodes.length)

  // Estado de UI (efímero, sin persistencia)
  const view = useUiStore((s) => s.view)
  const setView = useUiStore((s) => s.setView)
  const feedback = useUiStore((s) => s.feedback)
  const setFeedback = useUiStore((s) => s.setFeedback)
  const setPromptOpen = useUiStore((s) => s.setPromptOpen)

  // Estado local del input controlado (efímero de este componente).
  const [rawJson, setRawJson] = useState('')

  const handleGenerate = () => {
    if (!rawJson.trim()) {
      setFeedback({ type: 'error', message: 'Pega primero el JSON de la IA.' })
      return
    }
    const result = importTree(rawJson)
    if (result.ok) {
      setFeedback(null)
      setView('map')
    } else {
      setFeedback({ type: 'error', message: result.error })
    }
  }

  // Vista del mapa: MapBoard y SidePanel son hermanos. El contenedor ocupa
  // toda la pantalla; el panel flota sobre el mapa (posición absolute).
  if (view === 'map') {
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <MapBoard />
        <SidePanel />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] font-mono text-black">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <header className="border-b-4 border-black bg-yellow-400">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="border-4 border-black bg-white p-2 shadow-[4px_4px_0px_0px_#000]">
              <TreePine size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SkillTree</h1>
              <p className="text-xs font-bold uppercase tracking-widest">
                Mapas de habilidades gamificados
              </p>
            </div>
          </div>

          <button
            onClick={() => setPromptOpen(true)}
            className="flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-bold shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Wand2 size={18} />
            VER PROMPT IA
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Pantalla de inicio: importador de JSON */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Instrucciones */}
          <section className="md:col-span-2">
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
              <h2 className="mb-4 text-xl font-bold">¿Cómo empezar?</h2>
              <ol className="space-y-4 text-sm font-bold">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-4 border-black bg-yellow-400">
                    1
                  </span>
                  <span>
                    Abre el{' '}
                    <button
                      onClick={() => setPromptOpen(true)}
                      className="underline decoration-4 underline-offset-2"
                    >
                      Prompt para la IA
                    </button>{' '}
                    y pégalo en tu chat favorito.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-4 border-black bg-yellow-400">
                    2
                  </span>
                  <span>Reemplaza el tema y copia el JSON que devuelva.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-4 border-black bg-yellow-400">
                    3
                  </span>
                  <span>
                    Pégalo aquí al lado y pulsa <strong>Generar Árbol</strong>.
                  </span>
                </li>
              </ol>

              <div className="mt-6 flex items-center gap-2 border-4 border-black bg-green-400 p-3 text-xs font-bold">
                <Sprout size={16} />
                Plan actual: "{planName}" ({nodeCount} nodos)
              </div>

              {nodeCount > 0 && (
                <button
                  onClick={() => setView('map')}
                  className="mt-3 w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  VER MAPA ACTUAL →
                </button>
              )}
            </div>
          </section>

          {/* Importador */}
          <section className="md:col-span-3">
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
              <label
                htmlFor="json-input"
                className="mb-2 block text-sm font-bold uppercase tracking-wide"
              >
                Pega el JSON de la IA
              </label>
              <textarea
                id="json-input"
                value={rawJson}
                onChange={(e) => {
                  setRawJson(e.target.value)
                  setFeedback(null)
                }}
                spellCheck={false}
                placeholder='{ "name": "...", "nodes": [...], "edges": [...] }'
                className="h-56 w-full resize-none border-4 border-black bg-[#F4F4F0] p-3 font-mono text-sm outline-none focus:bg-white"
              />

              {feedback && (
                <div
                  className={`mt-3 border-4 border-black p-3 text-sm font-bold ${
                    feedback.type === 'error' ? 'bg-red-400' : 'bg-green-400'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="mt-4 w-full border-4 border-black bg-yellow-400 px-4 py-4 text-lg font-bold shadow-[6px_6px_0px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                ⚡ GENERAR ÁRBOL
              </button>
            </div>
          </section>
        </div>
      </main>

      <PromptModal />
    </div>
  )
}

export default App
