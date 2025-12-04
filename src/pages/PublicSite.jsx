import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSitesStore } from '../stores/sitesStore'
import * as LucideIcons from 'lucide-react'
import { 
  Leaf, ArrowRight, Star, Phone, Mail, MapPin, 
  ChevronDown, ChevronUp, ArrowLeft, Edit3
} from 'lucide-react'

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
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function PublicHeader({ data, theme, styles }) {
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
      className={`border-b border-gray-100 py-4 px-6 sticky top-0 z-50 ${hasShadow ? 'shadow-md' : ''}`} 
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <Leaf className="w-6 h-6" style={{ color: primary }} />
          <span className="text-xl font-bold" style={{ color: titleColor }}>{data.logoText || 'Logo'}</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-6">
          {data.menuItems?.map((item, i) => (
            <a key={i} href={item.url} className="text-sm opacity-80 hover:opacity-100 transition" style={{ color: titleColor }}>
              {item.label}
            </a>
          ))}
        </nav>
        
        {data.ctaButton?.text && (
          <a 
            href={data.ctaButton.url}
            style={{ backgroundColor: btnBgColor, color: btnTextColor, borderRadius: `${btnRadius}px` }}
            className="px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            {data.ctaButton.text}
          </a>
        )}
      </div>
    </header>
  )
}

