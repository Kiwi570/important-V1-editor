// ═══════════════════════════════════════════════════════════════════════════
// USER PREFERENCES STORE - Préférences utilisateur pour l'IA
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS - Options disponibles
// ═══════════════════════════════════════════════════════════════════════════

export const ACTIVITY_CATEGORIES = [
  { id: 'artisan', label: 'Artisan', emoji: '🔧', examples: 'plombier, électricien, menuisier...' },
  { id: 'commerce', label: 'Commerce', emoji: '🏪', examples: 'boutique, épicerie, fleuriste...' },
  { id: 'service', label: 'Service', emoji: '💼', examples: 'consultant, avocat, comptable...' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', examples: 'restaurant, café, traiteur...' },
  { id: 'sante', label: 'Santé', emoji: '🏥', examples: 'médecin, kiné, dentiste...' },
  { id: 'tech', label: 'Tech', emoji: '💻', examples: 'développeur, agence web, startup...' },
  { id: 'creatif', label: 'Créatif', emoji: '🎨', examples: 'graphiste, photographe, vidéaste...' },
  { id: 'formation', label: 'Formation', emoji: '📚', examples: 'coach, formateur, école...' },
  { id: 'immobilier', label: 'Immobilier', emoji: '🏠', examples: 'agent, promoteur, architecte...' },
  { id: 'autre', label: 'Autre', emoji: '✨', examples: 'autre activité...' }
]

export const TONE_OPTIONS = [
  { 
    id: 'professional', 
    label: 'Professionnel & sérieux', 
    emoji: '💼',
    description: 'Ton formel, inspire confiance et expertise',
    example: 'Notre expertise à votre service depuis 20 ans.'
  },
  { 
    id: 'friendly', 
    label: 'Friendly & accessible', 
    emoji: '😊',
    description: 'Ton chaleureux, proche et accueillant',
    example: 'On est là pour vous simplifier la vie !'
  },
  { 
    id: 'creative', 
    label: 'Créatif & audacieux', 
    emoji: '✨',
    description: 'Ton dynamique, original et moderne',
    example: 'Osez l\'excellence, vivez l\'innovation.'
  },
  { 
    id: 'zen', 
    label: 'Zen & épuré', 
    emoji: '🌿',
    description: 'Ton calme, minimaliste et apaisant',
    example: 'Simplicité. Sérénité. Efficacité.'
  }
]

export const COLOR_OPTIONS = [
  { id: 'green', label: 'Vert nature', emoji: '🌿', hex: '#2D5A3D', secondary: '#E5B94E' },
  { id: 'blue', label: 'Bleu professionnel', emoji: '💙', hex: '#1E3A5F', secondary: '#4ECDC4' },
  { id: 'red', label: 'Rouge dynamique', emoji: '🔴', hex: '#DC2626', secondary: '#FCA5A5' },
  { id: 'purple', label: 'Violet élégant', emoji: '💜', hex: '#6B5B95', secondary: '#E8B4CB' },
  { id: 'orange', label: 'Orange chaleureux', emoji: '🟠', hex: '#D4451A', secondary: '#FFB347' },
  { id: 'dark', label: 'Sombre & chic', emoji: '⚫', hex: '#1A1A2E', secondary: '#E94560' },
  { id: 'auto', label: 'Laisse Luna choisir', emoji: '🤖', hex: null, secondary: null }
]

// ═══════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════

const useUserPreferencesStore = create(
  persist(
    (set, get) => ({
      // ═══ État ═══
      onboardingCompleted: false,
      onboardingStep: 1, // 1, 2, ou 3
      
      // Préférences
      activityCategory: null,    // id de ACTIVITY_CATEGORIES
      activityCustom: '',        // texte libre si "autre" ou précision
      tone: null,                // id de TONE_OPTIONS
      preferredColor: null,      // id de COLOR_OPTIONS
      
      // Luna personality
      lunaGreeted: false,        // Luna a-t-elle salué ?
      interactionCount: 0,       // Nombre d'interactions avec l'IA
      
      // ═══ Actions Onboarding ═══
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      setActivity: (category, custom = '') => set({ 
        activityCategory: category,
        activityCustom: custom
      }),
      
      setTone: (tone) => set({ tone }),
      
      setPreferredColor: (color) => set({ preferredColor: color }),
      
      completeOnboarding: () => set({ 
        onboardingCompleted: true,
        onboardingStep: 3
      }),
      
      resetOnboarding: () => set({
        onboardingCompleted: false,
        onboardingStep: 1,
        activityCategory: null,
        activityCustom: '',
        tone: null,
        preferredColor: null
      }),
      
      // ═══ Actions Luna ═══
      markLunaGreeted: () => set({ lunaGreeted: true }),
      
      incrementInteraction: () => set(state => ({ 
        interactionCount: state.interactionCount + 1 
      })),
      
      // ═══ Getters ═══
      getActivityLabel: () => {
        const state = get()
        if (state.activityCustom) return state.activityCustom
        const category = ACTIVITY_CATEGORIES.find(c => c.id === state.activityCategory)
        return category?.label || null
      },
      
      getToneConfig: () => {
        const state = get()
        return TONE_OPTIONS.find(t => t.id === state.tone) || null
      },
      
      getColorConfig: () => {
        const state = get()
        return COLOR_OPTIONS.find(c => c.id === state.preferredColor) || null
      },
      
      // ═══ Pour le prompt IA ═══
      getContextForAI: () => {
        const state = get()
        
        if (!state.onboardingCompleted) return null
        
        const activity = state.activityCustom || 
          ACTIVITY_CATEGORIES.find(c => c.id === state.activityCategory)?.label
        const tone = TONE_OPTIONS.find(t => t.id === state.tone)
        const color = COLOR_OPTIONS.find(c => c.id === state.preferredColor)
        
        return {
          activity,
          activityCategory: state.activityCategory,
          tone: state.tone,
          toneDescription: tone?.description,
          toneExample: tone?.example,
          preferredColor: color?.id !== 'auto' ? color?.hex : null,
          preferredColorName: color?.id !== 'auto' ? color?.label : null,
          interactionCount: state.interactionCount
        }
      },
      
      // ═══ Suggestions basées sur l'activité ═══
      getActivitySuggestions: () => {
        const state = get()
        const category = state.activityCategory
        
        const suggestions = {
          artisan: {
            services: ['Dépannage urgent', 'Installation', 'Rénovation', 'Entretien'],
            faq: ['Quels sont vos délais ?', 'Êtes-vous assuré ?', 'Faites-vous des devis gratuits ?'],
            cta: ['Demander un devis', 'Appeler maintenant', 'Urgence 24h/24']
          },
          commerce: {
            services: ['Nos produits', 'Livraison', 'Click & Collect', 'Carte fidélité'],
            faq: ['Quels sont vos horaires ?', 'Livrez-vous ?', 'Peut-on commander en ligne ?'],
            cta: ['Voir la boutique', 'Commander', 'Nous trouver']
          },
          service: {
            services: ['Consultation', 'Accompagnement', 'Audit', 'Formation'],
            faq: ['Quels sont vos tarifs ?', 'Comment se passe une consultation ?', 'Travaillez-vous à distance ?'],
            cta: ['Prendre RDV', 'Demander un devis', 'Me contacter']
          },
          restaurant: {
            services: ['Notre carte', 'Menu du jour', 'Événements', 'Privatisation'],
            faq: ['Peut-on réserver ?', 'Avez-vous des options végétariennes ?', 'Faites-vous des livraisons ?'],
            cta: ['Réserver', 'Voir le menu', 'Commander']
          },
          sante: {
            services: ['Consultations', 'Soins', 'Prévention', 'Suivi'],
            faq: ['Prenez-vous ma mutuelle ?', 'Comment prendre RDV ?', 'Quels sont vos horaires ?'],
            cta: ['Prendre RDV', 'Nous appeler', 'Urgences']
          },
          tech: {
            services: ['Développement', 'Design', 'Maintenance', 'Conseil'],
            faq: ['Quelles sont vos technos ?', 'Quel est votre processus ?', 'Combien coûte un site ?'],
            cta: ['Démarrer un projet', 'Voir nos réalisations', 'Nous contacter']
          },
          creatif: {
            services: ['Création', 'Direction artistique', 'Production', 'Conseil'],
            faq: ['Quel est votre style ?', 'Quels sont vos délais ?', 'Travaillez-vous en remote ?'],
            cta: ['Voir le portfolio', 'Discutons', 'Demander un devis']
          },
          formation: {
            services: ['Formations', 'Coaching', 'Ateliers', 'E-learning'],
            faq: ['Les formations sont-elles certifiantes ?', 'Proposez-vous du sur-mesure ?', 'Quel financement ?'],
            cta: ['Voir les formations', 'S\'inscrire', 'Nous contacter']
          },
          immobilier: {
            services: ['Achat', 'Vente', 'Location', 'Estimation'],
            faq: ['Quels sont vos honoraires ?', 'Comment estimer mon bien ?', 'Quel délai pour vendre ?'],
            cta: ['Estimer mon bien', 'Voir les annonces', 'Nous contacter']
          },
          autre: {
            services: ['Service 1', 'Service 2', 'Service 3'],
            faq: ['Question fréquente 1 ?', 'Question fréquente 2 ?'],
            cta: ['Nous contacter', 'En savoir plus']
          }
        }
        
        return suggestions[category] || suggestions.autre
      }
    }),
    {
      name: 'user-preferences',
      version: 1
    }
  )
)

export default useUserPreferencesStore
