import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { 
  Sparkles, Send, Settings, Loader, Bot, User,
  Maximize2, Minimize2, X, Key, Target, MousePointerClick,
  Check, XCircle, RotateCcw, ChevronDown, ChevronUp,
  Zap, Eye, EyeOff, CheckSquare, Square, Undo2, History,
  HelpCircle, Lightbulb, Mic
} from 'lucide-react'
import { generateWithActions, executeActions, getProactiveSuggestions, THEME_PRESETS } from '../../lib/aiService'
import { humanizePath, humanizeAction, getElementDescription } from '../../lib/pathLabels'
import { 
  generateLunaMessage, 
  generateBatchMessage, 
  generateGreeting, 
  generateThinkingMessage,
  generateContextualSuggestion,
  generateErrorMessage,
  generateFlowResponse,
  getFlowSuggestions,
  checkMilestone,
  LUNA_MOODS 
} from '../../lib/lunaMessages'
import useAIHistoryStore from '../../stores/aiHistoryStore'
import useUserPreferencesStore from '../../stores/userPreferencesStore'
import OnboardingModal from './OnboardingModal'
import PreviewComparison from './PreviewComparison'

// ═══════════════════════════════════════════════════════════════════════════
// AI ASSISTANT V6 - Premium Design "Apple-like"
// ═══════════════════════════════════════════════════════════════════════════

// Inject CSS animations
const injectStyles = () => {
  if (document.getElementById('luna-premium-styles')) return
  
  const style = document.createElement('style')
  style.id = 'luna-premium-styles'
  style.textContent = `
    /* Gradient animé pour le fond */
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    /* Anneau gradient animé pour avatar */
    @keyframes ringRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Pulse subtil */
    @keyframes subtlePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.02); }
    }
    
    /* Glow pulse */
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
      50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5); }
    }
    
    /* Typing dots */
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
    
    /* Success particles */
    @keyframes particleFade {
      0% { opacity: 1; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(0.5) translateY(-20px); }
    }
    
    /* Gradient border animation */
    @keyframes borderGradient {
      0%, 100% { border-color: rgba(168, 85, 247, 0.5); }
      50% { border-color: rgba(236, 72, 153, 0.5); }
    }
    
    .luna-gradient-bg {
      background: linear-gradient(-45deg, #1e1b4b, #0f172a, #1e1b4b, #0f172a);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
    }
    
    .luna-ring-animated {
      animation: ringRotate 3s linear infinite;
    }
    
    .luna-glow {
      animation: glowPulse 2s ease-in-out infinite;
    }
    
    .luna-typing-dot {
      animation: typingBounce 1.4s ease-in-out infinite;
    }
    
    .luna-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .luna-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    .luna-input-focus {
      transition: all 0.3s ease;
    }
    
    .luna-input-focus:focus-within {
      animation: borderGradient 2s ease infinite;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
    }
    
    .luna-glassmorphism {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    
    .luna-button-glow:hover {
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
      transform: translateY(-1px);
    }
    
    .luna-particle {
      animation: particleFade 0.6s ease-out forwards;
    }
  `
  document.head.appendChild(style)
}

