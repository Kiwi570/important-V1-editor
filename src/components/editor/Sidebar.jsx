import { useEditorContext } from '../../pages/Editor'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layout, Target, Briefcase, BookOpen, Star, HelpCircle, 
  Megaphone, Phone, FootprintsIcon, Eye, EyeOff, GripVertical,
  Calendar, ShoppingCart, Package, ChevronDown, ChevronRight,
  Puzzle, ToggleLeft, ToggleRight, Sparkles
} from 'lucide-react'
import { useState } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR - Section Navigation with Modules
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_ICONS = {
  header: Layout,
  hero: Target,
  services: Briefcase,
  about: BookOpen,
  testimonials: Star,
  faq: HelpCircle,
  cta: Megaphone,
  contact: Phone,
  footer: FootprintsIcon,
  // Modules
  booking: Calendar,
  ecommerce: ShoppingCart
}

const SECTION_LABELS = {
  header: 'En-tête',
  hero: 'Hero',
  services: 'Services',
  about: 'À propos',
  testimonials: 'Témoignages',
  faq: 'FAQ',
  cta: 'Bannière CTA',
  contact: 'Contact',
  footer: 'Pied de page',
  // Modules
  booking: 'Réservation',
  ecommerce: 'E-commerce'
}

const MODULE_INFO = {
  booking: {
    icon: Calendar,
    label: 'Réservation',
    description: 'Prise de RDV en ligne',
    color: 'blue'
  },
  ecommerce: {
    icon: ShoppingCart,
    label: 'E-commerce',
    description: 'Vente de produits',
    color: 'orange'
  }
}

// Liste des sections de base (sans les modules)
const BASE_SECTIONS = ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer']

// Liste des modules disponibles
const AVAILABLE_MODULES = ['booking', 'ecommerce']

