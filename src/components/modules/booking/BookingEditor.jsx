import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useEditorContext } from '../../../pages/Editor'
import * as LucideIcons from 'lucide-react'
import {
  Type, Sparkles, Clock, Eye, MessageCircle, Check, Award, Palette,
  Plus, GripVertical, ChevronDown
} from 'lucide-react'

// Import des composants partagés
import {
  PRESET_COLORS,
  MODULE_ICONS,
  DURATION_OPTIONS,
  CollapsibleSection,
  TextField,
  TextareaField,
  ToggleField,
  SelectField,
  IconPicker,
  ColorPickerInline,
  PriceEditor,
  DurationSelector,
  ItemCard,
  AddItemButton,
  EmptyState
} from '../shared'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES SPÉCIFIQUES BOOKING
// ═══════════════════════════════════════════════════════════════════════════

const DAYS = [
  { id: 'monday', label: 'Lundi', short: 'Lun' },
  { id: 'tuesday', label: 'Mardi', short: 'Mar' },
  { id: 'wednesday', label: 'Mercredi', short: 'Mer' },
  { id: 'thursday', label: 'Jeudi', short: 'Jeu' },
  { id: 'friday', label: 'Vendredi', short: 'Ven' },
  { id: 'saturday', label: 'Samedi', short: 'Sam' },
  { id: 'sunday', label: 'Dimanche', short: 'Dim' }
]

const GUARANTEE_ICONS = ['Shield', 'Clock', 'Star', 'Check', 'Heart', 'Award', 'Zap', 'ThumbsUp']

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE EDITOR - Éditeur individuel de service
// ═══════════════════════════════════════════════════════════════════════════

