import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'
import { useEditorContext } from '../../pages/Editor'
import {
  ChevronDown, ChevronUp, Palette, Type, Layout, Layers, Box, 
  Circle, Square, RectangleHorizontal, Sparkles, Image, Sliders,
  AlignCenter, AlignLeft, AlignRight, Grid3X3, Grid2X2, LayoutGrid,
  Minus, Plus, Eye, EyeOff, Star, MessageSquare, HelpCircle
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function ColorPickerMini({ color, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {label && <span className="text-xs text-gray-500 w-16">{label}</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-lg border-2 border-gray-600 hover:border-gray-500 transition shadow-inner flex-shrink-0"
          style={{ backgroundColor: color || '#2D5A3D' }}
        />
        <input
          type="text"
          value={color || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-xs"
          placeholder="#000000"
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 p-3 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl"
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)'
              }}
            >
              <p className="text-xs text-gray-400 mb-2 text-center">{label || 'Choisir une couleur'}</p>
              <HexColorPicker color={color || '#2D5A3D'} onChange={onChange} />
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition font-medium"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function SliderControl({ label, value, onChange, min = 0, max = 100, step = 1, unit = 'px' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-green-400 font-mono">{value}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onChange(Math.max(min, value - step))}
          className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded transition"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-green-500"
        />
        <button 
          onClick={() => onChange(Math.min(max, value + step))}
          className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded transition"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function ToggleSwitch({ label, value, onChange, description }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm text-gray-300">{label}</span>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  )
}