// Fire confetti avec style
const fireConfetti = () => {
  // Main burst
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#a855f7', '#ec4899', '#8b5cf6', '#f472b6'],
    zIndex: 9999
  })
  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 40,
      origin: { x: 0, y: 0.7 },
      colors: ['#a855f7', '#ec4899'],
      zIndex: 9999
    })
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 40,
      origin: { x: 1, y: 0.7 },
      colors: ['#a855f7', '#ec4899'],
      zIndex: 9999
    })
  }, 150)
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
  const [sessionActionCount, setSessionActionCount] = useState(0)
  
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
    markLunaGreeted,
    tone: userTone,
    activityCategory
  } = useUserPreferencesStore()
  
  // Refs
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Inject premium styles on mount
  useEffect(() => {
    injectStyles()
  }, [])

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
      const activity = getActivityLabel()
      const greetingData = generateGreeting({ 
        tone: userTone || 'friendly', 
        activity 
      })
      addMessage('assistant', greetingData.text, { mood: greetingData.mood })
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
    
    // Incrémenter le compteur de session
    const newActionCount = sessionActionCount + actions.length
    setSessionActionCount(newActionCount)
    
    // Enregistrer dans l'historique IA
    pushAction({
      batchId,
      description: message,
      userPrompt: input,
      changes,
      snapshotBefore
    })
    
    // Générer la réponse avec le flow conversationnel
    const activity = getActivityLabel()
    const currentSection = actions[0]?.section || actions[0]?.path?.split('.')[0] || activeSection
    
    const flowResponse = generateFlowResponse(
      actions.length > 1 ? { type: 'batch', actions } : actions[0],
      {
        tone: userTone || 'friendly',
        activity,
        activityCategory,
        actionCount: newActionCount,
        siteContent: updatedContent,
        section: currentSection
      }
    )
    
    // Humaniser les labels des résultats
    const humanizedResults = results.map(r => ({
      ...r,
      label: humanizeAction({ type: 'update', label: r.label, path: r.path })
    }))
    
    // Convertir les flowSuggestions en options cliquables
    const flowOptions = flowResponse.flowSuggestions?.map((s, i) => ({
      id: `flow-${i}`,
      label: s.label,
      value: s.value,
      emoji: s.emoji
    })) || []
    
    addMessage('assistant', flowResponse.text, {
      actions: humanizedResults,
      canRollback: true,
      mood: flowResponse.mood,
      suggestion: flowResponse.suggestion,
      options: flowOptions,
      isClosing: flowResponse.isClosing,
      milestone: flowResponse.milestone
    })
    
    // Célébration si milestone majeur
    if (flowResponse.milestone?.isMajor) {
      fireConfetti()
    }
    
    setPendingActions(null)
    setShowPreviewComparison(false)
  }, [siteContent, onApplyChanges, pushAction, addMessage, input, userTone, activityCategory, getActivityLabel, sessionActionCount, activeSection])

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
      <div className="h-full flex flex-col luna-gradient-bg relative overflow-hidden">
        {/* Glow effect en haut */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Onboarding Modal */}
        <OnboardingModal 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={() => setShowOnboarding(false)}
        />
        
        {/* Header - Glassmorphism */}
        <div className="relative z-10 luna-glassmorphism border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Avatar Luna Premium avec anneau animé */}
              <div className="relative">
                {/* Anneau gradient animé */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 luna-ring-animated opacity-75 blur-sm" />
                <motion.div 
                  className="relative w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
                  animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                {/* Status indicator */}
                <motion.div 
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
                  animate={{ 
                    backgroundColor: isLoading ? ['#a855f7', '#ec4899', '#a855f7'] : '#22c55e'
                  }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                />
              </div>
              <div>
                <h2 className="font-semibold text-white flex items-center gap-2">
                  Luna
                  <motion.span 
                    className="text-[10px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/20"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    IA
                  </motion.span>
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedElement ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {elementDesc?.label || selectedElement.field}
                    </span>
                  ) : activeSection ? (
                    <span className="text-purple-300/80">Section: {activeSection}</span>
                  ) : (
                    <span className="text-slate-500">Ton assistante créative</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {canRollback() && (
                <motion.button
                  onClick={handleManualRollback}
                  className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl transition-all"
                  title="Annuler dernière action"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Undo2 className="w-5 h-5" />
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowOnboarding(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Préférences Luna"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={onToggleExpand}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Minimize2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Focus Mode Indicator - Premium */}
        <AnimatePresence>
          {selectedElement && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MousePointerClick className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <span className="text-sm text-emerald-300">
                  Focus: <strong>{elementDesc?.label || selectedElement.field}</strong>
                </span>
                {elementDesc?.preview && (
                  <span className="text-xs text-emerald-400/50 ml-auto truncate max-w-[150px]">
                    {elementDesc.preview}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages - Zone principale */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
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
                  index={i}
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
          
          {/* Loading - Typing Indicator Premium */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                {/* Avatar avec pulse */}
                <div className="relative">
                  <motion.div 
                    className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-400 rounded-full border-2 border-slate-900"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
                {/* Typing bubble */}
                <div className="px-5 py-3.5 bg-gradient-to-br from-slate-800/90 to-slate-800/70 rounded-2xl rounded-tl-md shadow-lg border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <motion.span 
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span 
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span 
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Premium Design */}
        <div className="relative z-10 p-4 luna-glassmorphism border-t border-white/5">
          <div className="flex items-center gap-2">
            {/* Input wrapper avec effet gradient */}
            <div className="flex-1 relative luna-input-focus rounded-xl group">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedElement 
                    ? `Modifier "${elementDesc?.label || selectedElement.field}"...` 
                    : "Dis-moi ce que tu veux changer..."
                }
                className="relative w-full px-4 py-3.5 pr-12 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none transition-all"
                disabled={isLoading}
              />
              {/* Mic icon (decorative) */}
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
                type="button"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            {/* Send button premium */}
            <motion.button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="relative p-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 luna-button-glow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Quick suggestions - Premium */}
          {suggestions.length > 0 && !pendingActions && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-3"
            >
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-white rounded-xl text-xs transition-all border border-white/5 hover:border-purple-500/30 disabled:opacity-50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {s.emoji} {s.text}
                </motion.button>
              ))}
            </motion.div>
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
  // RENDER - COMPACT MODE (Bottom Bar) - Premium Design
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex items-center gap-2 px-4 py-3 luna-glassmorphism border-t border-white/5">
      {/* Avatar Luna Mini */}
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-sm" />
        <motion.div 
          className="relative w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Input Premium */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedElement ? `Modifier "${selectedElement.label}"...` : "Demande à Luna..."}
          className="w-full px-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none text-sm transition-all"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <motion.span 
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
            />
            <motion.span 
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        )}
      </div>

      {/* Quick Actions Premium */}
      <div className="hidden lg:flex items-center gap-1">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={i}
            onClick={() => handleSend(action.prompt)}
            disabled={isLoading}
            className="px-3 py-2 bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-white rounded-xl text-xs transition-all border border-white/5 hover:border-purple-500/30 disabled:opacity-50"
            title={action.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {action.emoji}
          </motion.button>
        ))}
      </div>

      {/* Send Button Premium */}
      <motion.button
        onClick={() => handleSend()}
        disabled={isLoading || !input.trim()}
        className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-purple-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="w-4 h-4" />
      </motion.button>

      {/* Expand Button */}
      <motion.button
        onClick={onToggleExpand}
        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Maximize2 className="w-4 h-4" />
      </motion.button>

      {/* Settings Button */}
      <motion.button
        onClick={() => setShowSettings(true)}
        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-4 h-4" />
      </motion.button>

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
// WELCOME SCREEN - Premium Design
// ═══════════════════════════════════════════════════════════════════════════

function WelcomeScreen({ suggestions, onSuggestionClick, selectedElement }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8 px-4"
    >
      {/* Avatar Luna Premium avec halo */}
      <div className="relative mx-auto mb-6 w-20 h-20">
        {/* Halo animé */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur-xl opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Avatar principal */}
        <motion.div 
          className="relative w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        {/* Status dot */}
        <motion.div 
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      {selectedElement ? (
        <>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-semibold text-white mb-2"
          >
            Focus : {selectedElement.label}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm mb-6"
          >
            Dis-moi ce que tu veux modifier ✨
          </motion.p>
        </>
      ) : (
        <>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-semibold text-white mb-2"
          >
            Hey ! Je suis Luna 👋
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm mb-6"
          >
            Ton assistante créative. Décris ce que tu veux changer !
          </motion.p>
        </>
      )}
      
      {suggestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => onSuggestionClick(s.text)}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-white rounded-xl text-sm transition-colors border border-white/5 hover:border-purple-500/30 shadow-sm"
            >
              {s.emoji} {s.text}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
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
// MESSAGE BUBBLE - Premium Design
// ═══════════════════════════════════════════════════════════════════════════

function MessageBubble({ message, onOptionClick, index = 0 }) {
  const isUser = message.role === 'user'
  const mood = message.mood

  // Animation variants
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      x: isUser ? 20 : -20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    }
  }

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar Premium */}
      <div className="relative flex-shrink-0">
        {/* Anneau gradient pour Luna */}
        {!isUser && (
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-60 blur-[2px] luna-ring-animated" />
        )}
        <motion.div 
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${
            isUser 
              ? 'bg-slate-700/80 border border-white/10' 
              : 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isUser ? (
            <User className="w-4 h-4 text-slate-300" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
        </motion.div>
        {/* Mood emoji avec bounce */}
        {!isUser && mood && (
          <motion.div 
            initial={{ scale: 0, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
            className="absolute -bottom-1.5 -right-1.5 text-sm drop-shadow-lg"
          >
            {mood.emoji}
          </motion.div>
        )}
      </div>

      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        {/* Milestone badge - Premium */}
        {message.milestone?.isMajor && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full shadow-lg shadow-amber-500/10"
          >
            <motion.span 
              className="text-amber-400"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              🏆
            </motion.span>
            <span className="text-xs font-medium text-amber-200">
              {message.milestone.type === 'site_ready' ? 'Site prêt !' : 
               message.milestone.type === 'ten_actions' ? '10 modifications !' :
               message.milestone.type === 'five_actions' ? '5 modifications !' : 
               'Bravo !'}
            </span>
          </motion.div>
        )}
        
        {/* Message Bubble - Premium */}
        <motion.div 
          className={`inline-block px-4 py-3 rounded-2xl shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-md shadow-purple-500/20' 
              : message.isClosing 
                ? 'bg-gradient-to-br from-slate-800/95 to-slate-700/90 text-slate-200 rounded-tl-md border border-white/5 shadow-slate-900/50'
                : 'bg-gradient-to-br from-slate-800/90 to-slate-800/70 text-slate-200 rounded-tl-md border border-white/5 shadow-slate-900/50'
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </motion.div>

        {/* Actions performed - Premium Tags */}
        {message.actions?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex flex-wrap gap-1.5"
          >
            {message.actions.map((action, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  action.success 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/20'
                }`}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, type: 'spring' }}
                >
                  {action.success ? '✓' : '✗'}
                </motion.span>
                {action.label}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Suggestion Luna - Premium */}
        {message.suggestion && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2.5 flex items-start gap-2 text-xs text-purple-300/90 bg-purple-500/10 px-3 py-2.5 rounded-xl border border-purple-500/10"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-400" />
            </motion.div>
            <span>{message.suggestion}</span>
          </motion.div>
        )}

        {/* Rollback indicator */}
        {message.canRollback && !message.suggestion && !message.options?.length && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-amber-400/60 mt-2"
          >
            💡 Dis "annule" pour revenir en arrière
          </motion.p>
        )}

        {/* Options / Flow suggestions - Premium avec Stagger */}
        {message.options?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {message.options.map((opt, i) => (
              <motion.button
                key={opt.id}
                onClick={() => onOptionClick(opt)}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, type: 'spring', damping: 20 }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="text-xs px-3.5 py-2 bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-white rounded-xl transition-colors border border-white/5 hover:border-purple-500/30 shadow-sm"
              >
                {opt.emoji} {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL - Premium Design
// ═══════════════════════════════════════════════════════════════════════════

function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="luna-glassmorphism border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-40" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white">Configuration</h3>
              <p className="text-xs text-slate-400">Clé API Anthropic</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Clé API</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3.5 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">
              Obtiens ta clé sur{' '}
              <a 
                href="https://console.anthropic.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                console.anthropic.com
              </a>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all border border-white/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annuler
            </motion.button>
            <motion.button
              onClick={() => onSave(key)}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sauvegarder
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
