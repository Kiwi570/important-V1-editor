// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATES & SCHEMA - Universal Editor V2
// ═══════════════════════════════════════════════════════════════════════════

export const defaultTheme = {
  primaryColor: '#2D5A3D',
  secondaryColor: '#E5B94E',
  fontHeading: 'playfair',
  fontBody: 'inter',
  mode: 'light'
}

export const defaultStyles = {
  buttons: { borderRadius: 12, size: 'md', shadow: 'medium', hoverEffect: 'lift' },
  cards: { borderRadius: 16, border: 'none', background: 'white', shadow: 'medium', padding: 'normal' },
  avatars: { shape: 'circle', size: 'md', border: 'white' },
  titles: { align: 'center', style: 'normal', accentColor: 'primary' },
  icons: { container: 'rounded', containerBg: 'primary-light', size: 'md', color: 'primary' },
  sections: { pattern: 'solid', alternateColors: true, verticalPadding: 80 }
}

export const defaultEffects = {
  scrollAnimations: { enabled: true, style: 'slideUp', speed: 'normal' },
  cardHover: 'lift',
  buttonHover: 'lift'
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT SECTION STYLES - Design contextuel par section
// ═══════════════════════════════════════════════════════════════════════════

export const defaultSectionStyles = {
  header: {
    background: { color: '#ffffff', transparent: false },
    logo: { size: 'md', color: null },
    ctaButton: { bgColor: null, textColor: '#ffffff', radius: 12 },
    shadow: false
  },
  hero: {
    background: { color: '#f9fafb', hasImage: false, overlayOpacity: 50 },
    badge: { bgColor: null, textColor: null, radius: 20 },
    title: { color: '#1f2937', size: 'lg' },
    primaryButton: { bgColor: null, textColor: '#ffffff' },
    secondaryButton: { borderColor: null, textColor: null },
    buttonRadius: 12,
    padding: { vertical: 80 }
  },
  services: {
    background: { color: '#ffffff' },
    cardPreset: 'minimal',
    cardRadius: 16,
    cardBg: '#ffffff',
    iconShape: 'rounded',
    iconBgColor: null,
    iconColor: null,
    columns: 4,
    gap: 24
  },
  about: {
    background: { color: '#f9fafb' },
    padding: { vertical: 80 },
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
    textAlign: 'center'
  },
  testimonials: {
    background: { color: '#ffffff' },
    cardBg: '#f9fafb',
    cardRadius: 16,
    cardBorder: true,
    starColor: null,
    layout: 'grid'
  },
  faq: {
    background: { color: '#f9fafb' },
    questionBg: '#ffffff',
    questionColor: '#1f2937',
    radius: 16,
    border: true
  },
  cta: {
    background: { color: null },
    padding: { vertical: 80 },
    textAlign: 'center'
  },
  contact: {
    background: { color: '#f9fafb' },
    padding: { vertical: 80 }
  },
  footer: {
    background: { color: '#1a1a1a' },
    textColor: '#ffffff'
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // MODULES STYLES
  // ═══════════════════════════════════════════════════════════════════════════
  booking: {
    background: { color: '#faf5ff', gradient: null },
    padding: { vertical: 80 },
    // Header
    titleColor: '#1f2937',
    titleSize: 36,
    subtitleColor: '#6b7280',
    textAlign: 'center',
    // Services cards
    cardBg: '#ffffff',
    cardRadius: 20,
    cardShadow: 'lg',
    cardHoverEffect: true,
    serviceIconSize: 48,
    serviceNameColor: '#1f2937',
    servicePriceColor: null, // null = use primary
    // Calendar
    calendarBg: '#ffffff',
    calendarRadius: 16,
    dayAvailableColor: null, // null = use primary
    dayUnavailableColor: '#e5e7eb',
    daySelectedColor: null, // null = use primary
    // Time slots
    slotBg: '#f3f4f6',
    slotSelectedBg: null, // null = use primary
    slotRadius: 12,
    // Form
    formBg: '#ffffff',
    formRadius: 24,
    inputRadius: 12,
    // Button
    buttonRadius: 12,
    buttonSize: 'lg'
  },
  ecommerce: {
    background: { color: '#f8fafc', gradient: null },
    padding: { vertical: 80 },
    // Header
    titleColor: '#1f2937',
    subtitleColor: '#6b7280',
    textAlign: 'center',
    // Cards
    cardBg: '#ffffff',
    cardRadius: 16,
    cardShadow: 'md',
    cardHoverEffect: true,
    cardBorder: false,
    // Layout
    columns: 3,
    gap: 24,
    // Image
    imageRatio: '1/1',
    imageFit: 'cover',
    // Price
    priceColor: null, // null = use primary
    originalPriceColor: '#9ca3af',
    // Badge
    badgePosition: 'top-left',
    // Button
    buttonRadius: 12,
    buttonStyle: 'filled' // 'filled' | 'outline' | 'ghost'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EDITABLE FIELDS MAP - Pour Click-to-Edit (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════

export const editableFieldsMap = {
  header: {
    logoText: { label: "Logo", type: "text", maxLength: 30 },
    ctaButton: { label: "Bouton CTA", type: "button" }
  },
  hero: {
    badge: { label: "Badge", type: "text", maxLength: 50 },
    title: { label: "Titre principal", type: "text", maxLength: 80 },
    subtitle: { label: "Sous-titre", type: "textarea", maxLength: 200 },
    ctaPrimary: { label: "Bouton principal", type: "button" },
    ctaSecondary: { label: "Bouton secondaire", type: "button" }
  },
  services: {
    title: { label: "Titre section", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" }
  },
  about: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "text" },
    content: { label: "Contenu", type: "textarea" }
  },
  testimonials: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" }
  },
  faq: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" }
  },
  cta: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" },
    buttonPrimary: { label: "Bouton principal", type: "button" },
    buttonSecondary: { label: "Bouton secondaire", type: "button" }
  },
  contact: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" },
    phone: { label: "Téléphone", type: "text" },
    email: { label: "Email", type: "email" },
    address: { label: "Adresse", type: "textarea" }
  },
  footer: {
    logoText: { label: "Logo", type: "text" },
    description: { label: "Description", type: "textarea" },
    copyright: { label: "Copyright", type: "text" }
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // MODULES EDITABLE FIELDS
  // ═══════════════════════════════════════════════════════════════════════════
  booking: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" },
    buttonText: { label: "Texte du bouton", type: "text" }
  },
  ecommerce: {
    title: { label: "Titre", type: "text" },
    subtitle: { label: "Sous-titre", type: "textarea" }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SITE TEMPLATE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const siteTemplate = {
  schema: {
    meta: { version: "5.0.0" },
    sections: [
      {
        id: "header",
        name: "En-tête",
        icon: "🧭",
        order: 0,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "logoText", type: "text", label: "Texte logo", maxLength: 30 },
          { id: "menuItems", type: "menuItems", label: "Menu" },
          { id: "ctaButton", type: "button", label: "Bouton CTA" },
          { id: "sticky", type: "toggle", label: "Header fixe au scroll" }
        ]
      },
      {
        id: "hero",
        name: "Hero - Accueil",
        icon: "🎯",
        order: 1,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "badge", type: "text", label: "Badge", maxLength: 50 },
          { id: "title", type: "text", label: "Titre principal", maxLength: 80 },
          { id: "subtitle", type: "textarea", label: "Sous-titre", maxLength: 200 },
          { id: "ctaPrimary", type: "button", label: "Bouton principal" },
          { id: "ctaSecondary", type: "button", label: "Bouton secondaire" },
          { id: "stats", type: "array", label: "Chiffres clés", maxItems: 4 }
        ]
      },
      {
        id: "services",
        name: "Nos Services",
        icon: "💼",
        order: 2,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre section" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "items", type: "array", label: "Liste des services" }
        ]
      },
      {
        id: "about",
        name: "À propos",
        icon: "📖",
        order: 3,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "text", label: "Sous-titre" },
          { id: "content", type: "textarea", label: "Contenu" },
          { id: "values", type: "array", label: "Nos valeurs" },
          { id: "cta", type: "button", label: "Bouton" }
        ]
      },
      {
        id: "testimonials",
        name: "Témoignages",
        icon: "⭐",
        order: 4,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre section" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "items", type: "array", label: "Liste des témoignages" }
        ]
      },
      {
        id: "faq",
        name: "FAQ",
        icon: "❓",
        order: 5,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "items", type: "array", label: "Questions/Réponses" }
        ]
      },
      {
        id: "cta",
        name: "Bannière CTA",
        icon: "📢",
        order: 6,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "buttonPrimary", type: "button", label: "Bouton principal" },
          { id: "buttonSecondary", type: "button", label: "Bouton secondaire" }
        ]
      },
      {
        id: "contact",
        name: "Contact",
        icon: "📞",
        order: 7,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "phone", type: "text", label: "Téléphone" },
          { id: "email", type: "email", label: "Email" },
          { id: "address", type: "textarea", label: "Adresse" },
          { id: "hours", type: "text", label: "Horaires" },
          { id: "locations", type: "array", label: "Zones intervention" },
          { id: "showForm", type: "toggle", label: "Afficher formulaire" },
          { id: "socials", type: "array", label: "Réseaux sociaux" }
        ]
      },
      {
        id: "footer",
        name: "Pied de page",
        icon: "🦶",
        order: 8,
        fields: [
          { id: "enabled", type: "toggle", label: "Section active" },
          { id: "logoText", type: "text", label: "Texte logo" },
          { id: "description", type: "textarea", label: "Description courte" },
          { id: "copyright", type: "text", label: "Copyright" },
          { id: "socials", type: "array", label: "Réseaux sociaux" },
          { id: "legalLinks", type: "array", label: "Liens légaux" }
        ]
      }
    ],
    // ═══════════════════════════════════════════════════════════════════════════
    // MODULES - Extensions optionnelles
    // ═══════════════════════════════════════════════════════════════════════════
    modules: [
      {
        id: "booking",
        name: "Réservation",
        icon: "📅",
        description: "Permettez à vos clients de réserver en ligne",
        fields: [
          { id: "enabled", type: "toggle", label: "Module actif" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "services", type: "bookingServices", label: "Services réservables" },
          { id: "timeSlotDuration", type: "select", label: "Durée des créneaux", options: [15, 30, 45, 60, 90, 120] },
          { id: "openingHours", type: "openingHours", label: "Horaires d'ouverture" },
          { id: "showCalendar", type: "toggle", label: "Afficher le calendrier" },
          { id: "showTimeSlots", type: "toggle", label: "Afficher les créneaux" },
          { id: "requirePhone", type: "toggle", label: "Téléphone obligatoire" },
          { id: "requireMessage", type: "toggle", label: "Message obligatoire" },
          { id: "buttonText", type: "text", label: "Texte du bouton" },
          { id: "confirmationTitle", type: "text", label: "Titre de confirmation" },
          { id: "confirmationMessage", type: "textarea", label: "Message de confirmation" }
        ]
      },
      {
        id: "ecommerce",
        name: "E-commerce",
        icon: "🛒",
        description: "Vendez vos produits en ligne",
        fields: [
          { id: "enabled", type: "toggle", label: "Module actif" },
          { id: "title", type: "text", label: "Titre" },
          { id: "subtitle", type: "textarea", label: "Sous-titre" },
          { id: "categories", type: "array", label: "Catégories" },
          { id: "products", type: "ecommerceProducts", label: "Produits" },
          { id: "showPrices", type: "toggle", label: "Afficher les prix" },
          { id: "showStock", type: "toggle", label: "Afficher le stock" },
          { id: "showRatings", type: "toggle", label: "Afficher les notes" },
          { id: "showFilters", type: "toggle", label: "Afficher les filtres" },
          { id: "showSearch", type: "toggle", label: "Afficher la recherche" },
          { id: "columns", type: "select", label: "Colonnes", options: [2, 3, 4] },
          { id: "cartButtonText", type: "text", label: "Texte bouton panier" },
          { id: "emptyCartMessage", type: "text", label: "Message panier vide" }
        ]
      }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE DEFAULT CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export function generateDefaultContent(siteName, siteSlug) {
  return {
    theme: { ...defaultTheme },
    styles: { ...defaultStyles },
    effects: { ...defaultEffects },
    images: { logo: null, heroBackground: null, favicon: null },
    // Ordre des sections (permet le drag & drop)
    sectionOrder: ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer'],
    header: {
      enabled: true,
      logoText: siteName,
      logoImage: null,
      menuItems: [
        { id: "m1", label: "Accueil", url: "#hero" },
        { id: "m2", label: "Services", url: "#services" },
        { id: "m3", label: "À propos", url: "#about" },
        { id: "m4", label: "Contact", url: "#contact" }
      ],
      ctaButton: { text: "Contact", url: "#contact" },
      sticky: true,
      styles: { ...defaultSectionStyles.header }
    },
    hero: {
      enabled: true,
      badge: "Bienvenue",
      title: `Bienvenue chez ${siteName}`,
      subtitle: "Décrivez ici votre activité en quelques mots. Qu'est-ce qui vous rend unique ?",
      ctaPrimary: { text: "Découvrir", url: "#services" },
      ctaSecondary: { text: "Contact", url: "#contact" },
      stats: [
        { id: "s1", value: "10+", label: "Années d'expérience" },
        { id: "s2", value: "100%", label: "Clients satisfaits" },
        { id: "s3", value: "24/7", label: "Support disponible" }
      ],
      styles: { ...defaultSectionStyles.hero }
    },
    services: {
      enabled: true,
      title: "Nos Services",
      subtitle: "Découvrez ce que nous pouvons faire pour vous",
      items: [
        { id: "srv1", icon: "Search", name: "Service 1", tagline: "Votre tagline ici", description: "Description de votre premier service.", price: "Sur devis" },
        { id: "srv2", icon: "Target", name: "Service 2", tagline: "Votre tagline ici", description: "Description de votre deuxième service.", price: "Sur devis" },
        { id: "srv3", icon: "Rocket", name: "Service 3", tagline: "Votre tagline ici", description: "Description de votre troisième service.", price: "Sur devis" }
      ],
      styles: { ...defaultSectionStyles.services }
    },
    about: {
      enabled: true,
      title: "À propos de nous",
      subtitle: "Notre histoire",
      content: `${siteName} est une entreprise passionnée par ce qu'elle fait. Nous mettons notre expertise au service de nos clients.`,
      values: [
        { id: "v1", icon: "Heart", title: "Passion", description: "Ce qui nous anime" },
        { id: "v2", icon: "Users", title: "Équipe", description: "Des experts dédiés" },
        { id: "v3", icon: "Target", title: "Résultats", description: "Notre priorité" }
      ],
      cta: { text: "En savoir plus", url: "#contact" },
      styles: { ...defaultSectionStyles.about }
    },
    testimonials: {
      enabled: true,
      title: "Ce que disent nos clients",
      subtitle: "Ils nous font confiance",
      items: [
        { id: "t1", quote: "Une expérience exceptionnelle ! Je recommande vivement.", author: "Client Satisfait", role: "CEO", company: "Entreprise ABC", rating: 5 },
        { id: "t2", quote: "Professionnalisme et qualité au rendez-vous.", author: "Autre Client", role: "Directeur", company: "Société XYZ", rating: 5 }
      ],
      styles: { ...defaultSectionStyles.testimonials }
    },
    faq: {
      enabled: true,
      title: "Questions fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      items: [
        { id: "f1", question: "Comment puis-je vous contacter ?", answer: "Vous pouvez nous contacter via le formulaire ci-dessous, par téléphone ou par email." },
        { id: "f2", question: "Quels sont vos délais ?", answer: "Nos délais varient selon les projets. Contactez-nous pour obtenir une estimation." }
      ],
      styles: { ...defaultSectionStyles.faq }
    },
    cta: {
      enabled: true,
      title: "Prêt à commencer ?",
      subtitle: "Contactez-nous dès aujourd'hui pour discuter de votre projet.",
      buttonPrimary: { text: "Nous contacter", url: "#contact" },
      buttonSecondary: { text: "En savoir plus", url: "#about" },
      styles: { ...defaultSectionStyles.cta }
    },
    contact: {
      enabled: true,
      title: "Contactez-nous",
      subtitle: "Nous sommes là pour vous aider",
      phone: "01 23 45 67 89",
      email: `contact@${siteSlug}.fr`,
      address: "123 Rue Exemple, 75000 Paris",
      hours: "Lun-Ven : 9h-18h",
      locations: ["Paris", "Lyon", "Marseille"],
      showForm: true,
      socials: [
        { id: "so1", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
        { id: "so2", platform: "Twitter", url: "https://twitter.com", icon: "Twitter" }
      ],
      styles: { ...defaultSectionStyles.contact }
    },
    footer: {
      enabled: true,
      logoText: siteName,
      description: `${siteName} - Votre partenaire de confiance.`,
      copyright: `© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.`,
      socials: [
        { id: "fs1", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
        { id: "fs2", platform: "Twitter", url: "https://twitter.com", icon: "Twitter" }
      ],
      legalLinks: [
        { id: "ll1", label: "Mentions légales", url: "/mentions-legales" },
        { id: "ll2", label: "Confidentialité", url: "/confidentialite" }
      ],
      styles: { ...defaultSectionStyles.footer }
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // MODULES - Désactivés par défaut
    // ═══════════════════════════════════════════════════════════════════════════
    booking: {
      enabled: false,
      isModule: true,
      // ─── HEADER ───────────────────────────────────────────────────────────────
      title: "Réservez votre moment bien-être",
      subtitle: "Choisissez votre prestation et réservez en ligne 24h/24. Paiement sur place, annulation gratuite jusqu'à 24h avant.",
      badge: "✨ Réservation instantanée",
      // ─── SERVICES ─────────────────────────────────────────────────────────────
      services: [
        { 
          id: "b1", 
          name: "Consultation Découverte", 
          icon: "Sparkles",
          duration: 30, 
          price: 0, 
          priceLabel: "Offert",
          description: "Un premier échange pour comprendre vos besoins et vous proposer un accompagnement sur-mesure.",
          color: "#10b981",
          popular: false
        },
        { 
          id: "b2", 
          name: "Séance Classique", 
          icon: "Clock",
          duration: 60, 
          price: 65, 
          priceLabel: "65 €",
          description: "Notre prestation signature. Une heure dédiée à votre bien-être avec un suivi personnalisé.",
          color: "#8b5cf6",
          popular: true
        },
        { 
          id: "b3", 
          name: "Séance Premium", 
          icon: "Crown",
          duration: 90, 
          price: 95, 
          priceLabel: "95 €",
          description: "L'expérience complète : séance approfondie + conseils personnalisés + suivi par email.",
          color: "#f59e0b",
          popular: false
        },
        { 
          id: "b4", 
          name: "Pack Sérénité", 
          icon: "Heart",
          duration: 120, 
          price: 150, 
          priceLabel: "150 €",
          description: "Forfait 3 séances à tarif préférentiel. Idéal pour un suivi régulier et des résultats durables.",
          color: "#ec4899",
          popular: false
        }
      ],
      // ─── CALENDAR & TIME SLOTS ────────────────────────────────────────────────
      showSteps: true,
      showCalendar: true,
      showTimeSlots: true,
      timeSlotDuration: 30,
      timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
      openingHours: {
        monday: { enabled: true, start: "09:00", end: "18:00", pause: { enabled: true, start: "12:00", end: "14:00" } },
        tuesday: { enabled: true, start: "09:00", end: "18:00", pause: { enabled: true, start: "12:00", end: "14:00" } },
        wednesday: { enabled: true, start: "09:00", end: "18:00", pause: { enabled: true, start: "12:00", end: "14:00" } },
        thursday: { enabled: true, start: "09:00", end: "19:00", pause: { enabled: true, start: "12:00", end: "14:00" } },
        friday: { enabled: true, start: "09:00", end: "18:00", pause: { enabled: true, start: "12:00", end: "14:00" } },
        saturday: { enabled: true, start: "09:00", end: "13:00", pause: { enabled: false, start: "", end: "" } },
        sunday: { enabled: false, start: "", end: "", pause: { enabled: false, start: "", end: "" } }
      },
      // ─── FORM ─────────────────────────────────────────────────────────────────
      formTitle: "Vos coordonnées",
      formSubtitle: "Pour confirmer votre réservation",
      fields: {
        firstName: { show: true, required: true, label: "Prénom", placeholder: "Votre prénom" },
        lastName: { show: true, required: true, label: "Nom", placeholder: "Votre nom" },
        email: { show: true, required: true, label: "Email", placeholder: "votre@email.com" },
        phone: { show: true, required: true, label: "Téléphone", placeholder: "06 00 00 00 00" },
        message: { show: true, required: false, label: "Message (optionnel)", placeholder: "Une information à nous communiquer ?" }
      },
      // ─── CTA & CONFIRMATION ───────────────────────────────────────────────────
      buttonText: "Confirmer ma réservation",
      buttonIcon: "Calendar",
      confirmationTitle: "Réservation confirmée ! 🎉",
      confirmationSubtitle: "Merci pour votre confiance",
      confirmationMessage: "Vous allez recevoir un email de confirmation avec tous les détails de votre rendez-vous. À très bientôt !",
      confirmationIcon: "CheckCircle",
      // ─── EXTRAS ───────────────────────────────────────────────────────────────
      showGuarantees: true,
      guarantees: [
        { icon: "Shield", text: "Paiement sur place" },
        { icon: "Clock", text: "Annulation gratuite 24h" },
        { icon: "Star", text: "4.9/5 (120+ avis)" }
      ],
      // ─── STYLES ───────────────────────────────────────────────────────────────
      styles: { ...defaultSectionStyles.booking }
    },
    ecommerce: {
      enabled: false,
      isModule: true,
      // ─── HEADER ───────────────────────────────────────────────────────────────
      title: "Notre Boutique",
      subtitle: "Découvrez notre sélection de produits soigneusement choisis pour vous",
      badge: "🚚 Livraison offerte dès 50€",
      // ─── OPTIONS D'AFFICHAGE ──────────────────────────────────────────────────
      showPrices: true,
      showStock: true,
      showRatings: true,
      showFilters: true,
      showSearch: true,
      showFloatingCart: true,
      enableQuickView: true,
      columns: 3,
      cardStyle: 'default',
      // ─── PANIER ───────────────────────────────────────────────────────────────
      cartButtonText: "Ajouter au panier",
      emptyCartMessage: "Votre panier est vide",
      // ─── CATÉGORIES ───────────────────────────────────────────────────────────
      categories: [
        { id: "cat1", name: "Tous", icon: "Grid" },
        { id: "cat2", name: "Nouveautés", icon: "Sparkles" },
        { id: "cat3", name: "Populaires", icon: "TrendingUp" },
        { id: "cat4", name: "Promos", icon: "Percent" }
      ],
      // ─── PRODUITS ─────────────────────────────────────────────────────────────
      products: [
        { 
          id: "p1", 
          name: "Coffret Découverte", 
          price: 49.99, 
          originalPrice: 69.99,
          priceLabel: "49,99 €",
          description: "Notre coffret signature pour découvrir nos meilleurs produits. Idéal pour débuter.", 
          image: null, 
          category: "cat2",
          stock: 15,
          rating: 5,
          reviewCount: 124,
          badge: "✨ Nouveau",
          badgeColor: "#3b82f6"
        },
        { 
          id: "p2", 
          name: "Pack Essentiel", 
          price: 29.99, 
          originalPrice: null,
          priceLabel: "29,99 €",
          description: "L'essentiel pour bien démarrer. Qualité premium, prix accessible.", 
          image: null, 
          category: "cat3",
          stock: 50,
          rating: 4.5,
          reviewCount: 89,
          badge: "🏆 Best-seller",
          badgeColor: "#10b981"
        },
        { 
          id: "p3", 
          name: "Édition Limitée", 
          price: 89.99, 
          originalPrice: 119.99,
          priceLabel: "89,99 €",
          description: "Édition collector en quantité très limitée. Ne la manquez pas !", 
          image: null, 
          category: "cat4",
          stock: 3,
          rating: 5,
          reviewCount: 47,
          badge: "🔥 -25%",
          badgeColor: "#ef4444"
        },
        { 
          id: "p4", 
          name: "Accessoire Premium", 
          price: 19.99, 
          originalPrice: null,
          priceLabel: "19,99 €",
          description: "L'accessoire indispensable pour compléter votre collection.", 
          image: null, 
          category: "cat3",
          stock: 100,
          rating: 4,
          reviewCount: 56,
          badge: null,
          badgeColor: null
        }
      ],
      // ─── STYLES ───────────────────────────────────────────────────────────────
      styles: { ...defaultSectionStyles.ecommerce }
    }
  }
}

export default siteTemplate