function OptionCards({ options, value, onChange, columns = 4 }) {
  return (
    <div className={`grid grid-cols-${columns} gap-2`}>
      {options.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(opt.id)}
          className={`p-3 rounded-xl border transition text-center ${
            value === opt.id 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex justify-center mb-1">{opt.icon}</div>
          <span className="text-xs text-gray-400">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/50 hover:bg-gray-800 transition"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-gray-900/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION-SPECIFIC DESIGN EDITORS
// ═══════════════════════════════════════════════════════════════════════════

function HeaderDesign({ sectionData, styles, onStyleChange, theme }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#ffffff'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
        <ToggleSwitch
          label="Transparent"
          value={styles?.background?.transparent || false}
          onChange={(v) => onStyleChange('background', { ...styles?.background, transparent: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style du logo" icon={Type}>
        <div className="space-y-3">
          <div>
            <span className="text-xs text-gray-400 block mb-2">Taille</span>
            <OptionCards
              options={[
                { id: 'sm', label: 'Petit', icon: <span className="text-sm">A</span> },
                { id: 'md', label: 'Moyen', icon: <span className="text-base">A</span> },
                { id: 'lg', label: 'Grand', icon: <span className="text-lg">A</span> }
              ]}
              value={styles?.logo?.size || 'md'}
              onChange={(size) => onStyleChange('logo', { ...styles?.logo, size })}
              columns={3}
            />
          </div>
          <ColorPickerMini 
            label="Couleur"
            color={styles?.logo?.color || theme?.primaryColor} 
            onChange={(color) => onStyleChange('logo', { ...styles?.logo, color })}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Bouton CTA" icon={Box} defaultOpen={false}>
        <ColorPickerMini 
          label="Fond"
          color={styles?.ctaButton?.bgColor || theme?.primaryColor} 
          onChange={(color) => onStyleChange('ctaButton', { ...styles?.ctaButton, bgColor: color })}
        />
        <ColorPickerMini 
          label="Texte"
          color={styles?.ctaButton?.textColor || '#ffffff'} 
          onChange={(color) => onStyleChange('ctaButton', { ...styles?.ctaButton, textColor: color })}
        />
        <SliderControl
          label="Arrondi"
          value={styles?.ctaButton?.radius || 12}
          onChange={(radius) => onStyleChange('ctaButton', { ...styles?.ctaButton, radius })}
          min={0}
          max={30}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Comportement" icon={Sliders} defaultOpen={false}>
        <ToggleSwitch
          label="Header fixe au scroll"
          value={sectionData?.sticky !== false}
          description="Le header reste visible en haut"
        />
        <ToggleSwitch
          label="Ombre portée"
          value={styles?.shadow || false}
          onChange={(v) => onStyleChange('shadow', v)}
        />
      </CollapsibleSection>
    </div>
  )
}

function HeroDesign({ sectionData, styles, onStyleChange, theme }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#f9fafb'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
        <ToggleSwitch
          label="Image de fond"
          value={styles?.background?.hasImage || false}
          onChange={(v) => onStyleChange('background', { ...styles?.background, hasImage: v })}
        />
        {styles?.background?.hasImage && (
          <SliderControl
            label="Opacité overlay"
            value={styles?.background?.overlayOpacity || 50}
            onChange={(v) => onStyleChange('background', { ...styles?.background, overlayOpacity: v })}
            min={0}
            max={100}
            unit="%"
          />
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Style du badge" icon={Sparkles}>
        <ColorPickerMini 
          label="Fond"
          color={styles?.badge?.bgColor || theme?.primaryColor + '20'} 
          onChange={(color) => onStyleChange('badge', { ...styles?.badge, bgColor: color })}
        />
        <ColorPickerMini 
          label="Texte"
          color={styles?.badge?.textColor || theme?.primaryColor} 
          onChange={(color) => onStyleChange('badge', { ...styles?.badge, textColor: color })}
        />
        <SliderControl
          label="Arrondi"
          value={styles?.badge?.radius || 20}
          onChange={(radius) => onStyleChange('badge', { ...styles?.badge, radius })}
          min={4}
          max={30}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style du titre" icon={Type}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.title?.color || '#1f2937'} 
          onChange={(color) => onStyleChange('title', { ...styles?.title, color })}
        />
        <div>
          <span className="text-xs text-gray-400 block mb-2">Taille</span>
          <OptionCards
            options={[
              { id: 'md', label: 'Moyen', icon: <Type className="w-4 h-4" /> },
              { id: 'lg', label: 'Grand', icon: <Type className="w-5 h-5" /> },
              { id: 'xl', label: 'Très grand', icon: <Type className="w-6 h-6" /> }
            ]}
            value={styles?.title?.size || 'lg'}
            onChange={(size) => onStyleChange('title', { ...styles?.title, size })}
            columns={3}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Boutons" icon={Box} defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <span className="text-xs text-gray-400 block mb-2">Bouton principal</span>
            <div className="space-y-2 pl-2 border-l-2 border-green-500/30">
              <ColorPickerMini 
                label="Fond"
                color={styles?.primaryButton?.bgColor || theme?.primaryColor} 
                onChange={(color) => onStyleChange('primaryButton', { ...styles?.primaryButton, bgColor: color })}
              />
              <ColorPickerMini 
                label="Texte"
                color={styles?.primaryButton?.textColor || '#ffffff'} 
                onChange={(color) => onStyleChange('primaryButton', { ...styles?.primaryButton, textColor: color })}
              />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-2">Bouton secondaire</span>
            <div className="space-y-2 pl-2 border-l-2 border-gray-500/30">
              <ColorPickerMini 
                label="Bordure"
                color={styles?.secondaryButton?.borderColor || theme?.primaryColor} 
                onChange={(color) => onStyleChange('secondaryButton', { ...styles?.secondaryButton, borderColor: color })}
              />
              <ColorPickerMini 
                label="Texte"
                color={styles?.secondaryButton?.textColor || theme?.primaryColor} 
                onChange={(color) => onStyleChange('secondaryButton', { ...styles?.secondaryButton, textColor: color })}
              />
            </div>
          </div>
          <SliderControl
            label="Arrondi des boutons"
            value={styles?.buttonRadius || 12}
            onChange={(radius) => onStyleChange('buttonRadius', radius)}
            min={0}
            max={30}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Espacement" icon={Layout} defaultOpen={false}>
        <SliderControl
          label="Padding vertical"
          value={styles?.padding?.vertical || 80}
          onChange={(v) => onStyleChange('padding', { ...styles?.padding, vertical: v })}
          min={40}
          max={160}
        />
      </CollapsibleSection>
    </div>
  )
}

function ServicesDesign({ sectionData, styles, onStyleChange, theme }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#ffffff'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style des cartes" icon={Layers}>
        <div>
          <span className="text-xs text-gray-400 block mb-2">Preset de style</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'minimal', label: 'Minimal', desc: 'Bordure fine' },
              { id: 'shadow', label: 'Ombre', desc: 'Ombre portée' },
              { id: 'filled', label: 'Rempli', desc: 'Fond coloré' },
              { id: 'outlined', label: 'Outlined', desc: 'Bordure épaisse' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => onStyleChange('cardPreset', preset.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  styles?.cardPreset === preset.id 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-sm text-white block">{preset.label}</span>
                <span className="text-xs text-gray-500">{preset.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <SliderControl
          label="Arrondi"
          value={styles?.cardRadius || 16}
          onChange={(radius) => onStyleChange('cardRadius', radius)}
          min={0}
          max={32}
        />
        <ColorPickerMini 
          label="Fond carte"
          color={styles?.cardBg || '#ffffff'} 
          onChange={(color) => onStyleChange('cardBg', color)}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style des icônes" icon={Circle}>
        <div>
          <span className="text-xs text-gray-400 block mb-2">Forme</span>
          <OptionCards
            options={[
              { id: 'circle', label: 'Cercle', icon: <Circle className="w-4 h-4" /> },
              { id: 'rounded', label: 'Arrondi', icon: <RectangleHorizontal className="w-4 h-4" /> },
              { id: 'square', label: 'Carré', icon: <Square className="w-4 h-4" /> }
            ]}
            value={styles?.iconShape || 'rounded'}
            onChange={(shape) => onStyleChange('iconShape', shape)}
            columns={3}
          />
        </div>
        <ColorPickerMini 
          label="Fond"
          color={styles?.iconBgColor || theme?.primaryColor + '15'} 
          onChange={(color) => onStyleChange('iconBgColor', color)}
        />
        <ColorPickerMini 
          label="Icône"
          color={styles?.iconColor || theme?.primaryColor} 
          onChange={(color) => onStyleChange('iconColor', color)}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Disposition" icon={Grid3X3} defaultOpen={false}>
        <div>
          <span className="text-xs text-gray-400 block mb-2">Colonnes</span>
          <OptionCards
            options={[
              { id: 2, label: '2 cols', icon: <Grid2X2 className="w-4 h-4" /> },
              { id: 3, label: '3 cols', icon: <Grid3X3 className="w-4 h-4" /> },
              { id: 4, label: '4 cols', icon: <LayoutGrid className="w-4 h-4" /> }
            ]}
            value={styles?.columns || 4}
            onChange={(cols) => onStyleChange('columns', cols)}
            columns={3}
          />
        </div>
        <SliderControl
          label="Espacement"
          value={styles?.gap || 24}
          onChange={(gap) => onStyleChange('gap', gap)}
          min={12}
          max={48}
        />
      </CollapsibleSection>
    </div>
  )
}

function TestimonialsDesign({ sectionData, styles, onStyleChange, theme }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#ffffff'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style des cartes" icon={MessageSquare}>
        <ColorPickerMini 
          label="Fond carte"
          color={styles?.cardBg || '#f9fafb'} 
          onChange={(color) => onStyleChange('cardBg', color)}
        />
        <SliderControl
          label="Arrondi"
          value={styles?.cardRadius || 16}
          onChange={(radius) => onStyleChange('cardRadius', radius)}
          min={0}
          max={32}
        />
        <ToggleSwitch
          label="Bordure"
          value={styles?.cardBorder !== false}
          onChange={(v) => onStyleChange('cardBorder', v)}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Étoiles" icon={Star}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.starColor || theme?.secondaryColor || '#E5B94E'} 
          onChange={(color) => onStyleChange('starColor', color)}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Disposition" icon={Grid3X3} defaultOpen={false}>
        <div>
          <span className="text-xs text-gray-400 block mb-2">Layout</span>
          <OptionCards
            options={[
              { id: 'grid', label: 'Grille', icon: <Grid3X3 className="w-4 h-4" /> },
              { id: 'slider', label: 'Slider', icon: <RectangleHorizontal className="w-4 h-4" /> }
            ]}
            value={styles?.layout || 'grid'}
            onChange={(layout) => onStyleChange('layout', layout)}
            columns={2}
          />
        </div>
      </CollapsibleSection>
    </div>
  )
}

function FAQDesign({ sectionData, styles, onStyleChange, theme }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#f9fafb'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style accordéon" icon={HelpCircle}>
        <ColorPickerMini 
          label="Fond question"
          color={styles?.questionBg || '#ffffff'} 
          onChange={(color) => onStyleChange('questionBg', color)}
        />
        <ColorPickerMini 
          label="Texte question"
          color={styles?.questionColor || '#1f2937'} 
          onChange={(color) => onStyleChange('questionColor', color)}
        />
        <SliderControl
          label="Arrondi"
          value={styles?.radius || 16}
          onChange={(radius) => onStyleChange('radius', radius)}
          min={0}
          max={24}
        />
        <ToggleSwitch
          label="Bordure"
          value={styles?.border !== false}
          onChange={(v) => onStyleChange('border', v)}
        />
      </CollapsibleSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE DESIGN EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function ModuleDesign({ sectionData, styles, onStyleChange, theme, moduleName, moduleColor }) {
  const colorSchemes = {
    blue: { primary: '#3b82f6', light: '#dbeafe' },
    orange: { primary: '#f97316', light: '#ffedd5' }
  }
  const colors = colorSchemes[moduleColor] || colorSchemes.blue

  return (
    <div className="space-y-4">
      {/* Module Info Banner */}
      <div className={`p-3 rounded-xl border ${
        moduleColor === 'blue' 
          ? 'bg-blue-500/10 border-blue-500/20' 
          : 'bg-orange-500/10 border-orange-500/20'
      }`}>
        <p className={`text-sm font-medium ${
          moduleColor === 'blue' ? 'text-blue-400' : 'text-orange-400'
        }`}>
          📦 Module {moduleName}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Personnalisez l'apparence de ce module
        </p>
      </div>

      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#f9fafb'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Espacement" icon={Layout} defaultOpen={false}>
        <SliderControl
          label="Padding vertical"
          value={styles?.padding?.vertical || 80}
          onChange={(v) => onStyleChange('padding', { ...styles?.padding, vertical: v })}
          min={40}
          max={160}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Cartes" icon={Box} defaultOpen={false}>
        <ColorPickerMini 
          label="Fond carte"
          color={styles?.cardBg || '#ffffff'} 
          onChange={(color) => onStyleChange('cardBg', color)}
        />
        <SliderControl
          label="Arrondi"
          value={styles?.cardRadius || 16}
          onChange={(v) => onStyleChange('cardRadius', v)}
          min={0}
          max={32}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Couleur d'accent" icon={Sparkles} defaultOpen={false}>
        <ColorPickerMini 
          label="Accent"
          color={styles?.accentColor || theme?.primaryColor || '#2D5A3D'} 
          onChange={(color) => onStyleChange('accentColor', color)}
        />
        <p className="text-xs text-gray-500 mt-2">
          Utilisé pour les boutons et éléments interactifs
        </p>
      </CollapsibleSection>
    </div>
  )
}

function GenericDesign({ sectionData, styles, onStyleChange, theme, sectionName }) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Fond de section" icon={Palette}>
        <ColorPickerMini 
          label="Couleur"
          color={styles?.background?.color || '#f9fafb'} 
          onChange={(color) => onStyleChange('background', { ...styles?.background, color })}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Espacement" icon={Layout} defaultOpen={false}>
        <SliderControl
          label="Padding vertical"
          value={styles?.padding?.vertical || 80}
          onChange={(v) => onStyleChange('padding', { ...styles?.padding, vertical: v })}
          min={40}
          max={160}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Textes" icon={Type} defaultOpen={false}>
        <ColorPickerMini 
          label="Titre"
          color={styles?.titleColor || '#1f2937'} 
          onChange={(color) => onStyleChange('titleColor', color)}
        />
        <ColorPickerMini 
          label="Sous-titre"
          color={styles?.subtitleColor || '#6b7280'} 
          onChange={(color) => onStyleChange('subtitleColor', color)}
        />
        <div>
          <span className="text-xs text-gray-400 block mb-2">Alignement</span>
          <OptionCards
            options={[
              { id: 'left', label: 'Gauche', icon: <AlignLeft className="w-4 h-4" /> },
              { id: 'center', label: 'Centre', icon: <AlignCenter className="w-4 h-4" /> },
              { id: 'right', label: 'Droite', icon: <AlignRight className="w-4 h-4" /> }
            ]}
            value={styles?.textAlign || 'center'}
            onChange={(align) => onStyleChange('textAlign', align)}
            columns={3}
          />
        </div>
      </CollapsibleSection>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SectionDesignEditor() {
  const { schema, draftContent, activeSection, updateField } = useEditorContext()

  if (!schema || !draftContent || !activeSection) {
    return (
      <div className="p-6 text-center">
        <Palette className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500">Sélectionne une section pour modifier son design</p>
      </div>
    )
  }

  // Chercher dans les sections ET les modules
  let sectionSchema = schema.sections?.find(s => s.id === activeSection)
  let isModule = false
  
  if (!sectionSchema && schema.modules) {
    sectionSchema = schema.modules.find(m => m.id === activeSection)
    isModule = true
  }
  
  const sectionData = draftContent[activeSection] || {}
  const sectionStyles = sectionData.styles || {}
  const theme = draftContent.theme || {}

  // Handler pour mettre à jour les styles de la section
  const handleStyleChange = (key, value) => {
    const updatedStyles = { ...sectionStyles, [key]: value }
    updateField(activeSection, 'styles', updatedStyles)
  }

  // Render the appropriate design editor based on section
  const renderDesignEditor = () => {
    const props = {
      sectionData,
      styles: sectionStyles,
      onStyleChange: handleStyleChange,
      theme
    }

    switch (activeSection) {
      case 'header':
        return <HeaderDesign {...props} />
      case 'hero':
        return <HeroDesign {...props} />
      case 'services':
        return <ServicesDesign {...props} />
      case 'testimonials':
        return <TestimonialsDesign {...props} />
      case 'faq':
        return <FAQDesign {...props} />
      // Modules
      case 'booking':
        return <ModuleDesign {...props} moduleName="Réservation" moduleColor="blue" />
      case 'ecommerce':
        return <ModuleDesign {...props} moduleName="E-commerce" moduleColor="orange" />
      case 'about':
      case 'cta':
      case 'contact':
      case 'footer':
      default:
        return <GenericDesign {...props} sectionName={activeSection} />
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Section Header */}
      <div className={`sticky top-0 z-10 px-4 py-3 backdrop-blur border-b ${
        isModule 
          ? 'bg-purple-900/95 border-purple-700' 
          : 'bg-gray-900/95 border-gray-700'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isModule 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              Design : {sectionSchema?.name || activeSection}
              {isModule && (
                <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                  MODULE
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">Personnalisez l'apparence de cette section</p>
          </div>
        </div>
      </div>

      {/* Design Options */}
      <div className="p-4 space-y-4">
        {renderDesignEditor()}
      </div>
    </div>
  )
}
