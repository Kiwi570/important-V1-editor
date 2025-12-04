import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'
import * as LucideIcons from 'lucide-react'
import {
  ChevronDown, X, Upload, Image as ImageIcon, Link as LinkIcon,
  Check, Trash2, AlertCircle
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES PARTAGÉES
// ═══════════════════════════════════════════════════════════════════════════

export const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#ef4444', '#06b6d4', '#84cc16', '#6366f1', '#14b8a6',
  '#f97316', '#a855f7', '#0ea5e9', '#22c55e', '#eab308'
]

export const MODULE_ICONS = [
  'Sparkles', 'Clock', 'Star', 'Heart', 'Crown', 'Award', 'Zap',
  'Coffee', 'Scissors', 'Sun', 'Moon', 'Music', 'Flower2',
  'Camera', 'Palette', 'Briefcase', 'GraduationCap', 'Dumbbell', 
  'Leaf', 'Gem', 'Gift', 'Smile', 'Users', 'Target', 'ShoppingBag',
  'Package', 'Truck', 'CreditCard', 'Tag', 'Percent', 'Box'
]

export const BADGE_PRESETS = [
  { id: 'popular', label: '⭐ Populaire', color: '#f59e0b' },
  { id: 'new', label: '✨ Nouveau', color: '#3b82f6' },
  { id: 'promo', label: '🔥 Promo', color: '#ef4444' },
  { id: 'limited', label: '⏰ Limité', color: '#8b5cf6' },
  { id: 'bestseller', label: '🏆 Best-seller', color: '#10b981' },
  { id: 'free', label: '🎁 Offert', color: '#06b6d4' }
]

// ═══════════════════════════════════════════════════════════════════════════
// COLLAPSIBLE SECTION
// ═══════════════════════════════════════════════════════════════════════════

