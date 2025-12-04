import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'
import { 
  X, Palette, Type, Sun, Moon, Check, ChevronDown, ChevronUp,
  Sparkles, Trees, Waves, Sunset, Flower2, Moon as MoonIcon, Minimize2
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// THEME PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const THEME_PRESETS = [
  { id: 'forest', name: 'Forêt', icon: '🌲', primary: '#2D5A3D', secondary: '#E5B94E', description: 'Nature & écologie' },
  { id: 'ocean', name: 'Océan', icon: '🌊', primary: '#1E3A5F', secondary: '#4ECDC4', description: 'Fraîcheur & confiance' },
  { id: 'sunset', name: 'Sunset', icon: '🌅', primary: '#D4451A', secondary: '#FFB347', description: 'Énergie & chaleur' },
  { id: 'lavender', name: 'Lavande', icon: '💜', primary: '#6B5B95', secondary: '#E8B4CB', description: 'Élégance & douceur' },
  { id: 'midnight', name: 'Midnight', icon: '🌙', primary: '#1A1A2E', secondary: '#E94560', description: 'Moderne & audacieux' },
  { id: 'minimal', name: 'Minimal', icon: '⚪', primary: '#333333', secondary: '#666666', description: 'Sobre & professionnel' }
]

const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', label: 'Moderne & lisible', sample: 'Aa' },
  { id: 'playfair', name: 'Playfair Display', label: 'Élégant & classique', sample: 'Aa' },
  { id: 'poppins', name: 'Poppins', label: 'Friendly & rond', sample: 'Aa' },
  { id: 'roboto', name: 'Roboto', label: 'Neutre & tech', sample: 'Aa' },
  { id: 'montserrat', name: 'Montserrat', label: 'Géométrique & moderne', sample: 'Aa' },
  { id: 'lora', name: 'Lora', label: 'Littéraire & serif', sample: 'Aa' }
]

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PICKER INLINE
// ═══════════════════════════════════════════════════════════════════════════

function InlineColorPicker({ label, color, onChange, presetColors = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultPresets = ['#2D5A3D', '#1E3A5F', '#D4451A', '#6B5B95', '#1A1A2E', '#333333', '#E5B94E', '#4ECDC4']
  const colors = presetColors.length > 0 ? presetColors : defaultPresets

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-xl border-2 border-gray-600 shadow-inner transition hover:border-gray-500 hover:scale-105"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition"
        />
      </div>
      
      {/* Quick presets */}
      <div className="flex gap-1.5 flex-wrap">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-lg border-2 transition hover:scale-110 ${
              color === c ? 'border-white' : 'border-transparent'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-2"
          >
            <HexColorPicker color={color} onChange={onChange} className="w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FONT SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

function FontSelector({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = FONT_OPTIONS.find(f => f.id === value) || FONT_OPTIONS[0]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-left hover:border-gray-600 transition"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center font-${selected.id} text-lg text-white`}>
              {selected.sample}
            </div>
            <div>
              <p className="text-white font-medium">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.label}</p>
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto"
            >
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => {
                    onChange(font.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-700 transition ${
                    value === font.id ? 'bg-green-500/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center font-${font.id} text-lg text-white`}>
                      {font.sample}
                    </div>
                    <div className="text-left">
                      <p className={`text-white font-${font.id}`}>{font.name}</p>
                      <p className="text-xs text-gray-500">{font.label}</p>
                    </div>
                  </div>
                  {value === font.id && <Check className="w-5 h-5 text-green-400" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function GlobalThemeDrawer({ isOpen, onClose, theme, onUpdate }) {
  if (!isOpen) return null

  const handlePresetClick = (preset) => {
    onUpdate({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    })
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Thème global</h2>
              <p className="text-xs text-gray-500">Personnalisez l'apparence de votre site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Theme Presets */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Thèmes prédéfinis</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isActive = theme?.primaryColor === preset.primary
                return (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePresetClick(preset)}
                    className={`relative p-4 rounded-xl border transition text-left ${
                      isActive 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: preset.primary }} />
                      <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: preset.secondary }} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="font-medium text-white">{preset.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{preset.description}</p>
                    {isActive && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-500">ou personnalisez</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Custom Colors */}
          <div className="space-y-4">
            <InlineColorPicker
              label="Couleur principale"
              color={theme?.primaryColor || '#2D5A3D'}
              onChange={(color) => onUpdate({ primaryColor: color })}
            />
            <InlineColorPicker
              label="Couleur secondaire"
              color={theme?.secondaryColor || '#E5B94E'}
              onChange={(color) => onUpdate({ secondaryColor: color })}
              presetColors={['#E5B94E', '#4ECDC4', '#FFB347', '#E8B4CB', '#E94560', '#666666', '#FF6B6B', '#95E1D3']}
            />
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Typographie</h3>
            </div>
            <FontSelector
              label="Police des titres"
              value={theme?.fontHeading || 'playfair'}
              onChange={(font) => onUpdate({ fontHeading: font })}
            />
            <FontSelector
              label="Police du texte"
              value={theme?.fontBody || 'inter'}
              onChange={(font) => onUpdate({ fontBody: font })}
            />
          </div>

          {/* Mode */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {theme?.mode === 'dark' ? 
                <Moon className="w-4 h-4 text-indigo-400" /> : 
                <Sun className="w-4 h-4 text-yellow-400" />
              }
              <h3 className="text-sm font-semibold text-white">Mode d'affichage</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate({ mode: 'light' })}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border transition ${
                  theme?.mode !== 'dark' 
                    ? 'border-green-500 bg-green-500/10 text-green-400' 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="font-medium">Clair</span>
              </button>
              <button
                onClick={() => onUpdate({ mode: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border transition ${
                  theme?.mode === 'dark' 
                    ? 'border-green-500 bg-green-500/10 text-green-400' 
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="font-medium">Sombre</span>
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-500 mb-3">Aperçu en direct</p>
            <div 
              className="p-4 rounded-xl transition-colors duration-300"
              style={{ 
                backgroundColor: theme?.mode === 'dark' ? '#1a1a1a' : '#ffffff' 
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-xl"
                  style={{ backgroundColor: theme?.primaryColor || '#2D5A3D' }}
                />
                <div 
                  className="w-10 h-10 rounded-xl"
                  style={{ backgroundColor: theme?.secondaryColor || '#E5B94E' }}
                />
              </div>
              <h4 
                className={`text-xl font-bold mb-2 font-${theme?.fontHeading || 'playfair'}`}
                style={{ color: theme?.mode === 'dark' ? '#ffffff' : '#1f2937' }}
              >
                Titre exemple
              </h4>
              <p 
                className={`text-sm mb-3 font-${theme?.fontBody || 'inter'}`}
                style={{ color: theme?.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Voici à quoi ressemblera votre texte
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-white text-sm rounded-lg font-medium"
                  style={{ backgroundColor: theme?.primaryColor || '#2D5A3D' }}
                >
                  Bouton principal
                </button>
                <button
                  className="px-4 py-2 text-sm rounded-lg font-medium border-2"
                  style={{ 
                    borderColor: theme?.primaryColor || '#2D5A3D',
                    color: theme?.primaryColor || '#2D5A3D'
                  }}
                >
                  Secondaire
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-green-400 transition"
          >
            Appliquer le thème
          </button>
        </div>
      </motion.div>
    </>
  )
}
