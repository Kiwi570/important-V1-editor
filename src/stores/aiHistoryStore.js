import { create } from 'zustand'

// ═══════════════════════════════════════════════════════════════════════════
// AI HISTORY STORE - Gestion de l'historique des actions IA pour rollback
// ═══════════════════════════════════════════════════════════════════════════

const useAIHistoryStore = create((set, get) => ({
  // Stack d'historique des actions IA
  history: [],
  
  // Historique de conversation (messages)
  conversation: [],
  
  // Index actuel dans l'historique (pour redo potentiel)
  currentIndex: -1,

  // ═══════════════════════════════════════════════════════════════════════════
  // CONVERSATION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  addMessage: (role, content, metadata = {}) => {
    set(state => ({
      conversation: [
        ...state.conversation,
        {
          id: `msg-${Date.now()}`,
          role, // 'user' | 'assistant'
          content,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      ].slice(-20) // Garder les 20 derniers messages
    }))
  },

  getConversationContext: (limit = 10) => {
    const { conversation } = get()
    return conversation.slice(-limit)
  },

  clearConversation: () => {
    set({ conversation: [] })
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION HISTORY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  // Enregistrer une action IA avec son état précédent pour rollback
  pushAction: (action) => {
    const { history, currentIndex } = get()
    
    const newAction = {
      id: `action-${Date.now()}`,
      timestamp: new Date().toISOString(),
      batchId: action.batchId || `batch-${Date.now()}`,
      description: action.description || 'Modification IA',
      userPrompt: action.userPrompt || '',
      changes: action.changes || [], // [{path, oldValue, newValue}]
      snapshotBefore: action.snapshotBefore, // État complet avant
      applied: true
    }

    // Couper l'historique si on était en arrière (après des rollbacks)
    const newHistory = [...history.slice(0, currentIndex + 1), newAction]

    set({
      history: newHistory.slice(-50), // Garder les 50 dernières actions
      currentIndex: newHistory.length - 1
    })

    return newAction
  },

  // Obtenir la dernière action
  getLastAction: () => {
    const { history, currentIndex } = get()
    return currentIndex >= 0 ? history[currentIndex] : null
  },

  // Obtenir les N dernières actions
  getRecentActions: (count = 5) => {
    const { history, currentIndex } = get()
    const start = Math.max(0, currentIndex - count + 1)
    return history.slice(start, currentIndex + 1)
  },

  // Rollback de la dernière action
  rollbackLast: () => {
    const { history, currentIndex } = get()
    
    if (currentIndex < 0) return null
    
    const actionToRollback = history[currentIndex]
    
    set({
      currentIndex: currentIndex - 1,
      history: history.map((h, i) => 
        i === currentIndex ? { ...h, applied: false } : h
      )
    })

    return actionToRollback
  },

  // Rollback de N actions
  rollbackMultiple: (count = 1) => {
    const { history, currentIndex } = get()
    const actionsToRollback = []
    
    for (let i = 0; i < count && currentIndex - i >= 0; i++) {
      actionsToRollback.push(history[currentIndex - i])
    }

    const newIndex = Math.max(-1, currentIndex - count)
    
    set({
      currentIndex: newIndex,
      history: history.map((h, i) => 
        i > newIndex ? { ...h, applied: false } : h
      )
    })

    return actionsToRollback
  },

  // Rollback jusqu'à un batchId spécifique
  rollbackToBatch: (batchId) => {
    const { history } = get()
    
    const targetIndex = history.findIndex(h => h.batchId === batchId)
    if (targetIndex === -1) return null

    // Rollback jusqu'à AVANT cette action
    const newIndex = targetIndex - 1

    set({
      currentIndex: newIndex,
      history: history.map((h, i) => 
        i > newIndex ? { ...h, applied: false } : h
      )
    })

    return history.slice(targetIndex)
  },

  // Redo (si on a fait des rollbacks)
  redo: () => {
    const { history, currentIndex } = get()
    
    if (currentIndex >= history.length - 1) return null
    
    const actionToRedo = history[currentIndex + 1]
    
    set({
      currentIndex: currentIndex + 1,
      history: history.map((h, i) => 
        i === currentIndex + 1 ? { ...h, applied: true } : h
      )
    })

    return actionToRedo
  },

  // Vérifier si on peut rollback
  canRollback: () => {
    const { currentIndex } = get()
    return currentIndex >= 0
  },

  // Vérifier si on peut redo
  canRedo: () => {
    const { history, currentIndex } = get()
    return currentIndex < history.length - 1
  },

  // Reset complet
  resetHistory: () => {
    set({
      history: [],
      currentIndex: -1
    })
  },

  // Obtenir le snapshot le plus ancien (état initial)
  getInitialSnapshot: () => {
    const { history } = get()
    return history.length > 0 ? history[0].snapshotBefore : null
  },

  // Obtenir un résumé de l'historique pour l'IA
  getHistorySummary: () => {
    const { history, currentIndex } = get()
    
    return history.slice(0, currentIndex + 1).map(h => ({
      description: h.description,
      userPrompt: h.userPrompt,
      changesCount: h.changes.length,
      timestamp: h.timestamp
    }))
  }
}))

export default useAIHistoryStore
