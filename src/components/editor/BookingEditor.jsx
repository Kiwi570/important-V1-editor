// ═══════════════════════════════════════════════════════════════════════════
// BOOKING EDITOR - Re-export depuis le nouveau chemin
// ═══════════════════════════════════════════════════════════════════════════

// Re-export le module editor depuis son nouveau chemin
export { default } from '../modules/booking/BookingEditor'

// Re-export les composants partagés pour compatibilité
export {
  CollapsibleSection,
  TextField,
  TextareaField,
  ToggleField,
  SelectField,
  ColorPickerInline
} from '../modules/shared'
