import { useEditorContext } from '../../pages/Editor'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { Leaf, ArrowRight, Star, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const getIcon = (name, className = "w-5 h-5", style = {}) => {
  const IconComponent = LucideIcons[name]
  return IconComponent ? <IconComponent className={className} style={style} /> : <Star className={className} style={style} />
}

const resolveColor = (colorValue, theme, fallback = null) => {
  if (colorValue === 'theme') return theme?.primaryColor || '#2D5A3D'
  if (colorValue === 'secondary') return theme?.secondaryColor || '#E5B94E'
  if (colorValue === 'transparent') return 'transparent'
  if (!colorValue) return fallback || '#2D5A3D'
  return colorValue
}

const getContrastColor = (bgColor) => {
  if (!bgColor || bgColor === 'transparent') return '#1f2937'
  try {
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#1f2937' : '#ffffff'
  } catch { return '#1f2937' }
}

const lightenColor = (color, amount = 0.9) => {
  if (!color || color === 'transparent') return '#f9fafb'
  try {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const newR = Math.round(r + (255 - r) * amount)
    const newG = Math.round(g + (255 - g) * amount)
    const newB = Math.round(b + (255 - b) * amount)
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  } catch { return '#f9fafb' }
}

// ═══════════════════════════════════════════════════════════════════════════
// EDITABLE WRAPPER - Click-to-Edit Component (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════

function EditableElement({ section, field, label, children, className = "", itemIndex = null }) {
  const { clickToEditEnabled, selectedElement, onElementClick, draftContent } = useEditorContext()
  
  if (!clickToEditEnabled) {
    return <div className={className}>{children}</div>
  }

  const isSelected = selectedElement?.section === section && 
                     selectedElement?.field === field &&
                     selectedElement?.itemIndex === itemIndex

  const handleClick = (e) => {
    e.stopPropagation()
    
    // Get current value
    let currentValue = draftContent?.[section]?.[field]
    if (itemIndex !== null && Array.isArray(currentValue)) {
      currentValue = currentValue[itemIndex]
    }
    
    onElementClick({
      section,
      field,
      label,
      currentValue: typeof currentValue === 'object' ? JSON.stringify(currentValue) : currentValue,
      itemIndex
    })
  }

  return (
    <div
      onClick={handleClick}
      className={`
        relative cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-white rounded-lg' 
          : 'hover:ring-2 hover:ring-green-400/50 hover:ring-offset-1 hover:ring-offset-white rounded-lg'
        }
        ${className}
      `}
      data-editable="true"
      data-section={section}
      data-field={field}
    >
      {/* Edit Label on Hover */}
      <div className={`
        absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded
        whitespace-nowrap z-50 pointer-events-none transition-opacity
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        ✏️ {label}
      </div>
      
      {children}
      
      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-50"
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewHeader({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.transparent ? 'transparent' : (sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#ffffff'))
  const titleColor = getContrastColor(bgColor)
  const btnRadius = sectionStyles.ctaButton?.radius || styles?.buttons?.borderRadius || 12
  const btnBgColor = sectionStyles.ctaButton?.bgColor || primary
  const btnTextColor = sectionStyles.ctaButton?.textColor || '#ffffff'
  const hasShadow = sectionStyles.shadow
  
  return (
    <header 
      className={`border-b border-gray-100 py-3 px-4 sticky top-0 z-10 group ${hasShadow ? 'shadow-md' : ''}`} 
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <EditableElement section="header" field="logoText" label="Logo">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5" style={{ color: primary }} />
            <span className="font-bold" style={{ color: titleColor }}>{data.logoText || 'Logo'}</span>
          </div>
        </EditableElement>
        
        <nav className="hidden md:flex items-center gap-4">
          {data.menuItems?.slice(0, 4).map((item, i) => (
            <span key={i} className="text-sm opacity-70" style={{ color: titleColor }}>{item.label}</span>
          ))}
        </nav>
        
        {data.ctaButton?.text && (
          <EditableElement section="header" field="ctaButton" label="Bouton CTA">
            <button 
              style={{ backgroundColor: btnBgColor, color: btnTextColor, borderRadius: `${btnRadius}px` }}
              className="px-4 py-2 text-sm font-medium"
            >
              {data.ctaButton.text}
            </button>
          </EditableElement>
        )}
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewHero({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const btnRadius = sectionStyles.buttonRadius || styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || styles?.sections?.verticalPadding || 80
  const titleColor = sectionStyles.title?.color || '#1f2937'
  const badgeBgColor = sectionStyles.badge?.bgColor || lightenColor(primary, 0.85)
  const badgeTextColor = sectionStyles.badge?.textColor || primary
  const badgeRadius = sectionStyles.badge?.radius || 20
  const primaryBtnBg = sectionStyles.primaryButton?.bgColor || primary
  const primaryBtnText = sectionStyles.primaryButton?.textColor || '#ffffff'
  const secondaryBtnBorder = sectionStyles.secondaryButton?.borderColor || primary
  const secondaryBtnText = sectionStyles.secondaryButton?.textColor || primary
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {data.badge && (
          <EditableElement section="hero" field="badge" label="Badge" className="inline-block mb-3">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderRadius: `${badgeRadius}px` }}
            >
              <Leaf className="w-3 h-3" />{data.badge}
            </div>
          </EditableElement>
        )}
        
        <EditableElement section="hero" field="title" label="Titre principal" className="mb-3">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: titleColor }}>
            {data.title || 'Titre principal'}
          </h1>
        </EditableElement>
        
        <EditableElement section="hero" field="subtitle" label="Sous-titre" className="mb-5 max-w-xl mx-auto">
          <p className="text-sm text-gray-600">
            {data.subtitle || 'Sous-titre de la section'}
          </p>
        </EditableElement>
        
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {data.ctaPrimary?.text && (
            <EditableElement section="hero" field="ctaPrimary" label="Bouton principal">
              <span 
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: primaryBtnBg, color: primaryBtnText, borderRadius: `${btnRadius}px` }}
              >
                {data.ctaPrimary.text}<ArrowRight className="w-3 h-3" />
              </span>
            </EditableElement>
          )}
          {data.ctaSecondary?.text && (
            <EditableElement section="hero" field="ctaSecondary" label="Bouton secondaire">
              <span 
                className="inline-flex items-center px-4 py-2 text-sm font-medium border-2"
                style={{ borderColor: secondaryBtnBorder, color: secondaryBtnText, borderRadius: `${btnRadius}px` }}
              >
                {data.ctaSecondary.text}
              </span>
            </EditableElement>
          )}
        </div>
        
        {data.stats?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-gray-200">
            {data.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold" style={{ color: primary }}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICES COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewServices({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#ffffff')
  const cardRadius = sectionStyles.cardRadius || styles?.cards?.borderRadius || 16
  const cardBg = sectionStyles.cardBg || '#ffffff'
  const iconShape = sectionStyles.iconShape || 'rounded'
  const iconBgColor = sectionStyles.iconBgColor || lightenColor(primary, 0.85)
  const iconColor = sectionStyles.iconColor || primary
  const columns = sectionStyles.columns || 4
  const gap = sectionStyles.gap || 16
  const sectionPadding = styles?.sections?.verticalPadding || 80
  
  const iconShapeClass = iconShape === 'circle' ? 'rounded-full' : iconShape === 'square' ? 'rounded-lg' : 'rounded-xl'
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <EditableElement section="services" field="title" label="Titre section">
            <h2 className="text-xl font-bold text-gray-900">{data.title || 'Nos Services'}</h2>
          </EditableElement>
          <EditableElement section="services" field="subtitle" label="Sous-titre" className="mt-2">
            <p className="text-sm text-gray-600">{data.subtitle}</p>
          </EditableElement>
        </div>
        
        <div 
          className="grid md:grid-cols-2"
          style={{ 
            gridTemplateColumns: `repeat(${Math.min(columns, 4)}, minmax(0, 1fr))`,
            gap: `${gap}px`
          }}
        >
          {data.items?.map((service, i) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -4 }}
              className="p-4 border border-gray-100 shadow-sm"
              style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBg }}
            >
              <div 
                className={`w-10 h-10 ${iconShapeClass} flex items-center justify-center mb-3`}
                style={{ backgroundColor: iconBgColor }}
              >
                {getIcon(service.icon, "w-5 h-5", { color: iconColor })}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{service.tagline}</p>
              <p className="text-xs text-gray-600 mt-2">{service.description}</p>
              {service.price && (
                <p className="text-xs font-medium mt-2" style={{ color: primary }}>{service.price}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewAbout({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const titleColor = sectionStyles.titleColor || '#1f2937'
  const subtitleColor = sectionStyles.subtitleColor || '#6b7280'
  const textAlign = sectionStyles.textAlign || 'center'
  const cardRadius = styles?.cards?.borderRadius || 16
  const sectionPadding = sectionStyles.padding?.vertical || styles?.sections?.verticalPadding || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`mb-8`} style={{ textAlign }}>
          <EditableElement section="about" field="title" label="Titre">
            <h2 className="text-xl font-bold" style={{ color: titleColor }}>{data.title}</h2>
          </EditableElement>
          <EditableElement section="about" field="subtitle" label="Sous-titre" className="mt-2">
            <p className="text-sm" style={{ color: subtitleColor }}>{data.subtitle}</p>
          </EditableElement>
        </div>
        
        <EditableElement section="about" field="content" label="Contenu" className="max-w-2xl mx-auto mb-8" style={{ textAlign }}>
          <p className="text-sm text-gray-700">{data.content}</p>
        </EditableElement>
        
        {data.values?.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.values.map((value, i) => (
              <div 
                key={value.id} 
                className="p-4 bg-white text-center"
                style={{ borderRadius: `${cardRadius}px` }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: lightenColor(primary, 0.85) }}
                >
                  {getIcon(value.icon, "w-5 h-5", { color: primary })}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{value.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{value.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewTestimonials({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const secondary = theme?.secondaryColor || '#E5B94E'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#ffffff')
  const cardBg = sectionStyles.cardBg || '#f9fafb'
  const cardRadius = sectionStyles.cardRadius || styles?.cards?.borderRadius || 16
  const cardBorder = sectionStyles.cardBorder !== false
  const starColor = sectionStyles.starColor || secondary
  const sectionPadding = styles?.sections?.verticalPadding || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <EditableElement section="testimonials" field="title" label="Titre">
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
          </EditableElement>
          <EditableElement section="testimonials" field="subtitle" label="Sous-titre" className="mt-2">
            <p className="text-sm text-gray-600">{data.subtitle}</p>
          </EditableElement>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {data.items?.map((testimonial, i) => (
            <div 
              key={testimonial.id} 
              className={`p-4 ${cardBorder ? 'border border-gray-100' : ''}`}
              style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBg }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating || 5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" style={{ color: starColor }} />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic mb-3">"{testimonial.quote}"</p>
              <div>
                <p className="font-medium text-gray-900 text-sm">{testimonial.author}</p>
                <p className="text-xs text-gray-500">{testimonial.role}, {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewFAQ({ data, theme, styles }) {
  const [openIndex, setOpenIndex] = useState(0)
  
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const questionBg = sectionStyles.questionBg || '#ffffff'
  const questionColor = sectionStyles.questionColor || '#1f2937'
  const radius = sectionStyles.radius || styles?.cards?.borderRadius || 16
  const hasBorder = sectionStyles.border !== false
  const sectionPadding = styles?.sections?.verticalPadding || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <EditableElement section="faq" field="title" label="Titre">
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
          </EditableElement>
          <EditableElement section="faq" field="subtitle" label="Sous-titre" className="mt-2">
            <p className="text-sm text-gray-600">{data.subtitle}</p>
          </EditableElement>
        </div>
        
        <div className="space-y-2">
          {data.items?.map((faq, i) => (
            <div 
              key={faq.id} 
              className={`overflow-hidden ${hasBorder ? 'border border-gray-100' : ''}`}
              style={{ borderRadius: `${radius}px`, backgroundColor: questionBg }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-sm" style={{ color: questionColor }}>{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewCTA({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, primary)
  const textColor = getContrastColor(bgColor)
  const textAlign = sectionStyles.textAlign || 'center'
  const btnRadius = styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || styles?.sections?.verticalPadding || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-2xl mx-auto px-4" style={{ textAlign }}>
        <EditableElement section="cta" field="title" label="Titre">
          <h2 className="text-xl font-bold mb-2" style={{ color: textColor }}>{data.title}</h2>
        </EditableElement>
        <EditableElement section="cta" field="subtitle" label="Sous-titre" className="mb-6">
          <p className="text-sm opacity-80" style={{ color: textColor }}>{data.subtitle}</p>
        </EditableElement>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {data.buttonPrimary?.text && (
            <EditableElement section="cta" field="buttonPrimary" label="Bouton principal">
              <span 
                className="px-5 py-2.5 text-sm font-medium"
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: primary,
                  borderRadius: `${btnRadius}px`
                }}
              >
                {data.buttonPrimary.text}
              </span>
            </EditableElement>
          )}
          {data.buttonSecondary?.text && (
            <EditableElement section="cta" field="buttonSecondary" label="Bouton secondaire">
              <span 
                className="px-5 py-2.5 text-sm font-medium border-2"
                style={{ 
                  borderColor: textColor, 
                  color: textColor,
                  borderRadius: `${btnRadius}px`
                }}
              >
                {data.buttonSecondary.text}
              </span>
            </EditableElement>
          )}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewContact({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const cardRadius = styles?.cards?.borderRadius || 16
  const btnRadius = styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || styles?.sections?.verticalPadding || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }} className="group">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 text-center">
          <EditableElement section="contact" field="title" label="Titre">
            <h2 className="text-xl font-bold text-gray-900">{data.title || 'Contact'}</h2>
          </EditableElement>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {data.phone && (
              <EditableElement section="contact" field="phone" label="Téléphone">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                    <Phone className="w-5 h-5" style={{ color: primary }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">{data.phone}</p>
                  </div>
                </div>
              </EditableElement>
            )}
            {data.email && (
              <EditableElement section="contact" field="email" label="Email">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                    <Mail className="w-5 h-5" style={{ color: primary }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{data.email}</p>
                  </div>
                </div>
              </EditableElement>
            )}
            {data.address && (
              <EditableElement section="contact" field="address" label="Adresse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                    <MapPin className="w-5 h-5" style={{ color: primary }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Adresse</p>
                    <p className="text-sm font-medium text-gray-900">{data.address}</p>
                  </div>
                </div>
              </EditableElement>
            )}
          </div>
          {data.showForm && (
            <div className="p-4 shadow-md bg-white" style={{ borderRadius: `${cardRadius}px` }}>
              <h3 className="text-sm font-semibold mb-3 text-gray-900">Envoyer un message</h3>
              <div className="space-y-2">
                <input type="text" placeholder="Votre nom" className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderRadius: `${btnRadius}px` }} disabled />
                <input type="email" placeholder="Votre email" className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderRadius: `${btnRadius}px` }} disabled />
                <textarea placeholder="Votre message" rows={3} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" style={{ borderRadius: `${btnRadius}px` }} disabled />
                <button className="w-full py-2 text-sm font-medium text-white" style={{ backgroundColor: primary, borderRadius: `${btnRadius}px` }}>Envoyer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PreviewFooter({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const secondary = theme?.secondaryColor || '#E5B94E'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#1a1a1a')
  const textColor = sectionStyles.textColor || getContrastColor(bgColor)
  
  return (
    <footer className="py-8 px-4 group" style={{ backgroundColor: bgColor }}>
      <div className="max-w-4xl mx-auto">
        <EditableElement section="footer" field="logoText" label="Logo">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5" style={{ color: secondary }} />
            <span className="font-bold" style={{ color: textColor }}>{data.logoText || 'Logo'}</span>
          </div>
        </EditableElement>
        <EditableElement section="footer" field="description" label="Description" className="mb-4">
          <p className="text-sm opacity-70" style={{ color: textColor }}>{data.description}</p>
        </EditableElement>
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <EditableElement section="footer" field="copyright" label="Copyright">
            <p className="text-xs opacity-50" style={{ color: textColor }}>{data.copyright}</p>
          </EditableElement>
          {data.legalLinks?.length > 0 && (
            <div className="flex gap-4">
              {data.legalLinks.map((link, i) => (
                <span key={i} className="text-xs opacity-50" style={{ color: textColor }}>{link.label}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LIVE PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LivePreview() {
  const { draftContent, activeSection, previewOverride } = useEditorContext()

  if (!draftContent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  // Apply preview override if exists
  let displayContent = draftContent
  if (previewOverride?.section && previewOverride?.field) {
    displayContent = JSON.parse(JSON.stringify(draftContent))
    if (!displayContent[previewOverride.section]) {
      displayContent[previewOverride.section] = {}
    }
    displayContent[previewOverride.section][previewOverride.field] = previewOverride.value
  }

  const { theme, styles } = displayContent

  // Section wrapper with highlight
  const SectionWrapper = ({ id, children, isModule = false }) => (
    <div className={`relative transition-all duration-300 ${
      activeSection === id 
        ? isModule 
          ? 'ring-2 ring-purple-500/50 ring-inset' 
          : 'ring-2 ring-green-500/50 ring-inset' 
        : ''
    } ${previewOverride?.section === id ? 'ring-2 ring-purple-500 ring-inset' : ''}`}>
      {activeSection === id && !previewOverride && (
        <div className={`absolute top-2 right-2 z-10 ${isModule ? 'bg-purple-500' : 'bg-green-500'} text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg`}>
          ✏️ En cours
        </div>
      )}
      {previewOverride?.section === id && (
        <div className="absolute top-2 right-2 z-10 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-lg animate-pulse">
          ✨ Aperçu IA
        </div>
      )}
      {children}
    </div>
  )

  const sectionComponents = {
    header: <PreviewHeader data={displayContent.header} theme={theme} styles={styles} />,
    hero: <PreviewHero data={displayContent.hero} theme={theme} styles={styles} />,
    services: <PreviewServices data={displayContent.services} theme={theme} styles={styles} />,
    about: <PreviewAbout data={displayContent.about} theme={theme} styles={styles} />,
    testimonials: <PreviewTestimonials data={displayContent.testimonials} theme={theme} styles={styles} />,
    faq: <PreviewFAQ data={displayContent.faq} theme={theme} styles={styles} />,
    cta: <PreviewCTA data={displayContent.cta} theme={theme} styles={styles} />,
    contact: <PreviewContact data={displayContent.contact} theme={theme} styles={styles} />,
    footer: <PreviewFooter data={displayContent.footer} theme={theme} styles={styles} />,
    // Modules
    booking: <PreviewBooking data={displayContent.booking} theme={theme} styles={styles} />,
    ecommerce: <PreviewEcommerce data={displayContent.ecommerce} theme={theme} styles={styles} />
  }

  // Utiliser l'ordre dynamique des sections (incluant les modules activés)
  const defaultOrder = ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer']
  let sectionOrder = [...(displayContent.sectionOrder || defaultOrder)]
  
  // Modules disponibles
  const availableModules = ['booking', 'ecommerce']
  
  // Ajouter les modules activés qui ne sont pas encore dans l'ordre (avant footer)
  availableModules.forEach(moduleId => {
    if (displayContent[moduleId]?.enabled && !sectionOrder.includes(moduleId)) {
      const footerIndex = sectionOrder.indexOf('footer')
      if (footerIndex !== -1) {
        sectionOrder.splice(footerIndex, 0, moduleId)
      } else {
        sectionOrder.push(moduleId)
      }
    }
  })

  return (
    <div className="h-full bg-white overflow-y-auto">
      {sectionOrder.map((sectionId) => {
        const isModule = availableModules.includes(sectionId)
        // Vérifier si la section/module est activé
        if (displayContent[sectionId]?.enabled === false) return null
        if (isModule && !displayContent[sectionId]?.enabled) return null
        
        return (
          <SectionWrapper key={sectionId} id={sectionId} isModule={isModule}>
            {sectionComponents[sectionId]}
          </SectionWrapper>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE: BOOKING - Placeholder
// ═══════════════════════════════════════════════════════════════════════════

function PreviewBooking({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  const bgColor = sectionStyles.background?.color || '#f9fafb'
  const cardRadius = sectionStyles.cardRadius || 16
  const padding = sectionStyles.padding?.vertical || 80

  return (
    <section id="booking" style={{ backgroundColor: bgColor, padding: `${padding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <EditableElement section="booking" field="title" label="Titre">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title || 'Réservation en ligne'}</h2>
          </EditableElement>
          <EditableElement section="booking" field="subtitle" label="Sous-titre">
            <p className="text-lg text-gray-600">{data.subtitle || 'Choisissez votre créneau'}</p>
          </EditableElement>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.services?.map((service, index) => (
            <div 
              key={service.id || index}
              className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
              style={{ borderRadius: `${cardRadius}px` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.duration}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: primary }}>{service.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <button 
                className="w-full py-2 text-white font-medium rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: primary }}
              >
                Réserver
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <EditableElement section="booking" field="buttonText" label="Texte du bouton">
            <button 
              className="px-8 py-3 text-white font-medium rounded-xl hover:opacity-90 transition"
              style={{ backgroundColor: primary }}
            >
              {data.buttonText || 'Voir tous les créneaux'}
            </button>
          </EditableElement>
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <LucideIcons.Calendar className="w-4 h-4" />
            Module en préparation - Aperçu
          </span>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE: E-COMMERCE - Placeholder
// ═══════════════════════════════════════════════════════════════════════════

function PreviewEcommerce({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  const bgColor = sectionStyles.background?.color || '#ffffff'
  const cardRadius = sectionStyles.cardRadius || 16
  const padding = sectionStyles.padding?.vertical || 80
  const columns = sectionStyles.columns || 3

  return (
    <section id="ecommerce" style={{ backgroundColor: bgColor, padding: `${padding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <EditableElement section="ecommerce" field="title" label="Titre">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title || 'Notre Boutique'}</h2>
          </EditableElement>
          <EditableElement section="ecommerce" field="subtitle" label="Sous-titre">
            <p className="text-lg text-gray-600">{data.subtitle || 'Découvrez nos produits'}</p>
          </EditableElement>
        </div>

        {/* Products Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-${columns} gap-6 mb-8`}>
          {data.products?.map((product, index) => (
            <div 
              key={product.id || index}
              className="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              style={{ borderRadius: `${cardRadius}px` }}
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <LucideIcons.Package className="w-16 h-16 text-gray-300" />
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  {data.showPrices && (
                    <span className="text-lg font-bold" style={{ color: primary }}>{product.price}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2 text-white font-medium rounded-lg hover:opacity-90 transition"
                    style={{ backgroundColor: primary }}
                  >
                    Ajouter
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <LucideIcons.Heart className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm">
            <LucideIcons.ShoppingCart className="w-4 h-4" />
            Module en préparation - Aperçu
          </span>
        </div>
      </div>
    </section>
  )
}