function PublicHero({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const btnRadius = sectionStyles.buttonRadius || styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || 80
  const titleColor = sectionStyles.title?.color || '#1f2937'
  const badgeBgColor = sectionStyles.badge?.bgColor || lightenColor(primary, 0.85)
  const badgeTextColor = sectionStyles.badge?.textColor || primary
  const badgeRadius = sectionStyles.badge?.radius || 20
  const primaryBtnBg = sectionStyles.primaryButton?.bgColor || primary
  const primaryBtnText = sectionStyles.primaryButton?.textColor || '#ffffff'
  const secondaryBtnBorder = sectionStyles.secondaryButton?.borderColor || primary
  const secondaryBtnText = sectionStyles.secondaryButton?.textColor || primary
  
  return (
    <section id="hero" style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        {data.badge && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderRadius: `${badgeRadius}px` }}
          >
            <Leaf className="w-4 h-4" />{data.badge}
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ color: titleColor }}
        >
          {data.title || 'Titre principal'}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8"
        >
          {data.subtitle || 'Sous-titre'}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          {data.ctaPrimary?.text && (
            <a 
              href={data.ctaPrimary.url}
              className="inline-flex items-center gap-2 px-6 py-3 font-medium hover:opacity-90 transition"
              style={{ backgroundColor: primaryBtnBg, color: primaryBtnText, borderRadius: `${btnRadius}px` }}
            >
              {data.ctaPrimary.text}<ArrowRight className="w-4 h-4" />
            </a>
          )}
          {data.ctaSecondary?.text && (
            <a 
              href={data.ctaSecondary.url}
              className="inline-flex items-center px-6 py-3 font-medium border-2 hover:bg-gray-50 transition"
              style={{ borderColor: secondaryBtnBorder, color: secondaryBtnText, borderRadius: `${btnRadius}px` }}
            >
              {data.ctaSecondary.text}
            </a>
          )}
        </motion.div>
        
        {data.stats?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-12 pt-8 border-t border-gray-200"
          >
            {data.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold" style={{ color: primary }}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function PublicServices({ data, theme, styles }) {
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
  const gap = sectionStyles.gap || 24
  
  const iconShapeClass = iconShape === 'circle' ? 'rounded-full' : iconShape === 'square' ? 'rounded-lg' : 'rounded-2xl'
  
  return (
    <section id="services" style={{ backgroundColor: bgColor }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{data.subtitle}</p>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBg }}
            >
              <div 
                className={`w-14 h-14 ${iconShapeClass} flex items-center justify-center mb-4`}
                style={{ backgroundColor: iconBgColor }}
              >
                {getIcon(service.icon, "w-7 h-7", { color: iconColor })}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{service.tagline}</p>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              {service.price && (
                <p className="font-semibold" style={{ color: primary }}>{service.price}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PublicAbout({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const titleColor = sectionStyles.titleColor || '#1f2937'
  const subtitleColor = sectionStyles.subtitleColor || '#6b7280'
  const textAlign = sectionStyles.textAlign || 'center'
  const cardRadius = styles?.cards?.borderRadius || 16
  const btnRadius = styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || 80
  
  return (
    <section id="about" style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12" style={{ textAlign }}>
          <h2 className="text-3xl font-bold mb-4" style={{ color: titleColor }}>{data.title}</h2>
          <p className="text-lg" style={{ color: subtitleColor }}>{data.subtitle}</p>
        </div>
        
        <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-12" style={{ textAlign }}>{data.content}</p>
        
        {data.values?.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {data.values.map((value, i) => (
              <motion.div 
                key={value.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white text-center"
                style={{ borderRadius: `${cardRadius}px` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: lightenColor(primary, 0.85) }}
                >
                  {getIcon(value.icon, "w-6 h-6", { color: primary })}
                </div>
                <h4 className="font-semibold text-gray-900">{value.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{value.description}</p>
              </motion.div>
            ))}
          </div>
        )}
        
        {data.cta?.text && (
          <div className="text-center">
            <a 
              href={data.cta.url}
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium hover:opacity-90 transition"
              style={{ backgroundColor: primary, borderRadius: `${btnRadius}px` }}
            >
              {data.cta.text}<ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function PublicTestimonials({ data, theme, styles }) {
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
  
  return (
    <section id="testimonials" style={{ backgroundColor: bgColor }} className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h2>
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {data.items?.map((testimonial, i) => (
            <motion.div 
              key={testimonial.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 ${cardBorder ? 'border border-gray-100' : ''}`}
              style={{ borderRadius: `${cardRadius}px`, backgroundColor: cardBg }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-current" style={{ color: starColor }} />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PublicFAQ({ data, theme, styles }) {
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
  
  return (
    <section id="faq" style={{ backgroundColor: bgColor }} className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h2>
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        </div>
        
        <div className="space-y-3">
          {data.items?.map((faq, i) => (
            <motion.div 
              key={faq.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`overflow-hidden ${hasBorder ? 'border border-gray-100' : ''}`}
              style={{ borderRadius: `${radius}px`, backgroundColor: questionBg }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium" style={{ color: questionColor }}>{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
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
                    <p className="px-5 pb-5 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PublicCTA({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, primary)
  const textColor = getContrastColor(bgColor)
  const textAlign = sectionStyles.textAlign || 'center'
  const btnRadius = styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || 80
  
  return (
    <section style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }}>
      <div className="max-w-4xl mx-auto px-6" style={{ textAlign }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{data.title}</h2>
        <p className="text-lg opacity-80 mb-8" style={{ color: textColor }}>{data.subtitle}</p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {data.buttonPrimary?.text && (
            <a
              href={data.buttonPrimary.url}
              className="px-6 py-3 font-medium hover:opacity-90 transition"
              style={{ backgroundColor: '#ffffff', color: primary, borderRadius: `${btnRadius}px` }}
            >
              {data.buttonPrimary.text}
            </a>
          )}
          {data.buttonSecondary?.text && (
            <a
              href={data.buttonSecondary.url}
              className="px-6 py-3 font-medium border-2 hover:bg-white/10 transition"
              style={{ borderColor: textColor, color: textColor, borderRadius: `${btnRadius}px` }}
            >
              {data.buttonSecondary.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function PublicContact({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const primary = theme?.primaryColor || '#2D5A3D'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#f9fafb')
  const cardRadius = styles?.cards?.borderRadius || 16
  const btnRadius = styles?.buttons?.borderRadius || 12
  const sectionPadding = sectionStyles.padding?.vertical || 80
  
  return (
    <section id="contact" style={{ backgroundColor: bgColor, padding: `${sectionPadding}px 0` }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h2>
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {data.phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                  <Phone className="w-6 h-6" style={{ color: primary }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a href={`tel:${data.phone}`} className="text-lg font-medium text-gray-900 hover:underline">{data.phone}</a>
                </div>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                  <Mail className="w-6 h-6" style={{ color: primary }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${data.email}`} className="text-lg font-medium text-gray-900 hover:underline">{data.email}</a>
                </div>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: lightenColor(primary, 0.85) }}>
                  <MapPin className="w-6 h-6" style={{ color: primary }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-lg font-medium text-gray-900">{data.address}</p>
                </div>
              </div>
            )}
            
            {data.locations?.length > 0 && (
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Zones d'intervention</p>
                <div className="flex flex-wrap gap-2">
                  {data.locations.map((loc, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{loc}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {data.showForm && (
            <form className="p-6 bg-white shadow-lg" style={{ borderRadius: `${cardRadius}px` }}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Envoyer un message</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Votre nom" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none" style={{ borderRadius: `${btnRadius}px` }} />
                <input type="email" placeholder="Votre email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none" style={{ borderRadius: `${btnRadius}px` }} />
                <textarea placeholder="Votre message" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none resize-none" style={{ borderRadius: `${btnRadius}px` }} />
                <button type="submit" className="w-full py-3 text-white font-medium hover:opacity-90 transition" style={{ backgroundColor: primary, borderRadius: `${btnRadius}px` }}>
                  Envoyer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function PublicFooter({ data, theme, styles }) {
  if (!data?.enabled) return null
  
  const secondary = theme?.secondaryColor || '#E5B94E'
  const sectionStyles = data.styles || {}
  
  // Lire les styles de la section
  const bgColor = sectionStyles.background?.color || resolveColor(data.backgroundColor, theme, '#1a1a1a')
  const textColor = sectionStyles.textColor || getContrastColor(bgColor)
  
  return (
    <footer style={{ backgroundColor: bgColor }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-6 h-6" style={{ color: secondary }} />
          <span className="text-xl font-bold" style={{ color: textColor }}>{data.logoText}</span>
        </div>
        <p className="max-w-md opacity-70 mb-8" style={{ color: textColor }}>{data.description}</p>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-sm opacity-50" style={{ color: textColor }}>{data.copyright}</p>
          {data.legalLinks?.length > 0 && (
            <div className="flex gap-6">
              {data.legalLinks.map((link, i) => (
                <a key={i} href={link.url} className="text-sm opacity-50 hover:opacity-100 transition" style={{ color: textColor }}>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PUBLIC SITE PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function PublicSite() {
  const { slug } = useParams()
  const { getSite, initializeSites, sites, isLoaded } = useSitesStore()
  const [site, setSite] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialiser le store
  useEffect(() => {
    initializeSites()
  }, [initializeSites])

  // Chercher le site APRÈS que le store soit chargé
  useEffect(() => {
    if (isLoaded) {
      const loadedSite = getSite(slug)
      setSite(loadedSite)
      setIsLoading(false)
    }
  }, [slug, getSite, isLoaded, sites])

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <LucideIcons.Loader className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-400">Chargement du site...</p>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LucideIcons.Globe className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Site non trouvé</h2>
          <p className="text-gray-500 mb-6">Ce site n'existe pas ou n'est pas encore publié</p>
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition">
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  const content = site.published_content || site.draft_content
  const { theme, styles } = content

  return (
    <div className="min-h-screen">
      {/* Edit Banner (visible only in preview mode) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to={`/editor/${slug}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full shadow-xl hover:bg-gray-800 transition"
        >
          <Edit3 className="w-4 h-4" />
          Éditer
        </Link>
      </div>

      {/* Site Content */}
      <PublicHeader data={content.header} theme={theme} styles={styles} />
      <PublicHero data={content.hero} theme={theme} styles={styles} />
      <PublicServices data={content.services} theme={theme} styles={styles} />
      <PublicAbout data={content.about} theme={theme} styles={styles} />
      <PublicTestimonials data={content.testimonials} theme={theme} styles={styles} />
      <PublicFAQ data={content.faq} theme={theme} styles={styles} />
      <PublicCTA data={content.cta} theme={theme} styles={styles} />
      <PublicContact data={content.contact} theme={theme} styles={styles} />
      <PublicFooter data={content.footer} theme={theme} styles={styles} />
    </div>
  )
}
