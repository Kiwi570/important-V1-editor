import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useSitesStore } from '../stores/sitesStore'
import { useToast } from '../components/ui/Toast'
import Sidebar from '../components/editor/Sidebar'
import SectionEditor from '../components/editor/SectionEditor'
import SectionDesignEditor from '../components/editor/SectionDesignEditor'
import GlobalThemeDrawer from '../components/editor/GlobalThemeDrawer'
import LivePreview from '../components/editor/LivePreview'
import AIAssistant from '../components/editor/AIAssistant'
import QuickEditPanel from '../components/editor/QuickEditPanel'
import { 
  ArrowLeft, Save, Eye, Undo2, Redo2, Check, Loader, Cloud, CloudOff, Rocket,
  PanelLeftClose, PanelLeft, Monitor, Smartphone, Tablet, X, ExternalLink,
  Palette, Sparkles, MousePointerClick, Zap
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// EDITOR CONTEXT - Shared state for all editor components
// ═══════════════════════════════════════════════════════════════════════════

export const EditorContext = createContext(null)

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditorContext must be used within Editor')
  return context
}

// Confetti animation
const fireConfetti = () => {
  const count = 200
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 }
  function fire(particleRatio, opts) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
  }
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

// ═══════════════════════════════════════════════════════════════════════════
// SAVE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

