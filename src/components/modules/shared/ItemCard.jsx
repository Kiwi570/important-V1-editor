import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { GripVertical, ChevronDown, MoreVertical, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ITEM CARD - Composant de carte générique réutilisable
// ═══════════════════════════════════════════════════════════════════════════

export function ItemCard({
  // Identité
  id,
  
  // Header display
  icon,           // Nom de l'icône Lucide ou null
  iconColor,      // Couleur de l'icône
  image,          // URL image (prioritaire sur icon)
  title,          // Titre principal
  subtitle,       // Sous-titre ou méta info
  badge,          // { label, color } ou null
  rightContent,   // Contenu à droite (ex: prix)
  
  // État
  isExpanded: controlledExpanded,
  onExpandedChange,
  defaultExpanded = false,
  
  // Actions
  onDuplicate,
  onDelete,
  onVisibilityToggle,
  isVisible = true,
  
  // Drag
  isDraggable = true,
  dragHandleProps,
  
  // Contenu expandé
  children,
  
  // Style
  variant = 'default', // 'default' | 'compact' | 'card'
  className = ''
}) {
  // État local si non contrôlé
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded)
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded
  const setIsExpanded = onExpandedChange || setLocalExpanded

  // Icône
  const IconComponent = icon ? (LucideIcons[icon] || LucideIcons.Star) : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ${
        !isVisible ? 'opacity-50' : ''
      } ${className}`}
    >
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700/30 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Drag Handle */}
        {isDraggable && (
          <div 
            className="text-gray-600 cursor-grab hover:text-gray-400 transition"
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        
        {/* Icon or Image */}
        {(image || IconComponent) && (
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: image ? undefined : `${iconColor || '#8b5cf6'}15` }}
          >
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : IconComponent ? (
              <IconComponent className="w-5 h-5" style={{ color: iconColor || '#8b5cf6' }} />
            ) : null}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white truncate">{title || 'Sans titre'}</p>
            {badge && (
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium"
                style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
              >
                {badge.label}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right Content (prix, etc.) */}
        {rightContent && (
          <div className="flex-shrink-0 text-right">
            {rightContent}
          </div>
        )}

        {/* Expand Arrow */}
        {children && (
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }} 
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        )}
      </div>

      {/* ═══════════════════ EXPANDED CONTENT ═══════════════════ */}
      <AnimatePresence>
        {isExpanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 space-y-4 border-t border-gray-700/50">
              {children}
              
              {/* Actions Footer */}
              {(onDuplicate || onDelete || onVisibilityToggle) && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                  <div className="flex gap-1">
                    {onVisibilityToggle && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onVisibilityToggle() }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {isVisible ? 'Masquer' : 'Afficher'}
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate() }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                      >
                        <Copy className="w-3.5 h-3.5" /> Dupliquer
                      </button>
                    )}
                  </div>
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete() }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SORTABLE LIST - Wrapper pour liste réordonnable
// ═══════════════════════════════════════════════════════════════════════════

export function SortableList({
  items,
  onReorder,
  keyExtractor = (item) => item.id,
  renderItem,
  className = ''
}) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={`space-y-2 ${className}`}
    >
      {items.map((item, index) => (
        <Reorder.Item
          key={keyExtractor(item)}
          value={item}
          className="cursor-default"
        >
          {renderItem(item, index)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ADD ITEM BUTTON
// ═══════════════════════════════════════════════════════════════════════════

export function AddItemButton({ onClick, label = 'Ajouter un élément', icon: Icon }) {
  const PlusIcon = Icon || LucideIcons.Plus
  
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 mt-2 border-2 border-dashed 
        border-gray-700 hover:border-purple-500/50 rounded-xl text-gray-400 hover:text-purple-400 transition"
    >
      <PlusIcon className="w-4 h-4" />
      {label}
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════

export function EmptyState({ 
  icon: Icon = LucideIcons.Package, 
  title = 'Aucun élément',
  description = 'Commencez par ajouter un élément',
  action,
  actionLabel = 'Ajouter'
}) {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-600" />
      </div>
      <h4 className="text-gray-400 font-medium mb-1">{title}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
