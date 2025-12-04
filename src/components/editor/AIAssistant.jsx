import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Sparkles, Send, Settings, Loader, Bot, User,
  Maximize2, Minimize2, X, Key, Target, MousePointerClick,
  Check, XCircle, RotateCcw, ChevronDown, ChevronUp,
  Zap, Eye, EyeOff, CheckSquare, Square, Undo2, History,
  HelpCircle
} from 'lucide-react'
import { generateWithActions, executeActions, getProactiveSuggestions, THEME_PRESETS } from '../../lib/aiService'
import { humanizePath, humanizeAction, getElementDescription } from '../../lib/pathLabels'
import useAIHistoryStore from '../../stores/aiHistoryStore'
import useUserPreferencesStore from '../../stores/userPreferencesStore'
import OnboardingModal from './OnboardingModal'
import PreviewComparison from './PreviewComparison'

// ═══════════════════════════════════════════════════════════════════════════
// AI ASSISTANT V4 - Sprint 1: Preview, Messages humanisés, Onboarding
// ═══════════════════════════════════════════════════════════════════════════

// Luna personality phrases
const LUNA_GREETINGS = [
  "Salut ! Je suis Luna 🌙 Prête à créer avec toi !",
  "Hey ! Luna à ton service ✨ Qu'est-ce qu'on fait ?",
  "Coucou ! 🌙 On rend ton site incroyable ?",
]

const LUNA_SUCCESS = [
  "Et voilà ! ✨",
  "C'est fait ! 🎉",
  "Parfait ! 💫",
  "Tadaa ! ✨",
]

const LUNA_THINKING = [
  "Je réfléchis... 🤔",
  "Hmm, laisse-moi voir... 💭",
  "Un instant... ✨",
]

const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999
  })
}

// Quick actions
const QUICK_ACTIONS = [
  { emoji: '🌊', label: 'Océan', prompt: 'Applique le thème océan' },
  { emoji: '🌙', label: 'Sombre', prompt: 'Mets le hero en fond sombre avec textes clairs' },
  { emoji: '✨', label: 'Moderne', prompt: 'Refais le hero dans un style moderne et épuré' },
]

