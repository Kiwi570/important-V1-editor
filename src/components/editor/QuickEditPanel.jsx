import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, Check, Type, Link2, Palette, ArrowRight } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

// ═══════════════════════════════════════════════════════════════════════════
// QUICK EDIT PANEL - Phase 1 Click-to-Edit Feature
// ═══════════════════════════════════════════════════════════════════════════
// This panel appears when user clicks on an element in the preview.
// It provides quick editing capabilities + AI assistance option.

export default function QuickEditPanel({ element, content, onSave, onClose, onAskAI }) {
  const { section, field, label, currentValue, itemIndex } = element
  const inputRef = useRef(null)
  
  // Determine the type of field
  const isButton = field.includes('cta') || field.includes('button') || field.includes('Button')
  const isColor = field.includes('Color') || field.includes('color')
  
  // Parse current value
  let initialValue = currentValue
  let initialUrl = ''
  
  if (isButton && currentValue) {
    try {
      const parsed = JSON.parse(currentValue)
      initialValue = parsed.text || ''
      initialUrl = parsed.url || ''
    } catch {
      initialValue = currentValue
    }
  }
  
  const [value, setValue] = useState(initialValue || '')
  const [url, setUrl] = useState(initialUrl)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [color, setColor] = useState(isColor ? (currentValue || '#2D5A3D') : '#2D5A3D')

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  // Handle save
  const handleSave = () => {
    let finalValue = value
    
    if (isButton) {
      finalValue = { text: value, url: url || '#' }
    } else if (isColor) {
      finalValue = color
    }
    
    onSave(section, field, finalValue)
    onClose()
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // Get field info for display
  const getFieldIcon = () => {
    if (isButton) return <Link2 className="w-4 h-4" />
    if (isColor) return <Palette className="w-4 h-4" />
    return <Type className="w-4 h-4" />
  }

  const getFieldType = () => {
    if (isButton) return 'Bouton'
    if (isColor) return 'Couleur'
    if (field.includes('subtitle') || field.includes('description') || field.includes('content')) return 'Texte long'
    return 'Texte'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              {getFieldIcon()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{label || field}</h3>
              <p className="text-xs text-gray-500">{section} • {getFieldType()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Color Picker */}
          {isColor ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-12 h-12 rounded-xl border-2 border-gray-600 shadow-inner"
                  style={{ backgroundColor: color }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none"
                  placeholder="#000000"
                />
              </div>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-center"
                >
                  <HexColorPicker color={color} onChange={setColor} />
                </motion.div>
              )}
            </div>
          ) : isButton ? (
            /* Button Editor */
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Texte du bouton</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none"
                  placeholder="Texte du bouton..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Lien (URL)</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none"
                  placeholder="#section ou https://..."
                />
              </div>
            </div>
          ) : (
            /* Text Editor */
            <div>
              {field.includes('subtitle') || field.includes('description') || field.includes('content') ? (
                <textarea
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none resize-none"
                  placeholder="Votre texte..."
                />
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none"
                  placeholder="Votre texte..."
                />
              )}
            </div>
          )}

          {/* Preview of change */}
          {!isColor && value !== initialValue && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-xs text-green-400 mb-1">Aperçu du changement :</p>
              <p className="text-sm text-white">{value || '(vide)'}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/30 border-t border-gray-700">
          {/* AI Suggestion Button */}
          <button
            onClick={onAskAI}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl text-sm font-medium transition"
          >
            <Sparkles className="w-4 h-4" />
            Demander à l'IA
          </button>
          
          <div className="flex-1" />
          
          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl text-sm transition"
          >
            Annuler
          </button>
          
          {/* Save */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition"
          >
            <Check className="w-4 h-4" />
            Appliquer
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 text-center">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Entrée</kbd> pour sauvegarder • 
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 ml-1">Échap</kbd> pour annuler
          </p>
        </div>
      </div>
    </motion.div>
  )
}