export function CollapsibleSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true, 
  badge,
  variant = 'default' // 'default' | 'compact'
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className={`border border-gray-700/50 rounded-xl overflow-hidden ${
      variant === 'compact' ? 'bg-gray-800/20' : 'bg-gray-800/30'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between hover:bg-gray-800/50 transition ${
          variant === 'compact' ? 'p-2.5' : 'p-3'
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`text-purple-400 ${variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
          <span className={`font-medium text-white ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>{title}</span>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className={`text-gray-500 ${variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`border-t border-gray-700/50 ${
              variant === 'compact' ? 'p-2.5 pt-2 space-y-2' : 'p-3 pt-0 space-y-3'
            }`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TEXT FIELD
// ═══════════════════════════════════════════════════════════════════════════

export function TextField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxLength,
  size = 'default' // 'default' | 'small'
}) {
  return (
    <div>
      {label && (
        <label className={`block text-gray-400 mb-1.5 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-gray-900 border border-gray-700 rounded-lg text-white 
          focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition
          ${size === 'small' ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TEXTAREA FIELD
// ═══════════════════════════════════════════════════════════════════════════

export function TextareaField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  maxLength 
}) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1.5">{label}</label>}
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm 
          focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition resize-none"
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE FIELD
// ═══════════════════════════════════════════════════════════════════════════

export function ToggleField({ 
  label, 
  value, 
  onChange, 
  description,
  size = 'default' // 'default' | 'small'
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex-1 min-w-0 mr-3">
        <span className={`text-gray-300 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>{label}</span>
        {description && <p className="text-[10px] text-gray-500 truncate">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`rounded-full transition-colors flex-shrink-0 ${
          value ? 'bg-purple-500' : 'bg-gray-600'
        } ${size === 'small' ? 'w-9 h-5' : 'w-11 h-6'}`}
      >
        <motion.div
          className={`bg-white rounded-full shadow-sm ${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'}`}
          animate={{ x: value ? (size === 'small' ? 17 : 22) : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECT FIELD
// ═══════════════════════════════════════════════════════════════════════════

export function SelectField({ 
  label, 
  value, 
  onChange, 
  options,
  size = 'default' 
}) {
  return (
    <div>
      {label && (
        <label className={`block text-gray-400 mb-1.5 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-900 border border-gray-700 rounded-lg text-white 
          focus:ring-2 focus:ring-purple-500/50 outline-none
          ${size === 'small' ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER FIELD
// ═══════════════════════════════════════════════════════════════════════════

export function NumberField({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max, 
  step = 1,
  suffix,
  size = 'default'
}) {
  return (
    <div>
      {label && (
        <label className={`block text-gray-400 mb-1.5 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full bg-gray-900 border border-gray-700 rounded-lg text-white 
            focus:ring-2 focus:ring-purple-500/50 outline-none
            ${suffix ? 'pr-8' : ''}
            ${size === 'small' ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ICON PICKER
// ═══════════════════════════════════════════════════════════════════════════

export function IconPicker({ 
  value, 
  onChange, 
  icons = MODULE_ICONS,
  size = 'default' // 'default' | 'small'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = LucideIcons[value] || LucideIcons.Star

  return (
    <div className="relative">
      <label className={`block text-gray-400 mb-1.5 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
        Icône
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center 
          hover:border-purple-500/50 transition ${size === 'small' ? 'w-10 h-10' : 'w-12 h-12'}`}
      >
        <Icon className={`text-gray-300 ${size === 'small' ? 'w-5 h-5' : 'w-6 h-6'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-0 z-50 mt-2 p-3 bg-gray-800 border border-gray-700 
                rounded-xl shadow-xl grid grid-cols-6 gap-1 w-64 max-h-64 overflow-y-auto"
            >
              {icons.map((iconName) => {
                const IconComp = LucideIcons[iconName]
                if (!IconComp) return null
                return (
                  <button
                    key={iconName}
                    onClick={() => { onChange(iconName); setIsOpen(false) }}
                    className={`p-2.5 rounded-lg transition ${
                      value === iconName 
                        ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500' 
                        : 'hover:bg-gray-700 text-gray-400'
                    }`}
                    title={iconName}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PICKER
// ═══════════════════════════════════════════════════════════════════════════

export function ColorPicker({ 
  label = 'Couleur',
  value, 
  onChange, 
  presets = PRESET_COLORS,
  showInput = true,
  size = 'default'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const displayColor = value || presets[0]
  
  return (
    <div className="relative">
      {label && (
        <label className={`block text-gray-400 mb-1.5 ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-xl border-2 border-gray-600 hover:border-gray-500 transition shadow-inner flex-shrink-0
            ${size === 'small' ? 'w-8 h-8' : 'w-10 h-10'}`}
          style={{ backgroundColor: displayColor }}
        />
        {showInput && (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono
              ${size === 'small' ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'}`}
            placeholder="#000000"
          />
        )}
        {value && (
          <button
            onClick={() => onChange(null)}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition"
            title="Réinitialiser"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute z-50 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl"
            >
              <HexColorPicker color={displayColor} onChange={onChange} />
              <div className="flex gap-1 mt-3 flex-wrap max-w-[200px]">
                {presets.map(c => (
                  <button
                    key={c}
                    onClick={() => { onChange(c); setIsOpen(false); }}
                    className={`w-6 h-6 rounded-lg hover:scale-110 transition ${
                      value === c ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-800' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PICKER INLINE (Grille simple sans popup)
// ═══════════════════════════════════════════════════════════════════════════

export function ColorPickerInline({ 
  label,
  value, 
  onChange, 
  presets = PRESET_COLORS 
}) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1.5">{label}</label>}
      <div className="flex gap-1.5 flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${
              value === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE UPLOADER
// ═══════════════════════════════════════════════════════════════════════════

export function ImageUploader({ 
  value, 
  onChange, 
  label = 'Image',
  aspectRatio = '16/9', // '1/1' | '16/9' | '4/3'
  placeholder = 'Glissez une image ou cliquez'
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState(value?.startsWith('http') ? 'url' : 'upload')
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '')
  const fileInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => onChange(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => onChange(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-400">{label}</label>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 text-[10px] rounded transition ${
              mode === 'upload' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Upload className="w-3 h-3 inline mr-1" />Upload
          </button>
          <button
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 text-[10px] rounded transition ${
              mode === 'url' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <LinkIcon className="w-3 h-3 inline mr-1" />URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition cursor-pointer overflow-hidden ${
            isDragging 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-700 hover:border-gray-600 bg-gray-900'
          }`}
          style={{ aspectRatio }}
        >
          {value && !value.startsWith('http') ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); onChange(null) }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs text-center px-4">{placeholder}</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
          {value?.startsWith('http') && (
            <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ aspectRatio }}>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => { onChange(null); setUrlInput('') }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BADGE SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

export function BadgeSelector({ 
  value, // { type: 'popular' | 'custom', label: string, color: string }
  onChange,
  presets = BADGE_PRESETS 
}) {
  const [customLabel, setCustomLabel] = useState(value?.type === 'custom' ? value.label : '')
  const [customColor, setCustomColor] = useState(value?.color || '#8b5cf6')

  const handlePresetSelect = (preset) => {
    if (value?.id === preset.id) {
      onChange(null) // Deselect
    } else {
      onChange({ type: preset.id, label: preset.label, color: preset.color })
    }
  }

  const handleCustomChange = () => {
    if (customLabel.trim()) {
      onChange({ type: 'custom', label: customLabel, color: customColor })
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-gray-400">Badge</label>
      
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              value?.type === preset.id
                ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-800'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: `${preset.color}25`, color: preset.color }}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => onChange(null)}
          className={`px-2.5 py-1 rounded-lg text-xs text-gray-500 hover:text-gray-300 
            bg-gray-800 hover:bg-gray-700 transition ${!value ? 'ring-1 ring-gray-600' : ''}`}
        >
          Aucun
        </button>
      </div>

      {/* Custom */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Badge personnalisé..."
            className="w-full px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs"
          />
        </div>
        <button
          onClick={() => {
            const picker = document.getElementById('badge-color-picker')
            picker?.click()
          }}
          className="w-8 h-8 rounded-lg border-2 border-gray-600 flex-shrink-0"
          style={{ backgroundColor: customColor }}
        />
        <input
          id="badge-color-picker"
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="sr-only"
        />
        <button
          onClick={handleCustomChange}
          disabled={!customLabel.trim()}
          className="px-2 py-1.5 bg-purple-500 text-white rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          OK
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PRICE EDITOR
// ═══════════════════════════════════════════════════════════════════════════

export function PriceEditor({ 
  price, 
  originalPrice, 
  priceLabel,
  onChange, // ({ price, originalPrice, priceLabel }) => void
  currency = '€'
}) {
  const [isFree, setIsFree] = useState(price === 0)
  const [hasPromo, setHasPromo] = useState(!!originalPrice && originalPrice > price)

  const handlePriceChange = (newPrice) => {
    const p = parseFloat(newPrice) || 0
    setIsFree(p === 0)
    onChange({
      price: p,
      originalPrice: hasPromo ? originalPrice : null,
      priceLabel: p === 0 ? 'Offert' : `${p} ${currency}`
    })
  }

  const handleOriginalPriceChange = (newOriginal) => {
    const o = parseFloat(newOriginal) || 0
    onChange({
      price,
      originalPrice: o > price ? o : null,
      priceLabel: price === 0 ? 'Offert' : `${price} ${currency}`
    })
  }

  const toggleFree = () => {
    const newIsFree = !isFree
    setIsFree(newIsFree)
    if (newIsFree) {
      onChange({ price: 0, originalPrice: null, priceLabel: 'Offert' })
    } else {
      onChange({ price: 50, originalPrice: null, priceLabel: `50 ${currency}` })
    }
  }

  const togglePromo = () => {
    const newHasPromo = !hasPromo
    setHasPromo(newHasPromo)
    if (newHasPromo) {
      onChange({ 
        price, 
        originalPrice: Math.round(price * 1.3), 
        priceLabel: `${price} ${currency}` 
      })
    } else {
      onChange({ price, originalPrice: null, priceLabel: `${price} ${currency}` })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <ToggleField 
          label="Gratuit" 
          value={isFree} 
          onChange={toggleFree}
          size="small"
        />
        {!isFree && (
          <ToggleField 
            label="Promo" 
            value={hasPromo} 
            onChange={togglePromo}
            size="small"
          />
        )}
      </div>

      {!isFree && (
        <div className="flex gap-2">
          <NumberField
            label="Prix"
            value={price}
            onChange={handlePriceChange}
            min={0}
            step={5}
            suffix={currency}
            size="small"
          />
          {hasPromo && (
            <NumberField
              label="Prix barré"
              value={originalPrice}
              onChange={handleOriginalPriceChange}
              min={price + 1}
              step={5}
              suffix={currency}
              size="small"
            />
          )}
        </div>
      )}

      {/* Preview */}
      <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
        <span className="text-[10px] text-gray-500">Aperçu:</span>
        {hasPromo && originalPrice && (
          <span className="text-sm text-gray-500 line-through">{originalPrice} {currency}</span>
        )}
        <span className={`font-bold ${isFree ? 'text-green-400' : 'text-white'}`}>
          {isFree ? 'Offert' : `${price} ${currency}`}
        </span>
        {hasPromo && originalPrice && (
          <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">
            -{Math.round((1 - price / originalPrice) * 100)}%
          </span>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DURATION SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

export const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 heures' },
  { value: 180, label: '3 heures' },
  { value: 240, label: '4 heures' }
]

export function DurationSelector({ value, onChange, size = 'default' }) {
  return (
    <SelectField
      label="Durée"
      value={value || 60}
      onChange={(v) => onChange(parseInt(v))}
      options={DURATION_OPTIONS}
      size={size}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MINI ACTIONS BAR
// ═══════════════════════════════════════════════════════════════════════════

export function ItemActions({ onDuplicate, onDelete, compact = false }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className={`flex items-center gap-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition
            ${compact ? 'p-1.5' : 'px-2.5 py-1.5 text-xs'}`}
          title="Dupliquer"
        >
          <LucideIcons.Copy className={compact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'} />
          {!compact && 'Dupliquer'}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition
            ${compact ? 'p-1.5' : 'px-2.5 py-1.5 text-xs'}`}
          title="Supprimer"
        >
          <Trash2 className={compact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'} />
          {!compact && 'Supprimer'}
        </button>
      )}
    </div>
  )
}