export default function Sidebar() {
  const { draftContent, activeSection, setActiveSection, updateField } = useEditorContext()
  const [modulesExpanded, setModulesExpanded] = useState(true)

  if (!draftContent) return null

  // Récupérer l'ordre des sections (ou utiliser l'ordre par défaut)
  const sectionOrder = draftContent.sectionOrder || BASE_SECTIONS

  // Construire la liste des sections à afficher (base + modules actifs)
  const activeSections = sectionOrder.filter(id => {
    // Si c'est une section de base, toujours l'afficher
    if (BASE_SECTIONS.includes(id)) return true
    // Si c'est un module, vérifier s'il est activé
    if (AVAILABLE_MODULES.includes(id)) return draftContent[id]?.enabled
    return false
  })

  // Ajouter les modules actifs qui ne sont pas encore dans l'ordre
  AVAILABLE_MODULES.forEach(moduleId => {
    if (draftContent[moduleId]?.enabled && !activeSections.includes(moduleId)) {
      // Insérer avant le footer
      const footerIndex = activeSections.indexOf('footer')
      if (footerIndex !== -1) {
        activeSections.splice(footerIndex, 0, moduleId)
      } else {
        activeSections.push(moduleId)
      }
    }
  })

  const toggleSection = (sectionId) => {
    const currentEnabled = draftContent[sectionId]?.enabled !== false
    updateField(sectionId, 'enabled', !currentEnabled)
  }

  const toggleModule = (moduleId) => {
    const currentEnabled = draftContent[moduleId]?.enabled === true
    updateField(moduleId, 'enabled', !currentEnabled)
    
    // Note: sectionOrder sera géré automatiquement dans activeSections
    // Pas besoin de le mettre à jour manuellement ici
  }

  const isModule = (sectionId) => AVAILABLE_MODULES.includes(sectionId)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-white">Sections</h2>
        <p className="text-xs text-gray-500 mt-1">Clique pour éditer</p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {activeSections.map((sectionId) => {
          const Icon = SECTION_ICONS[sectionId]
          const label = SECTION_LABELS[sectionId]
          const isActive = activeSection === sectionId
          const isEnabled = draftContent[sectionId]?.enabled !== false
          const isModuleSection = isModule(sectionId)

          return (
            <motion.div
              key={sectionId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ x: 2 }}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative
                ${isActive 
                  ? isModuleSection 
                    ? 'bg-purple-500/20 border border-purple-500/30' 
                    : 'bg-green-500/20 border border-green-500/30' 
                  : 'hover:bg-gray-800 border border-transparent'
                }
                ${!isEnabled ? 'opacity-50' : ''}
              `}
              onClick={() => setActiveSection(sectionId)}
            >
              {/* Module badge */}
              {isModuleSection && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Puzzle className="w-2.5 h-2.5 text-white" />
                </div>
              )}

              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${isActive 
                  ? isModuleSection
                    ? 'bg-purple-500/30 text-purple-400'
                    : 'bg-green-500/30 text-green-400' 
                  : 'bg-gray-800 text-gray-400 group-hover:text-white'
                }
              `}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <span className={`flex-1 text-sm font-medium ${
                isActive 
                  ? isModuleSection ? 'text-purple-400' : 'text-green-400' 
                  : 'text-gray-300'
              }`}>
                {label}
              </span>

              {/* Toggle Visibility */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSection(sectionId)
                }}
                className={`
                  p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100
                  ${isEnabled 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                  }
                `}
                title={isEnabled ? 'Masquer la section' : 'Afficher la section'}
              >
                {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute left-0 w-1 h-8 rounded-r-full ${
                    isModuleSection ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                />
              )}
            </motion.div>
          )
        })}

        {/* Divider */}
        <div className="my-4 px-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        {/* Modules Section */}
        <div className="space-y-2">
          {/* Modules Header */}
          <button
            onClick={() => setModulesExpanded(!modulesExpanded)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left">
              Modules
            </span>
            <motion.div
              animate={{ rotate: modulesExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {/* Modules List */}
          <AnimatePresence>
            {modulesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {AVAILABLE_MODULES.map((moduleId) => {
                  const moduleInfo = MODULE_INFO[moduleId]
                  const Icon = moduleInfo.icon
                  const isEnabled = draftContent[moduleId]?.enabled === true
                  const colorClasses = {
                    blue: {
                      bg: isEnabled ? 'bg-blue-500/20' : 'bg-gray-800/50',
                      border: isEnabled ? 'border-blue-500/30' : 'border-gray-700/50',
                      icon: isEnabled ? 'bg-blue-500/30 text-blue-400' : 'bg-gray-700 text-gray-500',
                      text: isEnabled ? 'text-blue-400' : 'text-gray-400',
                      toggle: isEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    },
                    orange: {
                      bg: isEnabled ? 'bg-orange-500/20' : 'bg-gray-800/50',
                      border: isEnabled ? 'border-orange-500/30' : 'border-gray-700/50',
                      icon: isEnabled ? 'bg-orange-500/30 text-orange-400' : 'bg-gray-700 text-gray-500',
                      text: isEnabled ? 'text-orange-400' : 'text-gray-400',
                      toggle: isEnabled ? 'bg-orange-500' : 'bg-gray-600'
                    }
                  }
                  const colors = colorClasses[moduleInfo.color]

                  return (
                    <motion.div
                      key={moduleId}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        group flex items-center gap-3 px-3 py-3 rounded-xl border transition-all
                        ${colors.bg} ${colors.border}
                      `}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${colors.icon}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-colors ${colors.text}`}>
                          {moduleInfo.label}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {moduleInfo.description}
                        </p>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => toggleModule(moduleId)}
                        className={`
                          relative w-11 h-6 rounded-full transition-colors ${colors.toggle}
                        `}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ left: isEnabled ? '24px' : '4px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </motion.div>
                  )
                })}

                {/* Coming soon hint */}
                <div className="px-3 py-2 flex items-center gap-2 text-gray-600">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs">Plus de modules bientôt...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Help */}
      <div className="p-4 border-t border-gray-700">
        <div className="p-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400">
            💡 <strong className="text-gray-300">Astuce :</strong> Active un module pour l'ajouter à ton site !
          </p>
        </div>
      </div>
    </div>
  )
}
