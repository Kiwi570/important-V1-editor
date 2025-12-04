import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { siteTemplate, generateDefaultContent, defaultSectionStyles } from '../data/templates'

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL DEMO SITE - Minimise
// ═══════════════════════════════════════════════════════════════════════════

const minimiseContent = {
  theme: {
    primaryColor: '#2D5A3D',
    secondaryColor: '#E5B94E',
    fontHeading: 'playfair',
    fontBody: 'inter',
    mode: 'light'
  },
  styles: {
    buttons: { borderRadius: 12, size: 'md', shadow: 'medium', hoverEffect: 'lift' },
    cards: { borderRadius: 16, border: 'none', background: 'white', shadow: 'medium', padding: 'normal' },
    avatars: { shape: 'circle', size: 'md', border: 'white' },
    titles: { align: 'center', style: 'normal', accentColor: 'primary' },
    icons: { container: 'rounded', containerBg: 'primary-light', size: 'md', color: 'primary' },
    sections: { pattern: 'solid', alternateColors: true, verticalPadding: 80 }
  },
  effects: {
    scrollAnimations: { enabled: true, style: 'slideUp', speed: 'normal' },
    cardHover: 'lift',
    buttonHover: 'lift'
  },
  images: { logo: null, heroBackground: null, favicon: null },
  header: {
    enabled: true,
    logoText: "Minimise",
    menuItems: [
      { id: "m1", label: "Accueil", url: "#hero" },
      { id: "m2", label: "Services", url: "#services" },
      { id: "m3", label: "À propos", url: "#about" },
      { id: "m4", label: "FAQ", url: "#faq" },
      { id: "m5", label: "Contact", url: "#contact" }
    ],
    ctaButton: { text: "Prendre RDV", url: "#contact" },
    sticky: true,
    styles: { ...defaultSectionStyles.header }
  },
  hero: {
    enabled: true,
    badge: "L'agence RSE du Grand Est",
    title: "Faites de la RSE un levier de croissance",
    subtitle: "Accompagnement sur-mesure pour TPE et PME du Grand Est. Transformez vos contraintes réglementaires en avantages compétitifs.",
    ctaPrimary: { text: "Évaluer ma maturité RSE", url: "#contact" },
    ctaSecondary: { text: "Prendre rendez-vous", url: "#contact" },
    stats: [
      { id: "s1", value: "47+", label: "Entreprises accompagnées" },
      { id: "s2", value: "92%", label: "Clients satisfaits" },
      { id: "s3", value: "-23%", label: "Réduction coûts énergie" }
    ],
    styles: { ...defaultSectionStyles.hero }
  },
  services: {
    enabled: true,
    title: "Nos accompagnements",
    subtitle: "Des solutions adaptées à chaque étape de votre démarche RSE",
    items: [
      { id: "srv1", icon: "Search", name: "Diagnostic RSE", tagline: "Évaluer votre maturité", description: "Un état des lieux complet de votre entreprise sur les 3 piliers de la RSE.", price: "À partir de 1 500€ HT" },
      { id: "srv2", icon: "Target", name: "Stratégie & Roadmap", tagline: "Définir votre cap", description: "Construction de votre feuille de route RSE alignée avec vos objectifs business.", price: "À partir de 3 000€ HT" },
      { id: "srv3", icon: "Rocket", name: "Déploiement & Pilotage", tagline: "Passer à l'action", description: "Mise en œuvre concrète de vos actions RSE avec un suivi régulier.", price: "Sur devis" },
      { id: "srv4", icon: "GraduationCap", name: "Formation", tagline: "Embarquer vos équipes", description: "Ateliers et formations pour engager vos collaborateurs dans la RSE.", price: "À partir de 800€ HT" }
    ],
    styles: { ...defaultSectionStyles.services }
  },
  about: {
    enabled: true,
    title: "Qui sommes-nous ?",
    subtitle: "Une équipe passionnée par l'impact positif",
    content: "Fondée en 2020, Minimise accompagne les entreprises du Grand Est dans leur transition vers un modèle plus durable. Notre approche pragmatique permet à chaque organisation de transformer ses contraintes RSE en opportunités de croissance.",
    values: [
      { id: "v1", icon: "Heart", title: "Engagement", description: "L'impact positif au cœur de tout" },
      { id: "v2", icon: "Users", title: "Proximité", description: "Un accompagnement humain" },
      { id: "v3", icon: "Target", title: "Pragmatisme", description: "Des solutions concrètes" },
      { id: "v4", icon: "TrendingUp", title: "Performance", description: "La RSE rentable" }
    ],
    cta: { text: "Découvrir notre équipe", url: "#contact" },
    styles: { ...defaultSectionStyles.about }
  },
  testimonials: {
    enabled: true,
    title: "Ils nous font confiance",
    subtitle: "Découvrez les retours de nos clients",
    items: [
      { id: "t1", quote: "Minimise nous a permis de structurer notre démarche RSE de manière pragmatique. Résultat : -18% sur notre facture énergétique en 1 an !", author: "Marie Dupont", role: "Directrice Générale", company: "TechVert Solutions", rating: 5 },
      { id: "t2", quote: "Un accompagnement sur-mesure qui a transformé notre vision de la RSE. Ce n'est plus une contrainte mais un vrai levier de différenciation.", author: "Jean Martin", role: "Fondateur", company: "EcoLogis", rating: 5 },
      { id: "t3", quote: "L'équipe de Minimise a su rendre la RSE accessible pour notre PME. Nos collaborateurs sont pleinement engagés.", author: "Sophie Bernard", role: "DRH", company: "Lorraine Industrie", rating: 5 }
    ],
    styles: { ...defaultSectionStyles.testimonials }
  },
  faq: {
    enabled: true,
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir sur la RSE",
    items: [
      { id: "f1", question: "Qu'est-ce que la RSE exactement ?", answer: "La Responsabilité Sociétale des Entreprises couvre trois piliers : environnemental, social et gouvernance." },
      { id: "f2", question: "La RSE est-elle obligatoire pour les PME ?", answer: "Certaines obligations existent selon la taille. Mais la RSE est surtout un levier de performance et d'attractivité." },
      { id: "f3", question: "Combien de temps dure un accompagnement ?", answer: "Un diagnostic prend 2-3 semaines. Un accompagnement complet s'étale sur 6 à 12 mois." },
      { id: "f4", question: "Quels sont les bénéfices concrets ?", answer: "Réduction des coûts, attractivité employeur, fidélisation clients, et impact positif sur la planète !" }
    ],
    styles: { ...defaultSectionStyles.faq }
  },
  cta: {
    enabled: true,
    title: "Prêt à passer à l'action ?",
    subtitle: "Réservez un appel découverte gratuit de 30 minutes.",
    buttonPrimary: { text: "Réserver mon appel gratuit", url: "#contact" },
    buttonSecondary: { text: "Télécharger notre guide", url: "#" },
    styles: { ...defaultSectionStyles.cta }
  },
  contact: {
    enabled: true,
    title: "Contactez-nous",
    subtitle: "Une question ? Un projet ? Parlons-en !",
    phone: "06 12 34 56 78",
    email: "contact@minimise.fr",
    address: "12 rue de la RSE, 57000 Metz",
    hours: "Lun-Ven : 9h-18h",
    locations: ["Metz", "Nancy", "Strasbourg", "Luxembourg", "Reims"],
    showForm: true,
    socials: [
      { id: "so1", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { id: "so2", platform: "Twitter", url: "https://twitter.com", icon: "Twitter" }
    ],
    styles: { ...defaultSectionStyles.contact }
  },
  footer: {
    enabled: true,
    logoText: "Minimise",
    description: "L'agence RSE du Grand Est. Accompagnement des TPE/PME vers un modèle durable.",
    copyright: "© 2024 Minimise. Tous droits réservés.",
    socials: [
      { id: "fs1", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { id: "fs2", platform: "Twitter", url: "https://twitter.com", icon: "Twitter" }
    ],
    legalLinks: [
      { id: "ll1", label: "Mentions légales", url: "/mentions-legales" },
      { id: "ll2", label: "Confidentialité", url: "/confidentialite" }
    ],
    styles: { ...defaultSectionStyles.footer }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SITES STORE
// ═══════════════════════════════════════════════════════════════════════════

export const useSitesStore = create(
  persist(
    (set, get) => ({
      // STATE
      sites: {},
      isLoaded: false,

      // INITIALIZATION
      initializeSites: () => {
        const { sites, isLoaded } = get()
        if (isLoaded && Object.keys(sites).length > 0) return

        if (Object.keys(sites).length === 0) {
          const minimiseSite = {
            id: "site-minimise",
            name: "Minimise",
            slug: "minimise",
            domain: "minimise.fr",
            status: "published",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            schema: siteTemplate.schema,
            draft_content: minimiseContent,
            published_content: minimiseContent
          }
          set({ sites: { minimise: minimiseSite }, isLoaded: true })
        } else {
          set({ isLoaded: true })
        }
      },

      // GETTERS
      getSite: (slug) => get().sites[slug] || null,
      getAllSites: () => Object.values(get().sites).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      getSiteCount: () => Object.keys(get().sites).length,

      // CRUD
      createSite: (name, customSlug = null) => {
        const { sites } = get()
        let slug = customSlug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        let finalSlug = slug
        let counter = 1
        while (sites[finalSlug]) {
          finalSlug = `${slug}-${counter}`
          counter++
        }

        const now = new Date().toISOString()
        const content = generateDefaultContent(name, finalSlug)
        
        const newSite = {
          id: `site-${Date.now()}`,
          name,
          slug: finalSlug,
          domain: `${finalSlug}.fr`,
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          publishedAt: null,
          schema: siteTemplate.schema,
          draft_content: content,
          published_content: content
        }

        set(state => ({ sites: { ...state.sites, [finalSlug]: newSite } }))
        return newSite
      },

      updateSite: (slug, updates) => {
        const { sites } = get()
        if (!sites[slug]) return false
        set(state => ({
          sites: {
            ...state.sites,
            [slug]: { ...state.sites[slug], ...updates, updatedAt: new Date().toISOString() }
          }
        }))
        return true
      },

      updateSiteContent: (slug, content) => get().updateSite(slug, { draft_content: content }),

      publishSite: (slug) => {
        const { sites } = get()
        const site = sites[slug]
        if (!site) return false

        const now = new Date().toISOString()
        set(state => ({
          sites: {
            ...state.sites,
            [slug]: {
              ...state.sites[slug],
              published_content: JSON.parse(JSON.stringify(site.draft_content)),
              status: 'published',
              publishedAt: now,
              updatedAt: now
            }
          }
        }))
        return true
      },

      duplicateSite: (slug) => {
        const { sites, createSite } = get()
        const originalSite = sites[slug]
        if (!originalSite) return null

        const newName = `${originalSite.name} (copie)`
        const newSite = createSite(newName)
        
        set(state => ({
          sites: {
            ...state.sites,
            [newSite.slug]: {
              ...state.sites[newSite.slug],
              draft_content: JSON.parse(JSON.stringify(originalSite.draft_content)),
              published_content: JSON.parse(JSON.stringify(originalSite.published_content))
            }
          }
        }))
        return newSite
      },

      deleteSite: (slug) => {
        const { sites } = get()
        if (!sites[slug] || Object.keys(sites).length <= 1) return false
        const newSites = { ...sites }
        delete newSites[slug]
        set({ sites: newSites })
        return true
      },

      renameSite: (slug, newName) => get().updateSite(slug, { name: newName })
    }),
    {
      name: 'universal-editor-sites-v2',
      version: 6, // Bump version for premium booking module
      migrate: (persistedState, version) => {
        // Migration pour ajouter les styles de section manquants
        if (version < 3 && persistedState?.sites) {
          const sectionNames = ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer']
          
          Object.keys(persistedState.sites).forEach(slug => {
            const site = persistedState.sites[slug]
            
            // Migrer draft_content
            if (site.draft_content) {
              sectionNames.forEach(sectionName => {
                if (site.draft_content[sectionName] && !site.draft_content[sectionName].styles) {
                  site.draft_content[sectionName].styles = { ...defaultSectionStyles[sectionName] }
                }
              })
            }
            
            // Migrer published_content
            if (site.published_content) {
              sectionNames.forEach(sectionName => {
                if (site.published_content[sectionName] && !site.published_content[sectionName].styles) {
                  site.published_content[sectionName].styles = { ...defaultSectionStyles[sectionName] }
                }
              })
            }
          })
        }
        
        // Migration v4: Ajouter les modules aux sites existants
        if (version < 4 && persistedState?.sites) {
          Object.keys(persistedState.sites).forEach(slug => {
            const site = persistedState.sites[slug]
            
            // Mettre à jour le schéma pour inclure les modules
            site.schema = siteTemplate.schema
            
            // Ajouter les modules au draft_content s'ils n'existent pas
            if (site.draft_content && !site.draft_content.booking) {
              site.draft_content.booking = {
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
              }
            }
            
            if (site.draft_content && !site.draft_content.ecommerce) {
              site.draft_content.ecommerce = {
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
            
            // Même chose pour published_content
            if (site.published_content && !site.published_content.booking) {
              site.published_content.booking = { ...site.draft_content.booking }
            }
            if (site.published_content && !site.published_content.ecommerce) {
              site.published_content.ecommerce = { ...site.draft_content.ecommerce }
            }
          })
        }
        
        // Migration v5: Enrichir les modules avec les nouveaux champs
        if (version < 5 && persistedState?.sites) {
          Object.keys(persistedState.sites).forEach(slug => {
            const site = persistedState.sites[slug]
            
            // Enrichir le module booking
            if (site.draft_content?.booking) {
              const booking = site.draft_content.booking
              // Ajouter les nouveaux champs s'ils n'existent pas
              if (!booking.timeSlotDuration) booking.timeSlotDuration = 30
              if (booking.showCalendar === undefined) booking.showCalendar = true
              if (booking.showTimeSlots === undefined) booking.showTimeSlots = true
              if (booking.requirePhone === undefined) booking.requirePhone = true
              if (booking.requireMessage === undefined) booking.requireMessage = false
              if (!booking.confirmationTitle) booking.confirmationTitle = "Réservation confirmée ! 🎉"
              if (!booking.confirmationMessage) booking.confirmationMessage = "Merci pour votre réservation. Vous recevrez un email de confirmation."
              if (!booking.openingHours) {
                booking.openingHours = {
                  monday: { enabled: true, start: "09:00", end: "18:00" },
                  tuesday: { enabled: true, start: "09:00", end: "18:00" },
                  wednesday: { enabled: true, start: "09:00", end: "18:00" },
                  thursday: { enabled: true, start: "09:00", end: "18:00" },
                  friday: { enabled: true, start: "09:00", end: "17:00" },
                  saturday: { enabled: false, start: "10:00", end: "13:00" },
                  sunday: { enabled: false, start: "", end: "" }
                }
              }
              // Enrichir les services existants
              if (booking.services) {
                booking.services = booking.services.map((service, i) => ({
                  ...service,
                  icon: service.icon || 'Star',
                  color: service.color || ['#10b981', '#3b82f6', '#8b5cf6'][i % 3],
                  duration: typeof service.duration === 'string' ? parseInt(service.duration) || 30 : service.duration,
                  price: typeof service.price === 'string' ? parseFloat(service.price) || 0 : service.price,
                  priceLabel: service.priceLabel || (service.price === 0 || service.price === '0€' ? 'Gratuit' : service.price)
                }))
              }
            }
            
            // Enrichir le module ecommerce
            if (site.draft_content?.ecommerce) {
              const ecom = site.draft_content.ecommerce
              if (ecom.showStock === undefined) ecom.showStock = true
              if (ecom.showRatings === undefined) ecom.showRatings = true
              if (ecom.showFilters === undefined) ecom.showFilters = true
              if (ecom.showSearch === undefined) ecom.showSearch = true
              if (!ecom.columns) ecom.columns = 3
              if (!ecom.cartButtonText) ecom.cartButtonText = "Ajouter au panier"
              if (!ecom.emptyCartMessage) ecom.emptyCartMessage = "Votre panier est vide"
              if (!ecom.categories) {
                ecom.categories = [
                  { id: "cat1", name: "Tous", icon: "Grid" },
                  { id: "cat2", name: "Nouveautés", icon: "Sparkles" }
                ]
              }
            }
            
            // Appliquer les mêmes modifications au published_content
            if (site.published_content?.booking) {
              Object.assign(site.published_content.booking, site.draft_content.booking)
            }
            if (site.published_content?.ecommerce) {
              Object.assign(site.published_content.ecommerce, site.draft_content.ecommerce)
            }
          })
        }
        
        // Migration v6: Module Booking Premium avec données enrichies
        if (version < 6 && persistedState?.sites) {
          Object.keys(persistedState.sites).forEach(slug => {
            const site = persistedState.sites[slug]
            
            if (site.draft_content?.booking) {
              const booking = site.draft_content.booking
              
              // Ajouter les nouveaux champs premium
              if (!booking.badge) booking.badge = "✨ Réservation instantanée"
              if (!booking.showSteps) booking.showSteps = true
              if (!booking.timeSlots) {
                booking.timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"]
              }
              if (!booking.formTitle) booking.formTitle = "Vos coordonnées"
              if (!booking.formSubtitle) booking.formSubtitle = "Pour confirmer votre réservation"
              if (!booking.fields) {
                booking.fields = {
                  firstName: { show: true, required: true, label: "Prénom", placeholder: "Votre prénom" },
                  lastName: { show: true, required: true, label: "Nom", placeholder: "Votre nom" },
                  email: { show: true, required: true, label: "Email", placeholder: "votre@email.com" },
                  phone: { show: true, required: true, label: "Téléphone", placeholder: "06 00 00 00 00" },
                  message: { show: true, required: false, label: "Message (optionnel)", placeholder: "Une information à nous communiquer ?" }
                }
              }
              if (!booking.buttonIcon) booking.buttonIcon = "Calendar"
              if (!booking.confirmationSubtitle) booking.confirmationSubtitle = "Merci pour votre confiance"
              if (!booking.confirmationIcon) booking.confirmationIcon = "CheckCircle"
              if (booking.showGuarantees === undefined) booking.showGuarantees = true
              if (!booking.guarantees) {
                booking.guarantees = [
                  { icon: "Shield", text: "Paiement sur place" },
                  { icon: "Clock", text: "Annulation gratuite 24h" },
                  { icon: "Star", text: "4.9/5 (120+ avis)" }
                ]
              }
              
              // Enrichir les services existants avec les nouvelles propriétés
              if (booking.services) {
                const defaultColors = ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899']
                booking.services = booking.services.map((service, i) => ({
                  ...service,
                  icon: service.icon || 'Star',
                  color: service.color || defaultColors[i % defaultColors.length],
                  duration: typeof service.duration === 'string' ? parseInt(service.duration) || 60 : (service.duration || 60),
                  price: typeof service.price === 'string' ? parseFloat(service.price) || 0 : (service.price || 0),
                  priceLabel: service.priceLabel || (service.price === 0 ? 'Offert' : `${service.price} €`),
                  popular: service.popular || false
                }))
              }
              
              // Copier vers published_content
              if (site.published_content?.booking) {
                site.published_content.booking = { ...booking }
              }
            }
            
            // Migration E-commerce Premium
            if (site.draft_content?.ecommerce) {
              const ecom = site.draft_content.ecommerce
              
              // Ajouter les nouveaux champs
              if (!ecom.badge) ecom.badge = "🚚 Livraison offerte dès 50€"
              if (ecom.showFloatingCart === undefined) ecom.showFloatingCart = true
              if (ecom.enableQuickView === undefined) ecom.enableQuickView = true
              if (!ecom.cardStyle) ecom.cardStyle = 'default'
              
              // Enrichir les produits existants
              if (ecom.products) {
                const badgeColors = { 'Nouveau': '#3b82f6', 'Best-seller': '#10b981', 'Promo': '#ef4444' }
                ecom.products = ecom.products.map(product => ({
                  ...product,
                  priceLabel: product.priceLabel || `${product.price} €`,
                  badgeColor: product.badgeColor || badgeColors[product.badge] || '#8b5cf6'
                }))
              }
              
              // Copier vers published_content
              if (site.published_content?.ecommerce) {
                site.published_content.ecommerce = { ...ecom }
              }
            }
          })
        }
        
        return persistedState
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          const sites = state.sites || {}
          Object.keys(sites).forEach(slug => {
            // Toujours mettre à jour le schéma pour avoir les dernières sections/modules
            sites[slug].schema = siteTemplate.schema
          })
        }
      }
    }
  )
)

export default useSitesStore
