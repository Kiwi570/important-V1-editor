// ═══════════════════════════════════════════════════════════════════════════
// PREVIEW COMPARISON - Avant/Après avec slider de comparaison
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Layers, ArrowLeftRight, Check, X } from 'lucide-react'
import { getValueAtPath, setValueAtPath } from '../../lib/aiService'
import { humanizePath } from '../../lib/pathLabels'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function PreviewComparison({ 
  originalContent, 
  actions, 
  onApply, 
  onCancel,
  selectedIndexes,
  onToggleSelection
}) {
  const [viewMode, setViewMode] = useState('split') // 'split' | 'slider' | 'toggle'
  const [sliderPosition, setSliderPosition] = useState(50)
  const [showAfter, setShowAfter] = useState(true)

  // Calculer le contenu modifié
  const modifiedContent = useMemo(() => {
    if (!originalContent || !actions?.length) return originalContent
    
    let content = JSON.parse(JSON.stringify(originalContent))
    
    // Appliquer seulement les actions sélectionnées
    const selectedActions = actions.filter((_, i) => selectedIndexes.includes(i))
    
    for (const action of selectedActions) {
      try {
        const { type, path, value, section, data, index, updates } = action
        
        switch (type) {
          case 'update':
            content = setValueAtPath(content, path, value)
            break
          case 'update_item':
            if (content[section]?.items?.[index]) {
              content[section].items[index] = { 
                ...content[section].items[index], 
                ...updates 
              }
            }
            break
          case 'add_item':
            if (content[section]?.items) {
              content[section].items.push(value)
            }
            break
          case 'generate_section':
            if (data) {
              content[section] = { ...content[section], ...data }
            }
            break
          case 'apply_preset':
            // Géré ailleurs
            break
          case 'update_theme':
            if (action.primary) content.theme.primaryColor = action.primary
            if (action.secondary) content.theme.secondaryColor = action.secondary
            break
        }
      } catch (e) {
        console.error('Preview error:', e)
      }
    }
    
    return content
  }, [originalContent, actions, selectedIndexes])

  // Extraire les changements visuels principaux
  const visualChanges = useMemo(() => {
    const changes = []
    const selectedActions = actions.filter((_, i) => selectedIndexes.includes(i))
    
    for (const action of selectedActions) {
      const { path, value } = action
      if (!path) continue
      
      const oldValue = getValueAtPath(originalContent, path)
      const label = humanizePath(path)
      
      // Déterminer le type de changement
      let changeType = 'text'
      if (path.includes('color') || path.includes('Color') || path.includes('bgColor')) {
        changeType = 'color'
      } else if (path.includes('enabled')) {
        changeType = 'toggle'
      } else if (typeof value === 'object') {
        changeType = 'object'
      }
      
      changes.push({
        path,
        label,
        oldValue,
        newValue: value,
        type: changeType
      })
    }
    
    return changes.slice(0, 6) // Max 6 changements affichés
  }, [actions, selectedIndexes, originalContent])

  // Déterminer quelle section est principalement affectée
  const mainSection = useMemo(() => {
    const sections = actions.map(a => a.path?.split('.')[0] || a.section).filter(Boolean)
    return sections[0] || 'hero'
  }, [actions])

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/80">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">Aperçu des modifications</span>
          <span className="text-xs text-gray-500">
            ({selectedIndexes.length} sur {actions.length})
          </span>
        </div>
        
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              viewMode === 'split' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              viewMode === 'slider' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setViewMode('toggle'); setShowAfter(!showAfter) }}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              viewMode === 'toggle' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {showAfter ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-4">
        {/* Changes Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {visualChanges.map((change, i) => (
            <ChangePreviewCard key={i} change={change} />
          ))}
        </div>

        {/* Mini Preview selon le mode */}
        {viewMode === 'split' && (
          <SplitView 
            originalContent={originalContent} 
            modifiedContent={modifiedContent}
            mainSection={mainSection}
          />
        )}
        
        {viewMode === 'slider' && (
          <SliderView
            originalContent={originalContent}
            modifiedContent={modifiedContent}
            mainSection={mainSection}
            position={sliderPosition}
            onPositionChange={setSliderPosition}
          />
        )}
        
        {viewMode === 'toggle' && (
          <ToggleView
            originalContent={originalContent}
            modifiedContent={modifiedContent}
            mainSection={mainSection}
            showAfter={showAfter}
            onToggle={() => setShowAfter(!showAfter)}
          />
        )}
      </div>

      {/* Actions list with checkboxes */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 mb-2">Sélectionne les modifications à appliquer :</div>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {actions.map((action, index) => (
            <ActionCheckbox
              key={index}
              action={action}
              isSelected={selectedIndexes.includes(index)}
              onToggle={() => onToggleSelection(index)}
            />
          ))}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 bg-gray-800/80">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
        
        <motion.button
          onClick={onApply}
          disabled={selectedIndexes.length === 0}
          whileHover={{ scale: selectedIndexes.length > 0 ? 1.02 : 1 }}
          whileTap={{ scale: selectedIndexes.length > 0 ? 0.98 : 1 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
            selectedIndexes.length > 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          Appliquer ({selectedIndexes.length})
        </motion.button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CHANGE PREVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════

function ChangePreviewCard({ change }) {
  const { label, oldValue, newValue, type } = change

  if (type === 'color') {
    return (
      <div className="bg-gray-900/50 rounded-lg p-3">
        <div className="text-xs text-gray-500 mb-2">{label}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: oldValue || '#ccc' }}
            />
            <span className="text-xs text-gray-500">→</span>
            <div 
              className="w-6 h-6 rounded border border-gray-600 ring-2 ring-purple-500/50"
              style={{ backgroundColor: newValue || '#ccc' }}
            />
          </div>
          <span className="text-xs text-gray-400">{newValue}</span>
        </div>
      </div>
    )
  }

  if (type === 'toggle') {
    return (
      <div className="bg-gray-900/50 rounded-lg p-3">
        <div className="text-xs text-gray-500 mb-2">{label}</div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${oldValue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {oldValue ? 'Visible' : 'Masqué'}
          </span>
          <span className="text-xs text-gray-500">→</span>
          <span className={`text-xs px-2 py-0.5 rounded ${newValue ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {newValue ? 'Visible' : 'Masqué'}
          </span>
        </div>
      </div>
    )
  }

  // Text
  const oldText = typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || '')
  const newText = typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || '')

  return (
    <div className="bg-gray-900/50 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className="space-y-1">
        <div className="text-xs text-red-400/70 line-through truncate">
          {oldText.slice(0, 40)}{oldText.length > 40 ? '...' : ''}
        </div>
        <div className="text-xs text-green-400 truncate">
          {newText.slice(0, 40)}{newText.length > 40 ? '...' : ''}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTION CHECKBOX
// ═══════════════════════════════════════════════════════════════════════════

function ActionCheckbox({ action, isSelected, onToggle }) {
  const label = action.label || humanizePath(action.path) || action.type
  
  return (
    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
      />
      <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </span>
      {action.path?.includes('color') && action.value && (
        <div 
          className="w-4 h-4 rounded ml-auto border border-gray-600"
          style={{ backgroundColor: action.value }}
        />
      )}
    </label>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT VIEW
// ═══════════════════════════════════════════════════════════════════════════

function SplitView({ originalContent, modifiedContent, mainSection }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <div className="absolute top-2 left-2 text-xs bg-gray-900/80 text-gray-400 px-2 py-1 rounded">
          Avant
        </div>
        <MiniPreview content={originalContent} section={mainSection} variant="before" />
      </div>
      <div className="relative">
        <div className="absolute top-2 left-2 text-xs bg-purple-500/80 text-white px-2 py-1 rounded">
          Après
        </div>
        <MiniPreview content={modifiedContent} section={mainSection} variant="after" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDER VIEW
// ═══════════════════════════════════════════════════════════════════════════

function SliderView({ originalContent, modifiedContent, mainSection, position, onPositionChange }) {
  return (
    <div className="relative h-40 rounded-lg overflow-hidden border border-gray-700">
      {/* Before (full) */}
      <div className="absolute inset-0">
        <MiniPreview content={originalContent} section={mainSection} variant="before" fullHeight />
      </div>
      
      {/* After (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <MiniPreview content={modifiedContent} section={mainSection} variant="after" fullHeight />
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-purple-500 cursor-ew-resize"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <ArrowLeftRight className="w-3 h-3 text-white" />
        </div>
      </div>
      
      {/* Slider input (invisible) */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => onPositionChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
      
      {/* Labels */}
      <div className="absolute bottom-2 left-2 text-xs bg-gray-900/80 text-gray-400 px-2 py-1 rounded">
        Avant
      </div>
      <div className="absolute bottom-2 right-2 text-xs bg-purple-500/80 text-white px-2 py-1 rounded">
        Après
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE VIEW
// ═══════════════════════════════════════════════════════════════════════════

function ToggleView({ originalContent, modifiedContent, mainSection, showAfter, onToggle }) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={showAfter ? 'after' : 'before'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MiniPreview 
            content={showAfter ? modifiedContent : originalContent} 
            section={mainSection} 
            variant={showAfter ? 'after' : 'before'}
          />
        </motion.div>
      </AnimatePresence>
      
      <button
        onClick={onToggle}
        className="absolute top-2 right-2 px-3 py-1.5 bg-gray-900/80 hover:bg-gray-800 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
      >
        {showAfter ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        {showAfter ? 'Voir avant' : 'Voir après'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MINI PREVIEW - Aperçu miniature d'une section
// ═══════════════════════════════════════════════════════════════════════════

function MiniPreview({ content, section, variant, fullHeight }) {
  if (!content) return null
  
  const sectionData = content[section]
  if (!sectionData) return null
  
  const theme = content.theme || {}
  const styles = sectionData.styles || {}
  
  // Couleurs
  const bgColor = styles.background?.color || (variant === 'after' ? '#1a1a2e' : '#f8f9fa')
  const titleColor = styles.title?.color || (variant === 'after' ? '#ffffff' : '#1a1a1a')
  const subtitleColor = styles.subtitle?.color || (variant === 'after' ? '#e0e0e0' : '#666666')
  
  return (
    <div 
      className={`rounded-lg overflow-hidden ${fullHeight ? 'h-full' : 'h-32'}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="p-4 h-full flex flex-col justify-center">
        {/* Badge */}
        {sectionData.badge && (
          <div 
            className="text-[8px] px-2 py-0.5 rounded-full w-fit mb-1"
            style={{ 
              backgroundColor: styles.badge?.bgColor || theme.primaryColor || '#2D5A3D',
              color: styles.badge?.textColor || '#ffffff'
            }}
          >
            {sectionData.badge}
          </div>
        )}
        
        {/* Title */}
        {sectionData.title && (
          <div 
            className="text-sm font-bold truncate mb-1"
            style={{ color: titleColor }}
          >
            {sectionData.title}
          </div>
        )}
        
        {/* Subtitle */}
        {sectionData.subtitle && (
          <div 
            className="text-[10px] truncate"
            style={{ color: subtitleColor }}
          >
            {sectionData.subtitle.slice(0, 60)}...
          </div>
        )}
        
        {/* Buttons preview */}
        {(sectionData.ctaPrimary || sectionData.buttonPrimary) && (
          <div className="flex gap-2 mt-2">
            <div 
              className="text-[8px] px-2 py-1 rounded"
              style={{ 
                backgroundColor: styles.primaryButton?.bgColor || theme.primaryColor || '#2D5A3D',
                color: '#ffffff'
              }}
            >
              {sectionData.ctaPrimary?.text || sectionData.buttonPrimary?.text || 'Bouton'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
