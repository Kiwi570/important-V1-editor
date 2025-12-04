import { useEditorContext } from '../../pages/Editor'
import { motion } from 'framer-motion'
import { 
  Layout, Target, Briefcase, BookOpen, Star, HelpCircle, 
  Megaphone, Phone, FootprintsIcon, Eye, EyeOff, GripVertical
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR - Section Navigation
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
  footer: FootprintsIcon
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
  footer: 'Pied de page'
}

export default function Sidebar() {
  const { draftContent, activeSection, setActiveSection, updateField } = useEditorContext()

  if (!draftContent) return null

  const sections = ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer']

  const toggleSection = (sectionId) => {
    const currentEnabled = draftContent[sectionId]?.enabled !== false
    updateField(sectionId, 'enabled', !currentEnabled)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-white">Sections</h2>
        <p className="text-xs text-gray-500 mt-1">Clique pour éditer</p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sections.map((sectionId) => {
          const Icon = SECTION_ICONS[sectionId]
          const label = SECTION_LABELS[sectionId]
          const isActive = activeSection === sectionId
          const isEnabled = draftContent[sectionId]?.enabled !== false

          return (
            <motion.div
              key={sectionId}
              whileHover={{ x: 2 }}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                ${isActive 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'hover:bg-gray-800 border border-transparent'
                }
                ${!isEnabled ? 'opacity-50' : ''}
              `}
              onClick={() => setActiveSection(sectionId)}
            >
              {/* Drag Handle (visual only for now) */}
              <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${isActive 
                  ? 'bg-green-500/30 text-green-400' 
                  : 'bg-gray-800 text-gray-400 group-hover:text-white'
                }
              `}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <span className={`flex-1 text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-300'}`}>
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
                  className="absolute left-0 w-1 h-8 bg-green-500 rounded-r-full"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Help */}
      <div className="p-4 border-t border-gray-700">
        <div className="p-3 bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-400">
            💡 <strong className="text-gray-300">Astuce :</strong> Active le Click-to-Edit pour modifier directement dans l'aperçu !
          </p>
        </div>
      </div>
    </div>
  )
}
