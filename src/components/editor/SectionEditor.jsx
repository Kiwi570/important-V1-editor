import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorContext } from '../../pages/Editor'
import {
  ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2, Copy, GripVertical,
  Type, Link as LinkIcon, Image, Hash, Star, ToggleLeft, List
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// FIELD EDITORS
// ═══════════════════════════════════════════════════════════════════════════

function TextField({ value, onChange, label, placeholder, maxLength }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition"
      />
      {maxLength && (
        <p className="text-xs text-gray-600 mt-1 text-right">{(value || '').length}/{maxLength}</p>
      )}
    </div>
  )
}

function TextareaField({ value, onChange, label, placeholder, maxLength }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition resize-none"
      />
      {maxLength && (
        <p className="text-xs text-gray-600 mt-1 text-right">{(value || '').length}/{maxLength}</p>
      )}
    </div>
  )
}

function ToggleField({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-gray-300">{label}</label>
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

function ButtonField({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false)
  const btn = value || { text: '', url: '' }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 hover:bg-gray-750 transition"
      >
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{btn.text || 'Non défini'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3 bg-gray-850">
              <TextField
                label="Texte"
                value={btn.text}
                onChange={(text) => onChange({ ...btn, text })}
                placeholder="Ex: Découvrir"
              />
              <TextField
                label="Lien (URL)"
                value={btn.url}
                onChange={(url) => onChange({ ...btn, url })}
                placeholder="Ex: #contact"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ITEM EDITOR (for arrays like services, testimonials, etc.)
// ═══════════════════════════════════════════════════════════════════════════

function ItemEditor({ item, index, type, onUpdate, onDelete, onDuplicate }) {
  const [isOpen, setIsOpen] = useState(false)

  // Determine fields based on type
  const getItemTitle = () => {
    if (type === 'services') return item.name || `Service ${index + 1}`
    if (type === 'testimonials') return item.author || `Témoignage ${index + 1}`
    if (type === 'faq') return item.question?.slice(0, 30) || `Question ${index + 1}`
    if (type === 'values') return item.title || `Valeur ${index + 1}`
    if (type === 'stats') return item.label || `Stat ${index + 1}`
    if (type === 'socials') return item.platform || `Réseau ${index + 1}`
    if (type === 'legalLinks') return item.label || `Lien ${index + 1}`
    if (type === 'locations') return typeof item === 'string' ? item : (item.name || `Zone ${index + 1}`)
    return `Item ${index + 1}`
  }

  const renderFields = () => {
    switch (type) {
      case 'services':
        return (
          <>
            <TextField label="Nom" value={item.name} onChange={(v) => onUpdate({ ...item, name: v })} />
            <TextField label="Tagline" value={item.tagline} onChange={(v) => onUpdate({ ...item, tagline: v })} />
            <TextareaField label="Description" value={item.description} onChange={(v) => onUpdate({ ...item, description: v })} />
            <TextField label="Prix" value={item.price} onChange={(v) => onUpdate({ ...item, price: v })} />
            <TextField label="Icône" value={item.icon} onChange={(v) => onUpdate({ ...item, icon: v })} placeholder="Ex: Rocket, Star, Heart" />
          </>
        )
      case 'testimonials':
        return (
          <>
            <TextareaField label="Citation" value={item.quote} onChange={(v) => onUpdate({ ...item, quote: v })} />
            <TextField label="Auteur" value={item.author} onChange={(v) => onUpdate({ ...item, author: v })} />
            <TextField label="Rôle" value={item.role} onChange={(v) => onUpdate({ ...item, role: v })} />
            <TextField label="Entreprise" value={item.company} onChange={(v) => onUpdate({ ...item, company: v })} />
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Note</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onUpdate({ ...item, rating: star })}
                    className={`p-1 ${item.rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )
      case 'faq':
        return (
          <>
            <TextField label="Question" value={item.question} onChange={(v) => onUpdate({ ...item, question: v })} />
            <TextareaField label="Réponse" value={item.answer} onChange={(v) => onUpdate({ ...item, answer: v })} />
          </>
        )
      case 'values':
        return (
          <>
            <TextField label="Titre" value={item.title} onChange={(v) => onUpdate({ ...item, title: v })} />
            <TextField label="Description" value={item.description} onChange={(v) => onUpdate({ ...item, description: v })} />
            <TextField label="Icône" value={item.icon} onChange={(v) => onUpdate({ ...item, icon: v })} placeholder="Ex: Heart, Users" />
          </>
        )
      case 'stats':
        return (
          <>
            <TextField label="Valeur" value={item.value} onChange={(v) => onUpdate({ ...item, value: v })} placeholder="Ex: 100+" />
            <TextField label="Label" value={item.label} onChange={(v) => onUpdate({ ...item, label: v })} placeholder="Ex: Clients satisfaits" />
          </>
        )
      case 'socials':
        return (
          <>
            <TextField label="Plateforme" value={item.platform} onChange={(v) => onUpdate({ ...item, platform: v })} placeholder="Ex: LinkedIn" />
            <TextField label="URL" value={item.url} onChange={(v) => onUpdate({ ...item, url: v })} placeholder="https://..." />
            <TextField label="Icône" value={item.icon} onChange={(v) => onUpdate({ ...item, icon: v })} placeholder="Ex: Linkedin, Twitter" />
          </>
        )
      case 'legalLinks':
        return (
          <>
            <TextField label="Label" value={item.label} onChange={(v) => onUpdate({ ...item, label: v })} placeholder="Ex: Mentions légales" />
            <TextField label="URL" value={item.url} onChange={(v) => onUpdate({ ...item, url: v })} placeholder="Ex: /mentions-legales" />
          </>
        )
      case 'locations':
        return (
          <>
            <TextField label="Ville/Zone" value={typeof item === 'string' ? item : item.name} onChange={(v) => onUpdate(v)} placeholder="Ex: Paris" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800">
        <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between"
        >
          <span className="text-sm text-gray-300">{getItemTitle()}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        <button onClick={onDuplicate} className="p-1 text-gray-500 hover:text-blue-400 transition">
          <Copy className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-400 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3 bg-gray-850">
              {renderFields()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SECTION EDITOR
// ═══════════════════════════════════════════════════════════════════════════

export default function SectionEditor() {
  const { schema, draftContent, activeSection, updateField } = useEditorContext()

  if (!schema || !draftContent || !activeSection) {
    return (
      <div className="p-4 text-center text-gray-500">
        Sélectionne une section pour l'éditer
      </div>
    )
  }

  const sectionSchema = schema.sections?.find(s => s.id === activeSection)
  const sectionData = draftContent[activeSection] || {}

  if (!sectionSchema) {
    return (
      <div className="p-4 text-center text-gray-500">
        Section non trouvée
      </div>
    )
  }

  // Handle field update
  const handleFieldUpdate = (fieldId, value) => {
    updateField(activeSection, fieldId, value)
  }

  // Handle items update
  const handleItemUpdate = (fieldId, index, updatedItem) => {
    const items = [...(sectionData[fieldId] || [])]
    items[index] = updatedItem
    updateField(activeSection, fieldId, items)
  }

  const handleItemAdd = (fieldId, type) => {
    const items = [...(sectionData[fieldId] || [])]
    const newItem = { id: `item-${Date.now()}` }
    
    // Add default fields based on type
    if (type === 'services') {
      Object.assign(newItem, { icon: 'Star', name: 'Nouveau service', tagline: '', description: '', price: '' })
    } else if (type === 'testimonials') {
      Object.assign(newItem, { quote: '', author: '', role: '', company: '', rating: 5 })
    } else if (type === 'faq') {
      Object.assign(newItem, { question: '', answer: '' })
    } else if (type === 'values') {
      Object.assign(newItem, { icon: 'Star', title: '', description: '' })
    } else if (type === 'stats') {
      Object.assign(newItem, { value: '', label: '' })
    } else if (type === 'socials') {
      Object.assign(newItem, { platform: '', url: '', icon: 'Link' })
    } else if (type === 'legalLinks') {
      Object.assign(newItem, { label: '', url: '' })
    } else if (type === 'locations') {
      // For locations, we just push a string
      items.push('Nouvelle zone')
      updateField(activeSection, fieldId, items)
      return
    }
    
    items.push(newItem)
    updateField(activeSection, fieldId, items)
  }

  const handleItemDelete = (fieldId, index) => {
    const items = [...(sectionData[fieldId] || [])]
    items.splice(index, 1)
    updateField(activeSection, fieldId, items)
  }

  const handleItemDuplicate = (fieldId, index) => {
    const items = [...(sectionData[fieldId] || [])]
    const duplicate = { ...items[index], id: `item-${Date.now()}` }
    items.splice(index + 1, 0, duplicate)
    updateField(activeSection, fieldId, items)
  }

  // Determine item type from section
  const getItemType = (sectionId, fieldId) => {
    if (fieldId === 'items') {
      if (sectionId === 'services') return 'services'
      if (sectionId === 'testimonials') return 'testimonials'
      if (sectionId === 'faq') return 'faq'
    }
    if (fieldId === 'values') return 'values'
    if (fieldId === 'stats') return 'stats'
    if (fieldId === 'socials') return 'socials'
    if (fieldId === 'legalLinks') return 'legalLinks'
    if (fieldId === 'locations') return 'locations'
    return 'generic'
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Section Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sectionSchema.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{sectionSchema.name}</h3>
              <p className="text-xs text-gray-500">{activeSection}</p>
            </div>
          </div>
          <ToggleField
            value={sectionData.enabled !== false}
            onChange={(v) => handleFieldUpdate('enabled', v)}
            label=""
          />
        </div>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4">
        {sectionSchema.fields?.map((field) => {
          // Skip enabled field (handled in header)
          if (field.id === 'enabled') return null

          const value = sectionData[field.id]

          switch (field.type) {
            case 'text':
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(v) => handleFieldUpdate(field.id, v)}
                  maxLength={field.maxLength}
                />
              )
            case 'textarea':
              return (
                <TextareaField
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(v) => handleFieldUpdate(field.id, v)}
                  maxLength={field.maxLength}
                />
              )
            case 'toggle':
              return (
                <ToggleField
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(v) => handleFieldUpdate(field.id, v)}
                />
              )
            case 'button':
              return (
                <ButtonField
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(v) => handleFieldUpdate(field.id, v)}
                />
              )
            case 'array':
              const itemType = getItemType(activeSection, field.id)
              const items = value || []
              return (
                <div key={field.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">{field.label}</label>
                    <button
                      onClick={() => handleItemAdd(field.id, itemType)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition"
                    >
                      <Plus className="w-3 h-3" />
                      Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <ItemEditor
                        key={item.id || index}
                        item={item}
                        index={index}
                        type={itemType}
                        onUpdate={(updated) => handleItemUpdate(field.id, index, updated)}
                        onDelete={() => handleItemDelete(field.id, index)}
                        onDuplicate={() => handleItemDuplicate(field.id, index)}
                      />
                    ))}
                  </div>
                </div>
              )
            case 'menuItems':
              // Simplified menu items editor
              return (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">{field.label}</label>
                  {(value || []).map((item, index) => (
                    <div key={item.id || index} className="flex gap-2">
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => {
                          const items = [...(value || [])]
                          items[index] = { ...items[index], label: e.target.value }
                          handleFieldUpdate(field.id, items)
                        }}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => {
                          const items = [...(value || [])]
                          items[index] = { ...items[index], url: e.target.value }
                          handleFieldUpdate(field.id, items)
                        }}
                        className="w-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                        placeholder="#section"
                      />
                    </div>
                  ))}
                </div>
              )
            case 'email':
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  value={value}
                  onChange={(v) => handleFieldUpdate(field.id, v)}
                />
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