export default function AIAssistant({ 
  siteContent, 
  onApplyChanges, 
  onPreview,
  isExpanded, 
  onToggleExpand,
  selectedElement,
  activeSection,
  activeTab
}) {
  // State
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '')
  const [pendingActions, setPendingActions] = useState(null)
  const [selectedActionIndexes, setSelectedActionIndexes] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPreviewComparison, setShowPreviewComparison] = useState(false)
  
  // AI History Store
  const { 
    conversation, 
    addMessage, 
    getConversationContext,
    pushAction,
    getRecentActions,
    rollbackLast,
    canRollback,
    getHistorySummary
  } = useAIHistoryStore()

  // User Preferences Store
  const {
    onboardingCompleted,
    getContextForAI,
    getActivityLabel,
    incrementInteraction,
    lunaGreeted,
    markLunaGreeted
  } = useUserPreferencesStore()
  
  // Refs
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Check if onboarding needed on first expand
  useEffect(() => {
    if (isExpanded && !onboardingCompleted && !showOnboarding) {
      // Petit délai pour ne pas afficher immédiatement
      const timer = setTimeout(() => setShowOnboarding(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, onboardingCompleted])

  // Luna greeting on first interaction after onboarding
  useEffect(() => {
    if (onboardingCompleted && !lunaGreeted && conversation.length === 0) {
      const greeting = LUNA_GREETINGS[Math.floor(Math.random() * LUNA_GREETINGS.length)]
      const activity = getActivityLabel()
      const welcomeMsg = activity 
        ? `${greeting} Je vois que tu es dans le domaine "${activity}" - je vais adapter mes suggestions !`
        : greeting
      addMessage('assistant', welcomeMsg)
      markLunaGreeted()
    }
  }, [onboardingCompleted, lunaGreeted, conversation.length])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Focus input
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('anthropic_api_key', key)
    setShowSettings(false)
  }

  // Suggestions contextuelles
  const suggestions = getProactiveSuggestions(siteContent, selectedElement, activeSection)

  // ═══════════════════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════

  const handleSend = async (customPrompt = null) => {
    const prompt = customPrompt || input.trim()
    if (!prompt || isLoading) return

    if (!apiKey) {
      setShowSettings(true)
      return
    }

    // Add user message
    addMessage('user', prompt)
    setInput('')
    setIsLoading(true)
    setPendingActions(null)
    setShowPreviewComparison(false)
    
    // Increment interaction count
    incrementInteraction()

    try {
      // Get user preferences context
      const userContext = getContextForAI()
      
      // Call AI with enriched context
      const response = await generateWithActions(
        prompt,
        siteContent,
        getConversationContext(10),
        apiKey,
        selectedElement,
        {
          activeSection,
          activeTab,
          aiActionHistory: getRecentActions(5),
          userPreferences: userContext // Nouveau: préférences utilisateur
        }
      )

      // Handle rollback request
      if (response.isRollback) {
        handleRollback(response)
        return
      }

      // Si des actions sont proposées
      if (response.actions?.length > 0) {
        // Si confirmation requise ou >1 action, montrer le preview comparatif
        if (response.requiresConfirmation || response.actions.length > 1) {
          setPendingActions({
            message: response.message,
            actions: response.actions,
            batchId: response.batchId,
            options: response.options
          })
          setSelectedActionIndexes(response.actions.map((_, i) => i)) // Tout sélectionné par défaut
          setShowPreviewComparison(true) // Afficher la preview
          
          addMessage('assistant', response.message, {
            hasPendingActions: true,
            actionsCount: response.actions.length
          })
        } else {
          // Application directe pour une seule action sans confirmation
          applyActions(response.actions, response.message, response.batchId)
        }
      } else {
        // Pas d'actions, juste un message
        addMessage('assistant', response.message, {
          options: response.options
        })
      }

      if (response.celebration) {
        fireConfetti()
      }

    } catch (error) {
      console.error('AI Error:', error)
      addMessage('assistant', `😅 Erreur: ${error.message || 'Réessaie dans quelques secondes.'}`, {
        options: [{ id: '1', label: 'Réessayer', value: prompt, emoji: '🔄' }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // APPLY ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const applyActions = useCallback((actions, message, batchId) => {
    // Sauvegarder l'état avant pour rollback
    const snapshotBefore = JSON.parse(JSON.stringify(siteContent))
    
    // Exécuter les actions
    const { results, updatedContent, changes } = executeActions(actions, siteContent)
    
    // Appliquer les changements
    onApplyChanges(updatedContent)
    
    // Enregistrer dans l'historique IA
    pushAction({
      batchId,
      description: message,
      userPrompt: input,
      changes,
      snapshotBefore
    })
    
    // Message de confirmation humanisé avec personnalité Luna
    const successCount = results.filter(r => r.success).length
    const lunaSuccess = LUNA_SUCCESS[Math.floor(Math.random() * LUNA_SUCCESS.length)]
    
    // Humaniser les labels des résultats
    const humanizedResults = results.map(r => ({
      ...r,
      label: humanizeAction({ type: 'update', label: r.label, path: r.path })
    }))
    
    addMessage('assistant', `${lunaSuccess} ${successCount} modification(s) appliquée(s)`, {
      actions: humanizedResults,
      canRollback: true
    })
    
    setPendingActions(null)
    setShowPreviewComparison(false)
  }, [siteContent, onApplyChanges, pushAction, addMessage, input])

  // ═══════════════════════════════════════════════════════════════════════════
  // APPLY SELECTED ACTIONS (partial)
  // ═══════════════════════════════════════════════════════════════════════════

  const applySelectedActions = useCallback(() => {
    if (!pendingActions) return
    
    const selectedActions = pendingActions.actions.filter((_, i) => selectedActionIndexes.includes(i))
    if (selectedActions.length === 0) {
      addMessage('assistant', '⚠️ Sélectionne au moins une modification à appliquer')
      return
    }
    
    applyActions(selectedActions, pendingActions.message, pendingActions.batchId)
  }, [pendingActions, selectedActionIndexes, applyActions, addMessage])

  // ═══════════════════════════════════════════════════════════════════════════
  // CANCEL PENDING ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const cancelPendingActions = useCallback(() => {
    setPendingActions(null)
    setShowPreviewComparison(false)
    addMessage('assistant', '❌ Pas de souci ! Qu\'est-ce que tu voudrais faire à la place ?', {
      options: [
        { id: '1', label: 'Autre chose', emoji: '✨' },
        { id: '2', label: 'Modifier ma demande', emoji: '✏️' }
      ]
    })
  }, [addMessage])

  // ═══════════════════════════════════════════════════════════════════════════
  // ROLLBACK
  // ═══════════════════════════════════════════════════════════════════════════

  const handleRollback = useCallback((response) => {
    if (!canRollback()) {
      addMessage('assistant', "🤷 Rien à annuler ! Tu n'as pas encore fait de modifications avec l'IA.")
      setIsLoading(false)
      return
    }

    const lastAction = rollbackLast()
    if (lastAction?.snapshotBefore) {
      onApplyChanges(lastAction.snapshotBefore)
      addMessage('assistant', `⏪ J'ai annulé : "${lastAction.description}"\n\nOn est revenu à l'état précédent !`, {
        rolledBack: true
      })
    }
    setIsLoading(false)
  }, [canRollback, rollbackLast, onApplyChanges, addMessage])

  const handleManualRollback = useCallback(() => {
    if (!canRollback()) return
    
    const lastAction = rollbackLast()
    if (lastAction?.snapshotBefore) {
      onApplyChanges(lastAction.snapshotBefore)
      addMessage('assistant', `⏪ Annulé : "${lastAction.description}"`)
    }
  }, [canRollback, rollbackLast, onApplyChanges, addMessage])

  // Toggle action selection
  const toggleActionSelection = (index) => {
    setSelectedActionIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Handle option click - envoie comme prompt ou applique si c'est clairement du texte
  const handleOptionClick = useCallback((option) => {
    // Si l'option a une action intégrée, l'appliquer directement
    if (option.action) {
      applyActions([option.action], option.label, `batch-${Date.now()}`)
      return
    }
    
    // Si l'option a un "value" explicite, c'est une commande à envoyer à l'IA
    if (option.value) {
      handleSend(option.value)
      return
    }
    
    // Si un élément TEXTE est sélectionné et l'option ressemble à du contenu textuel
    // (pas une commande, pas une couleur, pas un thème)
    const isTextualContent = selectedElement && 
      ['title', 'subtitle', 'badge', 'description', 'content', 'logoText', 'quote', 'tagline', 'name'].includes(selectedElement.field) &&
      option.label &&
      option.label.length > 15 && // Assez long pour être du contenu
      !option.label.toLowerCase().match(/^(changer|modifier|ajouter|supprimer|masquer|activer|désactiver)/) &&
      !option.label.toLowerCase().includes('couleur') &&
      !option.label.toLowerCase().includes('thème') &&
      !option.label.toLowerCase().includes('police') &&
      !option.label.toLowerCase().includes('réessayer')

    if (isTextualContent) {
      // C'est du contenu textuel → appliquer directement sur l'élément sélectionné
      const action = {
        type: 'update',
        path: `${selectedElement.section}.${selectedElement.field}`,
        value: option.label,
        label: `${selectedElement.label || selectedElement.field} modifié`
      }
      applyActions([action], `Appliqué: "${option.label.slice(0, 30)}..."`, `batch-${Date.now()}`)
      addMessage('user', `👆 ${option.emoji || ''} ${option.label}`)
    } else {
      // Sinon, envoyer comme prompt à l'IA pour qu'elle décide
      handleSend(option.label)
    }
  }, [selectedElement, applyActions, addMessage, handleSend])

  // Keyboard
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - EXPANDED MODE
  // ═══════════════════════════════════════════════════════════════════════════

  if (isExpanded) {
    // Get humanized element description
    const elementDesc = selectedElement ? getElementDescription(selectedElement) : null
    
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Onboarding Modal */}
        <OnboardingModal 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={() => setShowOnboarding(false)}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
              animate={{ scale: isLoading ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                Luna
                <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">IA</span>
              </h2>
              <p className="text-xs text-slate-400">
                {selectedElement ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {elementDesc?.label || selectedElement.field}
                  </span>
                ) : activeSection ? (
                  <span className="text-blue-400">Section: {activeSection}</span>
                ) : (
                  'Ton assistante créative 🌙'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {canRollback() && (
              <button
                onClick={handleManualRollback}
                className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition"
                title="Annuler dernière action"
              >
                <Undo2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Préférences Luna"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleExpand}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Focus Mode Indicator - Humanisé */}
        {selectedElement && (
          <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">
                Focus: <strong>{elementDesc?.label || selectedElement.field}</strong>
              </span>
              {elementDesc?.preview && (
                <span className="text-xs text-green-400/60 ml-auto truncate max-w-[150px]">
                  {elementDesc.preview}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.length === 0 ? (
            <WelcomeScreen 
              suggestions={suggestions} 
              onSuggestionClick={handleSend}
              selectedElement={selectedElement}
            />
          ) : (
            <>
              {conversation.map((msg, i) => (
                <MessageBubble 
                  key={msg.id || i}
                  message={msg}
                  onOptionClick={handleOptionClick}
                />
              ))}
              
              {/* Preview Comparison - Nouveau composant avec Avant/Après */}
              {pendingActions && showPreviewComparison && (
                <PreviewComparison
                  originalContent={siteContent}
                  actions={pendingActions.actions}
                  selectedIndexes={selectedActionIndexes}
                  onToggleSelection={toggleActionSelection}
                  onApply={applySelectedActions}
                  onCancel={cancelPendingActions}
                />
              )}
              
              {/* Ancien panel (fallback si preview fermée) */}
              {pendingActions && !showPreviewComparison && (
                <PendingActionsPanel
                  pendingActions={pendingActions}
                  selectedIndexes={selectedActionIndexes}
                  onToggleAction={toggleActionSelection}
                  onApply={applySelectedActions}
                  onCancel={cancelPendingActions}
                  onSelectAll={() => setSelectedActionIndexes(pendingActions.actions.map((_, i) => i))}
                  onSelectNone={() => setSelectedActionIndexes([])}
                />
              )}
            </>
          )}
          
          {isLoading && (
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <div className="px-4 py-3 bg-slate-800 rounded-2xl rounded-tl-sm">
                <p className="text-sm text-slate-400">
                  {LUNA_THINKING[Math.floor(Date.now() / 2000) % LUNA_THINKING.length]}
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedElement 
                    ? `Modifier "${elementDesc?.label || selectedElement.field}"...` 
                    : "Ex: Mets un fond sombre sur le hero"
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick suggestions */}
          {suggestions.length > 0 && !pendingActions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                >
                  {s.emoji} {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <SettingsModal 
              apiKey={apiKey} 
              onSave={handleSaveApiKey} 
              onClose={() => setShowSettings(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - COMPACT MODE (Bottom Bar)
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-t border-slate-800">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedElement ? `Modifier "${selectedElement.label}"...` : "Demande à l'IA..."}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 outline-none text-sm"
          disabled={isLoading}
        />
        {isLoading && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-spin" />
        )}
      </div>

      {/* Quick Actions */}
      <div className="hidden lg:flex items-center gap-1">
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSend(action.prompt)}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition disabled:opacity-50"
            title={action.label}
          >
            {action.emoji}
          </button>
        ))}
      </div>

      <button
        onClick={() => handleSend()}
        disabled={isLoading || !input.trim()}
        className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </button>

      <button
        onClick={onToggleExpand}
        className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => setShowSettings(true)}
        className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
      >
        <Settings className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            apiKey={apiKey} 
            onSave={handleSaveApiKey} 
            onClose={() => setShowSettings(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════

function WelcomeScreen({ suggestions, onSuggestionClick, selectedElement }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      
      {selectedElement ? (
        <>
          <h3 className="text-lg font-semibold text-white mb-2">
            Focus sur "{selectedElement.label}"
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Dis-moi ce que tu veux changer !
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-white mb-2">
            Comment puis-je t'aider ?
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Décris ce que tu veux modifier
          </p>
        </>
      )}
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(s.text)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition"
            >
              {s.emoji} {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PENDING ACTIONS PANEL - Preview avant application
// ═══════════════════════════════════════════════════════════════════════════

function PendingActionsPanel({ 
  pendingActions, 
  selectedIndexes, 
  onToggleAction, 
  onApply, 
  onCancel,
  onSelectAll,
  onSelectNone 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-purple-500/10 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-white">
              {pendingActions.actions.length} modification(s) proposée(s)
            </h4>
            <p className="text-xs text-purple-300">
              {selectedIndexes.length} sélectionnée(s)
            </p>
          </div>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-purple-300" />
        ) : (
          <ChevronUp className="w-5 h-5 text-purple-300" />
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* Selection controls */}
            <div className="px-4 py-2 bg-slate-800/50 flex items-center gap-4 text-xs">
              <button
                onClick={onSelectAll}
                className="text-purple-400 hover:text-purple-300"
              >
                Tout sélectionner
              </button>
              <button
                onClick={onSelectNone}
                className="text-slate-400 hover:text-slate-300"
              >
                Tout désélectionner
              </button>
            </div>

            {/* Actions list */}
            <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
              {pendingActions.actions.map((action, index) => {
                const humanLabel = humanizeAction(action)
                const displayValue = typeof action.value === 'object' 
                  ? JSON.stringify(action.value).slice(0, 30) + '...'
                  : action.value?.toString().slice(0, 40)
                
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onToggleAction(index)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    selectedIndexes.includes(index)
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'
                  }`}
                >
                  {selectedIndexes.includes(index) ? (
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {humanLabel}
                    </p>
                    {displayValue && (
                      <p className="text-xs text-slate-400 truncate">
                        → {displayValue}
                      </p>
                    )}
                  </div>
                  
                  {/* Color preview if it's a color */}
                  {action.path?.includes('color') && action.value && (
                    <div 
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: action.value }}
                    />
                  )}
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    action.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                    action.type === 'add_item' ? 'bg-green-500/20 text-green-400' :
                    action.type === 'delete_item' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {action.type}
                  </span>
                </motion.div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="px-4 py-3 bg-slate-800/50 flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
              >
                <XCircle className="w-4 h-4" />
                Annuler
              </button>
              <button
                onClick={onApply}
                disabled={selectedIndexes.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Appliquer ({selectedIndexes.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════════════════

function MessageBubble({ message, onOptionClick }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-slate-700' 
          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
      }`}>
        {isUser ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-purple-600 text-white rounded-tr-sm' 
            : 'bg-slate-800 text-slate-200 rounded-tl-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Actions performed */}
        {message.actions?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.actions.map((action, i) => (
              <span 
                key={i}
                className={`text-xs px-2 py-1 rounded-full ${
                  action.success 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {action.success ? '✓' : '✗'} {action.label}
              </span>
            ))}
          </div>
        )}

        {/* Rollback indicator */}
        {message.canRollback && (
          <p className="text-xs text-orange-400/70 mt-1">
            💡 Dis "annule" pour revenir en arrière
          </p>
        )}

        {/* Options */}
        {message.options?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onOptionClick(opt)}
                className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════

function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Configuration IA</h3>
              <p className="text-xs text-slate-400">Clé API Anthropic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Clé API</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              Obtiens ta clé sur <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">console.anthropic.com</a>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(key)}
              className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
