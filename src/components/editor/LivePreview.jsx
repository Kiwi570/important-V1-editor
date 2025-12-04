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
// MODULE: BOOKING - Premium Version
// ═══════════════════════════════════════════════════════════════════════════

function PreviewBooking({ data, theme, styles }) {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [step, setStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#8b5cf6'
  const sectionStyles = data.styles || {}
  const bgColor = sectionStyles.background?.color || '#faf5ff'
  const cardBg = sectionStyles.cardBg || '#ffffff'
  const cardRadius = sectionStyles.cardRadius || 20
  const padding = sectionStyles.padding?.vertical || 80

  const timeSlots = data.timeSlots || ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
  const today = new Date()

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    if (data.showCalendar !== false || data.showTimeSlots !== false) {
      setStep(2)
    } else {
      setStep(3)
    }
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleConfirm = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
      setStep(1)
      setSelectedService(null)
      setSelectedTime(null)
      setSelectedDate(null)
    }, 4000)
  }

  const resetAll = () => {
    setStep(1)
    setSelectedService(null)
    setSelectedTime(null)
    setSelectedDate(null)
  }

  return (
    <section id="booking" style={{ backgroundColor: bgColor, padding: `${padding}px 0` }}>
      <div className="max-w-5xl mx-auto px-6">
        
        {/* ═══════════════════ HEADER ═══════════════════ */}
        <div className="text-center mb-8">
          {data.badge && (
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${primary}15`, color: primary }}
            >
              {data.badge}
            </span>
          )}
          <EditableElement section="booking" field="title" label="Titre">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.title || 'Réservez votre moment'}
            </h2>
          </EditableElement>
          <EditableElement section="booking" field="subtitle" label="Sous-titre">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {data.subtitle || 'Choisissez votre prestation et réservez en ligne'}
            </p>
          </EditableElement>
        </div>

        {/* ═══════════════════ PROGRESS STEPS ═══════════════════ */}
        {data.showSteps !== false && (
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
            {[
              { num: 1, label: 'Service', icon: 'Sparkles' },
              { num: 2, label: 'Créneau', icon: 'Calendar' },
              { num: 3, label: 'Confirmation', icon: 'Check' }
            ].map((s, i) => {
              const StepIcon = LucideIcons[s.icon]
              return (
                <div key={s.num} className="flex items-center">
                  <motion.div 
                    className={`flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full transition-all ${
                      step >= s.num ? 'bg-white shadow-lg' : 'bg-white/50'
                    }`}
                    animate={{ scale: step === s.num ? 1.05 : 1 }}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all`}
                      style={{ 
                        backgroundColor: step >= s.num ? primary : '#e5e7eb',
                        color: step >= s.num ? 'white' : '#9ca3af'
                      }}
                    >
                      {step > s.num ? <LucideIcons.Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium hidden md:inline ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </motion.div>
                  {i < 2 && (
                    <div 
                      className="w-8 md:w-12 h-0.5 mx-1 md:mx-2 rounded-full transition-colors"
                      style={{ backgroundColor: step > s.num ? primary : '#e5e7eb' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ═══════════════════ CONFIRMATION MODAL ═══════════════════ */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full"
              >
                <motion.div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${primary}15` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <LucideIcons.CheckCircle className="w-10 h-10" style={{ color: primary }} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {data.confirmationTitle || 'Réservation confirmée ! 🎉'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {data.confirmationMessage || 'Vous recevrez un email de confirmation.'}
                </p>
                {selectedService && (
                  <div className="bg-gray-50 rounded-xl p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedService.color}20` }}
                      >
                        {(() => {
                          const Icon = LucideIcons[selectedService.icon] || LucideIcons.Star
                          return <Icon className="w-5 h-5" style={{ color: selectedService.color }} />
                        })()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedService.name}</p>
                        <p className="text-sm text-gray-500">
                          {selectedDate && `${selectedDate} `}{selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════ STEP 1: SERVICES ═══════════════════ */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {data.services?.map((service, index) => {
              const Icon = LucideIcons[service.icon] || LucideIcons.Star
              return (
                <motion.div
                  key={service.id || index}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleServiceSelect(service)}
                  className="relative bg-white p-5 shadow-sm hover:shadow-xl cursor-pointer transition-all overflow-hidden group"
                  style={{ borderRadius: `${cardRadius}px` }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div 
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${primary}15`, color: primary }}
                    >
                      ⭐ Populaire
                    </div>
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${service.color || primary}12` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: service.color || primary }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <LucideIcons.Clock className="w-4 h-4" />
                            {service.duration} min
                          </span>
                        </div>
                        <span 
                          className="text-lg font-bold"
                          style={{ color: service.color || primary }}
                        >
                          {service.priceLabel || (service.price === 0 ? 'Offert' : `${service.price} €`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: service.color || primary }}
                    >
                      <LucideIcons.ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* ═══════════════════ STEP 2: DATE & TIME ═══════════════════ */}
        {step === 2 && selectedService && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Selected Service Recap */}
            <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedService.color || primary}15` }}
              >
                {(() => {
                  const Icon = LucideIcons[selectedService.icon] || LucideIcons.Star
                  return <Icon className="w-6 h-6" style={{ color: selectedService.color || primary }} />
                })()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{selectedService.name}</p>
                <p className="text-sm text-gray-500">{selectedService.duration} min • {selectedService.priceLabel}</p>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
              >
                Modifier
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Calendar */}
              {data.showCalendar !== false && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <LucideIcons.ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <LucideIcons.ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                      <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }, (_, i) => {
                      const dayNum = i - 3
                      const isToday = dayNum === today.getDate()
                      const isPast = dayNum < today.getDate()
                      const isWeekend = (i % 7) >= 5
                      const isAvailable = dayNum > 0 && dayNum <= 31 && !isPast && !isWeekend
                      
                      return (
                        <button
                          key={i}
                          disabled={!isAvailable}
                          onClick={() => setSelectedDate(dayNum)}
                          className={`
                            aspect-square rounded-xl text-sm font-medium transition-all
                            ${dayNum < 1 || dayNum > 31 ? 'invisible' : ''}
                            ${selectedDate === dayNum ? 'text-white shadow-md' : ''}
                            ${isAvailable && selectedDate !== dayNum ? 'hover:bg-gray-100' : ''}
                            ${!isAvailable && dayNum > 0 && dayNum <= 31 ? 'text-gray-300' : ''}
                            ${isToday && selectedDate !== dayNum ? 'ring-2 ring-inset' : ''}
                          `}
                          style={{ 
                            backgroundColor: selectedDate === dayNum ? primary : undefined,
                            ringColor: isToday ? primary : undefined
                          }}
                        >
                          {dayNum > 0 && dayNum <= 31 ? dayNum : ''}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Time Slots */}
              {data.showTimeSlots !== false && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4">Créneaux disponibles</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === time 
                            ? 'text-white shadow-md' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                        style={{ backgroundColor: selectedTime === time ? primary : undefined }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ STEP 3: FORM ═══════════════════ */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {data.formTitle || 'Vos coordonnées'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {data.formSubtitle || 'Pour confirmer votre réservation'}
              </p>
              
              {/* Recap */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedService?.color || primary}20` }}
                  >
                    {(() => {
                      const Icon = LucideIcons[selectedService?.icon] || LucideIcons.Star
                      return <Icon className="w-5 h-5" style={{ color: selectedService?.color || primary }} />
                    })()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedService?.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedDate && `${selectedDate} ${today.toLocaleDateString('fr-FR', { month: 'long' })} • `}{selectedTime || 'Horaire à confirmer'}
                    </p>
                  </div>
                  <span className="font-bold" style={{ color: selectedService?.color || primary }}>
                    {selectedService?.priceLabel}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {data.fields?.firstName?.show !== false && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {data.fields?.firstName?.label || 'Prénom'}
                        {data.fields?.firstName?.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                        style={{ '--tw-ring-color': `${primary}40` }}
                        placeholder={data.fields?.firstName?.placeholder || 'Jean'}
                      />
                    </div>
                    {data.fields?.lastName?.show !== false && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {data.fields?.lastName?.label || 'Nom'}
                          {data.fields?.lastName?.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                          placeholder={data.fields?.lastName?.placeholder || 'Dupont'}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {data.fields?.email?.show !== false && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {data.fields?.email?.label || 'Email'}
                      {data.fields?.email?.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                      placeholder={data.fields?.email?.placeholder || 'votre@email.com'}
                    />
                  </div>
                )}
                
                {data.fields?.phone?.show !== false && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {data.fields?.phone?.label || 'Téléphone'}
                      {data.fields?.phone?.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                      placeholder={data.fields?.phone?.placeholder || '06 00 00 00 00'}
                    />
                  </div>
                )}
                
                {data.fields?.message?.show && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {data.fields?.message?.label || 'Message'}
                    </label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition resize-none"
                      rows={3}
                      placeholder={data.fields?.message?.placeholder || 'Une information à nous communiquer ?'}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Retour
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="flex-1 py-3.5 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: primary }}
                >
                  {(() => {
                    const BtnIcon = LucideIcons[data.buttonIcon] || LucideIcons.Calendar
                    return <BtnIcon className="w-5 h-5" />
                  })()}
                  {data.buttonText || 'Confirmer'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ GUARANTEES ═══════════════════ */}
        {data.showGuarantees !== false && data.guarantees?.length > 0 && step === 1 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10">
            {data.guarantees.map((g, i) => {
              const GIcon = LucideIcons[g.icon] || LucideIcons.Check
              return (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <GIcon className="w-5 h-5" style={{ color: primary }} />
                  <span className="text-sm font-medium">{g.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* ═══════════════════ BACK BUTTON ═══════════════════ */}
        {step > 1 && !showConfirmation && (
          <div className="text-center mt-8">
            <button 
              onClick={resetAll}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Recommencer
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE: E-COMMERCE - Placeholder
// ═══════════════════════════════════════════════════════════════════════════

function PreviewEcommerce({ data, theme, styles }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#8b5cf6'
  const sectionStyles = data.styles || {}
  const bgColor = sectionStyles.background?.color || '#f8fafc'
  const cardBg = sectionStyles.cardBg || '#ffffff'
  const cardRadius = sectionStyles.cardRadius || 16
  const padding = sectionStyles.padding?.vertical || 80
  const columns = data.columns || 3

  // Filter products
  const filteredProducts = (data.products || []).filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    const matchesSearch = !searchQuery || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Column classes
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <section id="ecommerce" style={{ backgroundColor: bgColor, padding: `${padding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* ═══════════════════ HEADER ═══════════════════ */}
        <div className="text-center mb-8">
          {data.badge && (
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${primary}15`, color: primary }}
            >
              {data.badge}
            </span>
          )}
          <EditableElement section="ecommerce" field="title" label="Titre">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.title || 'Notre Boutique'}
            </h2>
          </EditableElement>
          <EditableElement section="ecommerce" field="subtitle" label="Sous-titre">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {data.subtitle || 'Découvrez notre sélection de produits'}
            </p>
          </EditableElement>
        </div>

        {/* ═══════════════════ FILTERS & SEARCH ═══════════════════ */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories */}
          {data.showFilters !== false && data.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === 'all' 
                    ? 'text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                style={{ backgroundColor: activeCategory === 'all' ? primary : undefined }}
              >
                Tous
              </button>
              {data.categories.map(cat => {
                const CatIcon = LucideIcons[cat.icon] || LucideIcons.Tag
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                      activeCategory === cat.id 
                        ? 'text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ backgroundColor: activeCategory === cat.id ? primary : undefined }}
                  >
                    <CatIcon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Search */}
          {data.showSearch !== false && (
            <div className="relative md:ml-auto">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm w-full md:w-64 focus:ring-2 focus:border-transparent outline-none"
                style={{ '--tw-ring-color': `${primary}40` }}
              />
            </div>
          )}
        </div>

        {/* ═══════════════════ PRODUCTS GRID ═══════════════════ */}
        <div className={`grid ${gridCols[columns]} gap-6 mb-8`}>
          {filteredProducts.map((product, index) => {
            const hasPromo = product.originalPrice && product.originalPrice > product.price
            const discount = hasPromo ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
            
            return (
              <motion.div 
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={sectionStyles.cardHoverEffect !== false ? { y: -4 } : {}}
                className="bg-white border border-gray-100 overflow-hidden group relative"
                style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBg }}
              >
                {/* Badge */}
                {product.badge && (
                  <div 
                    className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: product.badgeColor || primary,
                      color: 'white'
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Product Image */}
                <div 
                  className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => data.enableQuickView !== false && setQuickViewProduct(product)}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <LucideIcons.Package className="w-16 h-16 text-gray-300" />
                  )}
                  
                  {/* Quick View Overlay */}
                  {data.enableQuickView !== false && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white rounded-full text-sm font-medium">
                        Aperçu rapide
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  {data.showRatings !== false && product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <LucideIcons.Star 
                            key={star}
                            className={`w-4 h-4 ${star <= product.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                    </div>
                  )}

                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Price & Stock */}
                  <div className="flex items-center justify-between mb-3">
                    {data.showPrices !== false && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold" style={{ color: primary }}>
                          {product.priceLabel || `${product.price} €`}
                        </span>
                        {hasPromo && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice} €
                          </span>
                        )}
                      </div>
                    )}
                    {data.showStock !== false && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 10 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock}` : 'Rupture'}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 py-2.5 text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: primary, borderRadius: `${sectionStyles.buttonRadius || 12}px` }}
                    >
                      <LucideIcons.ShoppingCart className="w-4 h-4" />
                      {data.cartButtonText || 'Ajouter'}
                    </motion.button>
                    <button className="px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      <LucideIcons.Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <LucideIcons.Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}

        {/* ═══════════════════ FLOATING CART ═══════════════════ */}
        {data.showFloatingCart !== false && cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(!showCart)}
              className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primary }}
            >
              <LucideIcons.ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════ CART DRAWER ═══════════════════ */}
        <AnimatePresence>
          {showCart && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowCart(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">Votre panier ({cartCount})</h3>
                  <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <LucideIcons.X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <LucideIcons.ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      {data.emptyCartMessage || 'Votre panier est vide'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <LucideIcons.Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">Qté: {item.qty}</p>
                            <p className="font-semibold" style={{ color: primary }}>{(item.price * item.qty).toFixed(2)} €</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition"
                          >
                            <LucideIcons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold" style={{ color: primary }}>{cartTotal.toFixed(2)} €</span>
                    </div>
                    <button 
                      className="w-full py-3 text-white font-semibold rounded-xl"
                      style={{ backgroundColor: primary }}
                    >
                      Commander
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ═══════════════════ QUICK VIEW MODAL ═══════════════════ */}
        <AnimatePresence>
          {quickViewProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                onClick={() => setQuickViewProduct(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
              >
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10"
                >
                  <LucideIcons.X className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {quickViewProduct.image ? (
                      <img src={quickViewProduct.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <LucideIcons.Package className="w-24 h-24 text-gray-300" />
                    )}
                  </div>
                  <div className="p-6">
                    {quickViewProduct.badge && (
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                        style={{ backgroundColor: quickViewProduct.badgeColor || primary }}
                      >
                        {quickViewProduct.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{quickViewProduct.name}</h3>
                    
                    {data.showRatings !== false && quickViewProduct.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <LucideIcons.Star 
                              key={star}
                              className={`w-5 h-5 ${star <= quickViewProduct.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({quickViewProduct.reviewCount} avis)</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 mb-4">{quickViewProduct.description}</p>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold" style={{ color: primary }}>
                        {quickViewProduct.priceLabel || `${quickViewProduct.price} €`}
                      </span>
                      {quickViewProduct.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {quickViewProduct.originalPrice} €
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="w-full py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: primary }}
                    >
                      <LucideIcons.ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