function ServiceEditor({ service, onUpdate, onDelete, onDuplicate }) {
  const handleChange = (field, value) => {
    onUpdate({ ...service, [field]: value })
  }

  const handlePriceChange = ({ price, originalPrice, priceLabel }) => {
    onUpdate({ 
      ...service, 
      price, 
      originalPrice,
      priceLabel 
    })
  }

  return (
    <ItemCard
      id={service.id}
      icon={service.icon}
      iconColor={service.color}
      title={service.name || 'Nouveau service'}
      subtitle={`${service.duration || 30} min • ${service.priceLabel || 'Gratuit'}`}
      badge={service.popular ? { label: '⭐ Populaire', color: '#f59e0b' } : null}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    >
      {/* Row 1: Icon & Color */}
      <div className="flex gap-4">
        <IconPicker 
          value={service.icon} 
          onChange={(v) => handleChange('icon', v)} 
          icons={MODULE_ICONS}
        />
        <div className="flex-1">
          <ColorPickerInline
            label="Couleur"
            value={service.color}
            onChange={(v) => handleChange('color', v)}
            presets={PRESET_COLORS}
          />
        </div>
      </div>

      {/* Row 2: Name */}
      <TextField
        label="Nom du service"
        value={service.name}
        onChange={(v) => handleChange('name', v)}
        placeholder="Ex: Séance découverte"
      />

      {/* Row 3: Duration & Price */}
      <div className="grid grid-cols-2 gap-3">
        <DurationSelector
          value={service.duration}
          onChange={(v) => handleChange('duration', v)}
        />
        <PriceEditor
          price={service.price || 0}
          originalPrice={service.originalPrice}
          priceLabel={service.priceLabel}
          onChange={handlePriceChange}
        />
      </div>

      {/* Row 4: Description */}
      <TextareaField
        label="Description"
        value={service.description}
        onChange={(v) => handleChange('description', v)}
        placeholder="Décrivez ce service en quelques mots..."
        rows={2}
      />

      {/* Row 5: Popular toggle */}
      <ToggleField
        label="Marquer comme populaire"
        description="Affiche un badge ⭐ sur ce service"
        value={service.popular}
        onChange={(v) => handleChange('popular', v)}
      />
    </ItemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICES LIST - Liste des services avec drag & drop
// ═══════════════════════════════════════════════════════════════════════════

function ServicesList({ services, onChange }) {
  const handleUpdate = (index, updatedService) => {
    const newServices = [...services]
    newServices[index] = updatedService
    onChange(newServices)
  }

  const handleDelete = (index) => {
    onChange(services.filter((_, i) => i !== index))
  }

  const handleDuplicate = (index) => {
    const duplicate = { ...services[index], id: `b${Date.now()}` }
    const newServices = [...services]
    newServices.splice(index + 1, 0, duplicate)
    onChange(newServices)
  }

  const handleAdd = () => {
    const colors = PRESET_COLORS
    const newService = {
      id: `b${Date.now()}`,
      name: 'Nouveau service',
      icon: 'Star',
      duration: 60,
      price: 50,
      priceLabel: '50 €',
      description: 'Description de votre nouveau service',
      color: colors[services.length % colors.length],
      popular: false
    }
    onChange([...services, newService])
  }

  const handleReorder = (newOrder) => {
    onChange(newOrder)
  }

  if (!services?.length) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Aucun service"
        description="Ajoutez votre premier service"
        action={handleAdd}
        actionLabel="Ajouter un service"
      />
    )
  }

  return (
    <div className="space-y-2">
      <Reorder.Group axis="y" values={services} onReorder={handleReorder} className="space-y-2">
        {services.map((service, index) => (
          <Reorder.Item key={service.id} value={service}>
            <ServiceEditor
              service={service}
              onUpdate={(s) => handleUpdate(index, s)}
              onDelete={() => handleDelete(index)}
              onDuplicate={() => handleDuplicate(index)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      <AddItemButton onClick={handleAdd} label="Ajouter un service" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// OPENING HOURS EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function OpeningHoursEditor({ hours, onChange }) {
  const handleDayChange = (dayId, field, value) => {
    onChange({
      ...hours,
      [dayId]: {
        ...hours?.[dayId],
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-1">
      {DAYS.map((day) => {
        const dayHours = hours?.[day.id] || { enabled: false, start: '09:00', end: '18:00' }
        
        return (
          <div 
            key={day.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition ${
              dayHours.enabled ? 'bg-gray-800/50' : 'opacity-50'
            }`}
          >
            <button
              onClick={() => handleDayChange(day.id, 'enabled', !dayHours.enabled)}
              className={`w-9 h-5 rounded-full transition flex-shrink-0 ${
                dayHours.enabled ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: dayHours.enabled ? 17 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            
            <span className="w-12 text-xs font-medium text-gray-300">{day.short}</span>
            
            {dayHours.enabled ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="time"
                  value={dayHours.start || '09:00'}
                  onChange={(e) => handleDayChange(day.id, 'start', e.target.value)}
                  className="px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs w-[4.5rem]"
                />
                <span className="text-gray-500 text-xs">→</span>
                <input
                  type="time"
                  value={dayHours.end || '18:00'}
                  onChange={(e) => handleDayChange(day.id, 'end', e.target.value)}
                  className="px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs w-[4.5rem]"
                />
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic">Fermé</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FORM FIELDS EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function FormFieldsEditor({ fields, onChange }) {
  const FIELD_CONFIG = [
    { id: 'firstName', label: 'Prénom', defaultLabel: 'Prénom' },
    { id: 'lastName', label: 'Nom', defaultLabel: 'Nom' },
    { id: 'email', label: 'Email', defaultLabel: 'Email' },
    { id: 'phone', label: 'Téléphone', defaultLabel: 'Téléphone' },
    { id: 'message', label: 'Message', defaultLabel: 'Message (optionnel)' }
  ]

  const handleFieldChange = (fieldId, prop, value) => {
    onChange({
      ...fields,
      [fieldId]: {
        ...fields?.[fieldId],
        [prop]: value
      }
    })
  }

  return (
    <div className="space-y-2">
      {FIELD_CONFIG.map(field => {
        const fieldData = fields?.[field.id] || { show: true, required: field.id !== 'message', label: field.defaultLabel }
        
        return (
          <div 
            key={field.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition ${
              fieldData.show ? 'bg-gray-800/50' : 'opacity-50'
            }`}
          >
            <button
              onClick={() => handleFieldChange(field.id, 'show', !fieldData.show)}
              className={`w-9 h-5 rounded-full transition flex-shrink-0 ${
                fieldData.show ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: fieldData.show ? 17 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            
            <input
              type="text"
              value={fieldData.label || field.defaultLabel}
              onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
              className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs"
              disabled={!fieldData.show}
            />
            
            {fieldData.show && (
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={fieldData.required}
                  onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-900 text-purple-500 focus:ring-purple-500"
                />
                Requis
              </label>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARANTEES EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function GuaranteesEditor({ guarantees, onChange }) {
  const handleUpdate = (index, field, value) => {
    const newGuarantees = [...(guarantees || [])]
    newGuarantees[index] = { ...newGuarantees[index], [field]: value }
    onChange(newGuarantees)
  }

  const handleAdd = () => {
    onChange([...(guarantees || []), { icon: 'Check', text: 'Nouvelle garantie' }])
  }

  const handleDelete = (index) => {
    onChange(guarantees.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {guarantees?.map((g, index) => {
        const Icon = LucideIcons[g.icon] || LucideIcons.Check
        return (
          <div key={index} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
            <select
              value={g.icon}
              onChange={(e) => handleUpdate(index, 'icon', e.target.value)}
              className="px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs w-24"
            >
              {GUARANTEE_ICONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <input
              type="text"
              value={g.text}
              onChange={(e) => handleUpdate(index, 'text', e.target.value)}
              className="flex-1 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs"
              placeholder="Texte de la garantie"
            />
            <button
              onClick={() => handleDelete(index)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LucideIcons.Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
      <AddItemButton onClick={handleAdd} label="Ajouter une garantie" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BOOKING MODULE EDITOR
// ═══════════════════════════════════════════════════════════════════════════

export default function BookingModuleEditor() {
  const { draftContent, updateField } = useEditorContext()
  const data = draftContent?.booking || {}
  const styles = data.styles || {}

  const handleUpdate = (field, value) => {
    updateField('booking', field, value)
  }

  const handleStyleUpdate = (field, value) => {
    updateField('booking', 'styles', { ...styles, [field]: value })
  }

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HEADER / TEXTES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="En-tête" icon={Type} badge="Textes">
        <TextField
          label="Titre principal"
          value={data.title}
          onChange={(v) => handleUpdate('title', v)}
          placeholder="Réservez votre moment bien-être"
        />
        <TextareaField
          label="Sous-titre"
          value={data.subtitle}
          onChange={(v) => handleUpdate('subtitle', v)}
          placeholder="Choisissez votre prestation..."
          rows={2}
        />
        <TextField
          label="Badge (optionnel)"
          value={data.badge}
          onChange={(v) => handleUpdate('badge', v)}
          placeholder="✨ Réservation instantanée"
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* SERVICES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Services" icon={Sparkles} badge={`${data.services?.length || 0}`}>
        <ServicesList
          services={data.services || []}
          onChange={(v) => handleUpdate('services', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HORAIRES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Horaires d'ouverture" icon={Clock} defaultOpen={false}>
        <OpeningHoursEditor
          hours={data.openingHours}
          onChange={(v) => handleUpdate('openingHours', v)}
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 Les créneaux seront générés selon ces horaires
        </p>
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* OPTIONS D'AFFICHAGE */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Options d'affichage" icon={Eye} defaultOpen={false}>
        <ToggleField
          label="Afficher les étapes"
          description="Barre de progression 1-2-3"
          value={data.showSteps !== false}
          onChange={(v) => handleUpdate('showSteps', v)}
        />
        <ToggleField
          label="Afficher le calendrier"
          value={data.showCalendar !== false}
          onChange={(v) => handleUpdate('showCalendar', v)}
        />
        <ToggleField
          label="Afficher les créneaux"
          value={data.showTimeSlots !== false}
          onChange={(v) => handleUpdate('showTimeSlots', v)}
        />
        <ToggleField
          label="Afficher les garanties"
          description="Ex: Paiement sur place, Annulation gratuite..."
          value={data.showGuarantees !== false}
          onChange={(v) => handleUpdate('showGuarantees', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* FORMULAIRE */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Formulaire de contact" icon={MessageCircle} defaultOpen={false}>
        <TextField
          label="Titre du formulaire"
          value={data.formTitle}
          onChange={(v) => handleUpdate('formTitle', v)}
          placeholder="Vos coordonnées"
        />
        <TextField
          label="Sous-titre"
          value={data.formSubtitle}
          onChange={(v) => handleUpdate('formSubtitle', v)}
          placeholder="Pour confirmer votre réservation"
        />
        <div className="pt-2">
          <label className="block text-xs text-gray-400 mb-2">Champs du formulaire</label>
          <FormFieldsEditor
            fields={data.fields}
            onChange={(v) => handleUpdate('fields', v)}
          />
        </div>
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* BOUTON & CONFIRMATION */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Bouton & Confirmation" icon={Check} defaultOpen={false}>
        <TextField
          label="Texte du bouton"
          value={data.buttonText}
          onChange={(v) => handleUpdate('buttonText', v)}
          placeholder="Confirmer ma réservation"
        />
        <div className="border-t border-gray-700/50 pt-3 mt-3">
          <p className="text-xs text-gray-400 mb-2">Message de confirmation</p>
          <TextField
            label="Titre"
            value={data.confirmationTitle}
            onChange={(v) => handleUpdate('confirmationTitle', v)}
            placeholder="Réservation confirmée ! 🎉"
          />
          <TextareaField
            label="Message"
            value={data.confirmationMessage}
            onChange={(v) => handleUpdate('confirmationMessage', v)}
            placeholder="Merci pour votre confiance..."
            rows={2}
          />
        </div>
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* GARANTIES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Garanties" icon={Award} defaultOpen={false}>
        <GuaranteesEditor
          guarantees={data.guarantees}
          onChange={(v) => handleUpdate('guarantees', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* DESIGN (STYLES) */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Design" icon={Palette} defaultOpen={false}>
        <ColorPickerInline
          label="Couleur de fond"
          value={styles.background?.color}
          onChange={(v) => handleStyleUpdate('background', { ...styles.background, color: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Rayon des cartes"
            value={styles.cardRadius || 20}
            onChange={(v) => handleStyleUpdate('cardRadius', parseInt(v))}
            options={[
              { value: 8, label: 'Petit (8px)' },
              { value: 12, label: 'Moyen (12px)' },
              { value: 16, label: 'Large (16px)' },
              { value: 20, label: 'Extra (20px)' },
              { value: 24, label: 'XXL (24px)' }
            ]}
          />
          <SelectField
            label="Ombre des cartes"
            value={styles.cardShadow || 'lg'}
            onChange={(v) => handleStyleUpdate('cardShadow', v)}
            options={[
              { value: 'none', label: 'Aucune' },
              { value: 'sm', label: 'Légère' },
              { value: 'md', label: 'Moyenne' },
              { value: 'lg', label: 'Prononcée' },
              { value: 'xl', label: 'Extra' }
            ]}
          />
        </div>
        <ToggleField
          label="Effet au survol"
          description="Animation des cartes au hover"
          value={styles.cardHoverEffect !== false}
          onChange={(v) => handleStyleUpdate('cardHoverEffect', v)}
        />
      </CollapsibleSection>
    </div>
  )
}
