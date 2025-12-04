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
    background: { color: '#f9fafb' },
    padding: { vertical: 80 },
    cardBg: '#ffffff',
    cardRadius: 16,
    accentColor: null
  },
  ecommerce: {
    background: { color: '#ffffff' },
    padding: { vertical: 80 },
    cardBg: '#ffffff',
    cardRadius: 16,
    columns: 3,
    gap: 24
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
          { id: "services", type: "array", label: "Services réservables" },
          { id: "buttonText", type: "text", label: "Texte du bouton" }
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
          { id: "products", type: "array", label: "Produits" },
          { id: "showPrices", type: "toggle", label: "Afficher les prix" }
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
      title: "Réservation en ligne",
      subtitle: "Choisissez votre créneau et réservez en quelques clics",
      buttonText: "Réserver maintenant",
      services: [
        { id: "b1", name: "Consultation", duration: "30 min", price: "50€", description: "Consultation standard" },
        { id: "b2", name: "Séance complète", duration: "1h", price: "80€", description: "Séance approfondie" }
      ],
      styles: { ...defaultSectionStyles.booking }
    },
    ecommerce: {
      enabled: false,
      isModule: true,
      title: "Notre Boutique",
      subtitle: "Découvrez nos produits",
      showPrices: true,
      products: [
        { id: "p1", name: "Produit 1", price: "29€", description: "Description du produit", image: null, inStock: true },
        { id: "p2", name: "Produit 2", price: "49€", description: "Description du produit", image: null, inStock: true }
      ],
      styles: { ...defaultSectionStyles.ecommerce }
    }
  }
}

export default siteTemplate