function SaveIndicator({ isSaving, hasUnsavedChanges, lastSaved }) {
  const [showSuccess, setShowSuccess] = useState(false)
  const prevSaving = useRef(isSaving)

  useEffect(() => {
    if (prevSaving.current && !isSaving && !hasUnsavedChanges) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
    prevSaving.current = isSaving
  }, [isSaving, hasUnsavedChanges])

  const formatLastSaved = () => {
    if (!lastSaved) return ''
    const now = new Date()
    const diff = Math.floor((now - lastSaved) / 1000)
    if (diff < 5) return "à l'instant"
    if (diff < 60) return `il y a ${diff}s`
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`
    return lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div 
      className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full"
      animate={{
        backgroundColor: isSaving ? 'rgba(59, 130, 246, 0.1)' : 
                        hasUnsavedChanges ? 'rgba(234, 179, 8, 0.1)' : 
                        showSuccess ? 'rgba(34, 197, 94, 0.2)' :
                        'rgba(34, 197, 94, 0.1)',
        scale: showSuccess ? [1, 1.05, 1] : 1
      }}
    >
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Loader className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-blue-400">Sauvegarde...</span>
          </motion.div>
        ) : hasUnsavedChanges ? (
          <motion.div key="unsaved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <CloudOff className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">Non sauvegardé</span>
          </motion.div>
        ) : showSuccess ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">Sauvegardé !</span>
          </motion.div>
        ) : (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">Sauvegardé {formatLastSaved()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLISH SUCCESS MODAL
// ═══════════════════════════════════════════════════════════════════════════

function PublishSuccessModal({ onClose, siteName, siteSlug }) {
  useEffect(() => {
    fireConfetti()
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Publication réussie ! 🎉</h3>
        <p className="text-green-100 mb-6">{siteName} est maintenant en ligne.</p>
        <div className="flex gap-3 justify-center">
          <Link to={`/site/${siteSlug}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition">
            <ExternalLink className="w-4 h-4" />Voir le site
          </Link>
          <button onClick={onClose} className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-400 transition">Continuer</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLISH MODAL
// ═══════════════════════════════════════════════════════════════════════════

function PublishModal({ onClose, onConfirm, isSaving }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Publier le site</h3>
            <p className="text-sm text-gray-400">Rendre visible au public</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-6">Votre site sera accessible à tous. Vous pouvez toujours le modifier après.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition">Annuler</button>
          <button onClick={onConfirm} disabled={isSaving} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-500 transition flex items-center justify-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            Publier
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CLICK-TO-EDIT TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

function ClickToEditBanner({ isEnabled, onToggle }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        isEnabled 
          ? 'bg-green-500/20 border border-green-500/30' 
          : 'bg-gray-800 border border-gray-700'
      }`}
    >
      <MousePointerClick className={`w-4 h-4 ${isEnabled ? 'text-green-400' : 'text-gray-500'}`} />
      <span className={`text-sm ${isEnabled ? 'text-green-300' : 'text-gray-400'}`}>
        {isEnabled ? 'Click-to-Edit actif' : 'Click-to-Edit'}
      </span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          isEnabled ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: isEnabled ? 20 : 2 }}
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EDITOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function Editor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  // Store
  const { getSite, updateSiteContent, publishSite, initializeSites } = useSitesStore()
  
  // State
  const [site, setSite] = useState(null)
  const [draftContent, setDraftContent] = useState(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [activeTab, setActiveTab] = useState('content') // 'content' | 'design'
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [showSidebar, setShowSidebar] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [isAIExpanded, setIsAIExpanded] = useState(false)
  
  // Click-to-Edit State (Phase 1)
  const [clickToEditEnabled, setClickToEditEnabled] = useState(true)
  const [selectedElement, setSelectedElement] = useState(null)
  const [showQuickEdit, setShowQuickEdit] = useState(false)
  
  // Preview state for AI
  const [previewOverride, setPreviewOverride] = useState(null)
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  
  // Undo/Redo
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showThemeDrawer, setShowThemeDrawer] = useState(false)
  
  // Schema from site
  const schema = site?.schema || null

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    initializeSites()
  }, [initializeSites])

  useEffect(() => {
    const loadedSite = getSite(slug)
    if (loadedSite) {
      setSite(loadedSite)
      setDraftContent(loadedSite.draft_content)
      setHistory([loadedSite.draft_content])
      setHistoryIndex(0)
    } else {
      navigate('/')
    }
  }, [slug, getSite, navigate])

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO-SAVE
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!hasUnsavedChanges || !draftContent) return
    
    const timer = setTimeout(() => {
      setIsSaving(true)
      updateSiteContent(slug, draftContent)
      setTimeout(() => {
        setIsSaving(false)
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
      }, 500)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [draftContent, hasUnsavedChanges, slug, updateSiteContent])

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (draftContent) {
          setIsSaving(true)
          updateSiteContent(slug, draftContent)
          setTimeout(() => {
            setIsSaving(false)
            setHasUnsavedChanges(false)
            setLastSaved(new Date())
            toast.success('Sauvegardé !', 'Vos modifications ont été enregistrées')
          }, 500)
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        handleRedo()
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedElement(null)
        setShowQuickEdit(false)
        setPreviewOverride(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [draftContent, slug, historyIndex, history])

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT UPDATE HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const updateField = useCallback((section, field, value) => {
    setDraftContent(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }
      // Add to history
      setHistory(h => [...h.slice(0, historyIndex + 1), updated])
      setHistoryIndex(i => i + 1)
      return updated
    })
    setHasUnsavedChanges(true)
  }, [historyIndex])

  const updateTheme = useCallback((themeUpdates) => {
    setDraftContent(prev => {
      const updated = { ...prev, theme: { ...prev.theme, ...themeUpdates } }
      setHistory(h => [...h.slice(0, historyIndex + 1), updated])
      setHistoryIndex(i => i + 1)
      return updated
    })
    setHasUnsavedChanges(true)
  }, [historyIndex])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1)
      setDraftContent(history[historyIndex - 1])
      setHasUnsavedChanges(true)
    }
  }, [historyIndex, history])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1)
      setDraftContent(history[historyIndex + 1])
      setHasUnsavedChanges(true)
    }
  }, [historyIndex, history])

  // ═══════════════════════════════════════════════════════════════════════════
  // CLICK-TO-EDIT HANDLERS (Phase 1)
  // ═══════════════════════════════════════════════════════════════════════════

  const handleElementClick = useCallback((elementInfo) => {
    if (!clickToEditEnabled) return
    
    setSelectedElement(elementInfo)
    setActiveSection(elementInfo.section)
    setShowQuickEdit(true)
    
    // Clear any AI preview
    setPreviewOverride(null)
  }, [clickToEditEnabled])

  const handleQuickEditClose = useCallback(() => {
    setShowQuickEdit(false)
    setSelectedElement(null)
  }, [])

  const handleQuickEditSave = useCallback((section, field, value) => {
    updateField(section, field, value)
    toast.success('Modifié !', 'Le changement a été appliqué')
  }, [updateField, toast])

  // ═══════════════════════════════════════════════════════════════════════════
  // AI HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const applyAIChanges = useCallback((updatedContent) => {
    setDraftContent(updatedContent)
    setHistory(h => [...h.slice(0, historyIndex + 1), updatedContent])
    setHistoryIndex(i => i + 1)
    setHasUnsavedChanges(true)
    setPreviewOverride(null)
  }, [historyIndex])

  const handleAIPreview = useCallback((preview) => {
    if (preview) {
      setPreviewOverride(preview)
    } else {
      setPreviewOverride(null)
    }
  }, [])

  const applyAIPreview = useCallback(() => {
    if (previewOverride) {
      updateField(previewOverride.section, previewOverride.field, previewOverride.value)
      setPreviewOverride(null)
      toast.success('Appliqué !', 'Le changement IA a été appliqué')
    }
  }, [previewOverride, updateField, toast])

  const cancelAIPreview = useCallback(() => {
    setPreviewOverride(null)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLISH HANDLER
  // ═══════════════════════════════════════════════════════════════════════════

  const handlePublish = useCallback(() => {
    setIsSaving(true)
    updateSiteContent(slug, draftContent)
    
    setTimeout(() => {
      publishSite(slug)
      setIsSaving(false)
      setShowPublishModal(false)
      setShowSuccessModal(true)
      setHasUnsavedChanges(false)
    }, 1000)
  }, [slug, draftContent, updateSiteContent, publishSite])

  // ═══════════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════════════════

  if (!site || !draftContent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de l'éditeur...</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════

  const contextValue = {
    site,
    schema,
    draftContent,
    activeSection,
    setActiveSection,
    updateField,
    updateTheme,
    previewOverride,
    clickToEditEnabled,
    selectedElement,
    onElementClick: handleElementClick
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <EditorContext.Provider value={contextValue}>
      <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════════════
            TOP BAR
        ═══════════════════════════════════════════════════════════════════ */}
        <header className="h-14 bg-gray-800/90 backdrop-blur border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0 z-40">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">{site.name}</h1>
                <p className="text-xs text-gray-500">{site.domain}</p>
              </div>
            </div>
          </div>

          {/* Center - Click-to-Edit Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ClickToEditBanner 
              isEnabled={clickToEditEnabled} 
              onToggle={() => setClickToEditEnabled(!clickToEditEnabled)} 
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <SaveIndicator isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} lastSaved={lastSaved} />
            
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 mr-2">
              <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition disabled:opacity-30">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition disabled:opacity-30">
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Device Preview */}
            <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-lg border border-gray-700">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone }
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPreviewDevice(id)}
                  className={`p-1.5 rounded-md transition ${previewDevice === id ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Theme Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowThemeDrawer(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-500/20"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden lg:inline">Thème</span>
            </motion.button>

            {/* Preview Link */}
            <Link to={`/site/${slug}`} target="_blank" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition">
              <Eye className="w-4 h-4" />
            </Link>

            {/* Publish */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium text-sm hover:from-green-500 hover:to-green-400 transition shadow-lg shadow-green-500/20"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Publier</span>
            </motion.button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex overflow-hidden">
          
          {isAIExpanded ? (
            // AI Expanded Mode - Split view
            <>
              <div className="w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 overflow-hidden relative">
                <div className="h-full w-full p-4 overflow-auto">
                  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    previewDevice === 'tablet' ? 'max-w-[768px] mx-auto' :
                    previewDevice === 'mobile' ? 'max-w-[375px] mx-auto' : ''
                  }`}>
                    <LivePreview />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <AIAssistant
                  siteContent={draftContent}
                  onApplyChanges={applyAIChanges}
                  onPreview={handleAIPreview}
                  isExpanded={true}
                  onToggleExpand={() => setIsAIExpanded(false)}
                  selectedElement={selectedElement}
                  activeSection={activeSection}
                  activeTab={activeTab}
                />
              </div>
            </>
          ) : (
            <>
              {/* LEFT SIDEBAR */}
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-gray-900 border-r border-gray-700 overflow-hidden flex-shrink-0"
                  >
                    <Sidebar />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CENTER - PREVIEW */}
              <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 min-w-0 overflow-hidden relative">
                {/* Toggle Sidebar Button */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="absolute top-4 left-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition"
                >
                  {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                </button>

                {/* AI Preview Banner */}
                <AnimatePresence>
                  {previewOverride && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 bg-purple-600/90 backdrop-blur rounded-xl shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Aperçu IA</span>
                      <div className="flex gap-2">
                        <button onClick={applyAIPreview} className="px-3 py-1 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition">
                          Appliquer
                        </button>
                        <button onClick={cancelAIPreview} className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-400 transition">
                          Annuler
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preview Container */}
                <div className="h-full w-full py-4 px-6 overflow-auto">
                  <div className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    previewDevice === 'desktop' ? 'w-full h-full' :
                    previewDevice === 'tablet' ? 'w-[768px] mx-auto border-[12px] border-gray-900 rounded-[2rem]' :
                    'w-[375px] mx-auto border-[12px] border-gray-900 rounded-[2.5rem] relative'
                  }`}>
                    {previewDevice === 'mobile' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-3xl z-10" />
                    )}
                    <LivePreview />
                  </div>
                </div>
              </div>

              {/* RIGHT - EDITOR PANEL */}
              <AnimatePresence>
                {showEditor && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 340, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-gray-900 border-l border-gray-700 overflow-hidden flex-shrink-0"
                  >
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                      <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-sm font-medium transition ${
                          activeTab === 'content' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        Contenu
                      </button>
                      <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 py-3 text-sm font-medium transition ${
                          activeTab === 'design' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        Design
                      </button>
                    </div>

                    {/* Panel Content */}
                    <div className="h-[calc(100%-49px)] overflow-y-auto">
                      {activeTab === 'content' ? (
                        <SectionEditor />
                      ) : (
                        <SectionDesignEditor />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Editor Button */}
              {!showEditor && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-3 bg-gradient-to-l from-green-600 to-green-700 text-white rounded-l-xl shadow-lg"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            AI ASSISTANT BAR (bottom, when not expanded)
        ═══════════════════════════════════════════════════════════════════ */}
        {!isAIExpanded && (
          <AIAssistant
            siteContent={draftContent}
            onApplyChanges={applyAIChanges}
            onPreview={handleAIPreview}
            isExpanded={false}
            onToggleExpand={() => setIsAIExpanded(true)}
            selectedElement={selectedElement}
            activeSection={activeSection}
            activeTab={activeTab}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            QUICK EDIT PANEL (Phase 1 - Click-to-Edit)
        ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showQuickEdit && selectedElement && (
            <QuickEditPanel
              element={selectedElement}
              content={draftContent}
              onSave={handleQuickEditSave}
              onClose={handleQuickEditClose}
              onAskAI={() => {
                setShowQuickEdit(false)
                setIsAIExpanded(true)
              }}
            />
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            MODALS
        ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showPublishModal && (
            <PublishModal onClose={() => setShowPublishModal(false)} onConfirm={handlePublish} isSaving={isSaving} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSuccessModal && (
            <PublishSuccessModal onClose={() => setShowSuccessModal(false)} siteName={site.name} siteSlug={site.slug} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showThemeDrawer && (
            <GlobalThemeDrawer
              isOpen={showThemeDrawer}
              onClose={() => setShowThemeDrawer(false)}
              theme={draftContent.theme}
              onUpdate={updateTheme}
            />
          )}
        </AnimatePresence>
      </div>
    </EditorContext.Provider>
  )
}
