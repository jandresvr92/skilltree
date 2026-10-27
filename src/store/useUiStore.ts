import { create } from 'zustand'
import type { View } from '../core/types'

// ---------------------------------------------------------------------------
// Store de UI: estado visual EFÍMERO de la aplicación.
// NO se persiste (sin middleware persist): al recargar vuelve a sus defaults.
//   - view:           vista actual ('home' | 'map')
//   - selectedNodeId: nodo sobre el que se hizo clic (abre el SidePanel)
//   - promptOpen:     estado del modal de prompt para la IA
//   - feedback:       alerta/retroalimentación temporal para el usuario
// ---------------------------------------------------------------------------

export interface Feedback {
  type: 'error' | 'success'
  message: string
}

interface UiState {
  view: View
  selectedNodeId: string | null
  promptOpen: boolean
  feedback: Feedback | null

  setView: (view: View) => void
  selectNode: (nodeId: string | null) => void
  setPromptOpen: (open: boolean) => void
  setFeedback: (feedback: Feedback | null) => void
}

export const useUiStore = create<UiState>()((set) => ({
  view: 'home',
  selectedNodeId: null,
  promptOpen: false,
  feedback: null,

  setView: (view) => set({ view }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  setPromptOpen: (promptOpen) => set({ promptOpen }),
  setFeedback: (feedback) => set({ feedback }),
}))
