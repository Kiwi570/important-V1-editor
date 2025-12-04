// ═══════════════════════════════════════════════════════════════════════════
// LUNA MESSAGES - Système de messages humanisés et contextuels
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// LUNA MOODS - États émotionnels de Luna
// ═══════════════════════════════════════════════════════════════════════════

export const LUNA_MOODS = {
  happy: { emoji: '😊', label: 'Contente' },
  thinking: { emoji: '🤔', label: 'Réfléchit' },
  excited: { emoji: '🤩', label: 'Impressionnée' },
  celebrate: { emoji: '🎉', label: 'Célèbre' },
  oops: { emoji: '😅', label: 'Oups' },
  cool: { emoji: '😎', label: 'Cool' },
  love: { emoji: '😍', label: 'Adore' },
  wink: { emoji: '😉', label: 'Clin d\'oeil' }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE VARIATIONS PAR TYPE D'ACTION
// ═══════════════════════════════════════════════════════════════════════════

const ACTION_MESSAGES = {
  // ═══ COULEURS ═══
  color_changed: {
    professional: [
      "Couleur mise à jour avec succès.",
      "Modification de couleur appliquée.",
      "La nouvelle teinte est en place.",
    ],
    friendly: [
      "Et voilà, nouvelle couleur ! {emoji}",
      "J'ai changé la couleur, ça rend bien non ? {emoji}",
      "Couleur mise à jour ! T'en penses quoi ? {emoji}",
    ],
    creative: [
      "BOOM ! {emoji} Cette couleur va faire des ravages !",
      "Oh j'adore ce choix de couleur ! {emoji}",
      "Palette mise à jour — ton site prend du style ! {emoji}",
    ],
    zen: [
      "Couleur changée. Harmonieux. {emoji}",
      "Nouvelle teinte en place. {emoji}",
      "C'est fait. Simple et efficace. {emoji}",
    ],
    emojis: ['🎨', '💜', '✨', '🌈'],
    mood: 'happy',
    suggestions: [
      "Pense à vérifier le contraste avec le texte",
      "Tu peux assortir les boutons à cette couleur",
    ]
  },

  // ═══ TITRES & TEXTES ═══
  title_changed: {
    professional: [
      "Titre mis à jour.",
      "Le nouveau titre est en place.",
      "Modification du titre effectuée.",
    ],
    friendly: [
      "Nouveau titre en place ! {emoji}",
      "J'ai mis à jour ton titre ! {emoji}",
      "Et voilà un titre tout neuf ! {emoji}",
    ],
    creative: [
      "Ce titre va capter l'attention ! {emoji}",
      "Wow, ce titre a du punch ! {emoji}",
      "Titre mis à jour — ça accroche ! {emoji}",
    ],
    zen: [
      "Titre changé. {emoji}",
      "Nouveau titre. Claire et net. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['✨', '📝', '💫', '✍️'],
    mood: 'happy',
    suggestions: [
      "Un sous-titre pourrait renforcer l'impact",
      "Vérifie que ça reste lisible sur mobile",
    ]
  },

  subtitle_changed: {
    professional: [
      "Sous-titre mis à jour.",
      "Le sous-titre a été modifié.",
    ],
    friendly: [
      "Sous-titre changé ! {emoji}",
      "J'ai rafraîchi ton sous-titre ! {emoji}",
    ],
    creative: [
      "Ce sous-titre complète parfaitement le titre ! {emoji}",
      "Sous-titre en place — duo gagnant ! {emoji}",
    ],
    zen: [
      "Sous-titre ajusté. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['✨', '📝', '💭'],
    mood: 'happy',
    suggestions: [
      "Le combo titre + sous-titre est crucial pour convertir",
    ]
  },

  text_improved: {
    professional: [
      "Texte optimisé pour plus d'impact.",
      "Contenu amélioré.",
      "Le texte a été retravaillé.",
    ],
    friendly: [
      "Texte amélioré ! C'est plus punchy maintenant {emoji}",
      "J'ai boosté ton texte ! {emoji}",
      "Voilà qui est mieux ! {emoji}",
    ],
    creative: [
      "Ce texte va convertir à fond ! {emoji}",
      "J'ai mis de la magie dans ces mots ! {emoji}",
      "Texte 2.0 activé ! {emoji}",
    ],
    zen: [
      "Texte affiné. {emoji}",
      "Plus clair maintenant. {emoji}",
    ],
    emojis: ['✨', '🚀', '💪', '🔥'],
    mood: 'excited',
    suggestions: [
      "Les textes courts convertissent mieux",
      "Ajoute un appel à l'action si c'est pas fait",
    ]
  },

  // ═══ BOUTONS ═══
  button_changed: {
    professional: [
      "Bouton mis à jour.",
      "L'appel à l'action a été modifié.",
    ],
    friendly: [
      "Bouton mis à jour ! {emoji}",
      "Ton CTA est prêt à convertir ! {emoji}",
    ],
    creative: [
      "Ce bouton donne envie de cliquer ! {emoji}",
      "CTA optimisé — let's go ! {emoji}",
    ],
    zen: [
      "Bouton ajusté. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['🔘', '👆', '✨', '🎯'],
    mood: 'happy',
    suggestions: [
      "Un verbe d'action au bouton = plus de clics",
      "Vérifie que le lien fonctionne",
    ]
  },

  // ═══ SECTIONS ═══
  section_enabled: {
    professional: [
      "Section activée.",
      "La section est maintenant visible.",
    ],
    friendly: [
      "Section activée ! Tes visiteurs vont la voir {emoji}",
      "C'est visible maintenant ! {emoji}",
    ],
    creative: [
      "Boom ! Section débloquée ! {emoji}",
      "Cette section va enrichir ton site ! {emoji}",
    ],
    zen: [
      "Section visible. {emoji}",
      "Activé. {emoji}",
    ],
    emojis: ['👁️', '✅', '🎯', '✨'],
    mood: 'happy',
    suggestions: [
      "N'oublie pas de personnaliser le contenu",
    ]
  },

  section_disabled: {
    professional: [
      "Section masquée.",
      "La section a été désactivée.",
    ],
    friendly: [
      "Section masquée ! Tu peux la réactiver quand tu veux {emoji}",
      "C'est caché pour l'instant {emoji}",
    ],
    creative: [
      "Section en pause — elle reviendra peut-être ! {emoji}",
      "Hop, rangée pour plus tard ! {emoji}",
    ],
    zen: [
      "Section masquée. {emoji}",
      "Désactivé. {emoji}",
    ],
    emojis: ['👋', '🙈', '💤'],
    mood: 'wink',
    suggestions: []
  },

  // ═══ ITEMS (Services, FAQ, Témoignages) ═══
  item_added: {
    professional: [
      "Élément ajouté avec succès.",
      "Nouvel élément créé.",
    ],
    friendly: [
      "Ajouté ! Ton site s'enrichit {emoji}",
      "Et un de plus ! {emoji}",
      "C'est ajouté ! {emoji}",
    ],
    creative: [
      "Nouvel élément dans la place ! {emoji}",
      "Ton site prend de l'ampleur ! {emoji}",
      "+1 ! Continue comme ça {emoji}",
    ],
    zen: [
      "Ajouté. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['➕', '✨', '🎯', '📦'],
    mood: 'happy',
    suggestions: [
      "3 éléments minimum pour une section crédible",
    ]
  },

  item_deleted: {
    professional: [
      "Élément supprimé.",
      "Suppression effectuée.",
    ],
    friendly: [
      "C'est supprimé ! {emoji}",
      "Hop, enlevé ! {emoji}",
    ],
    creative: [
      "Pouf, disparu ! {emoji}",
      "Ménage fait ! {emoji}",
    ],
    zen: [
      "Supprimé. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['🗑️', '👋', '✨'],
    mood: 'wink',
    suggestions: []
  },

  service_added: {
    professional: [
      "Service ajouté à votre offre.",
      "Nouveau service créé.",
    ],
    friendly: [
      "Service ajouté ! Tes clients vont voir ce que tu proposes {emoji}",
      "Nouveau service en ligne ! {emoji}",
    ],
    creative: [
      "Ce service va attirer du monde ! {emoji}",
      "Offre enrichie — bien joué ! {emoji}",
    ],
    zen: [
      "Service ajouté. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['🎯', '💼', '✨', '🚀'],
    mood: 'excited',
    suggestions: [
      "Ajoute un prix ou une fourchette pour rassurer",
      "Une icône aide à identifier rapidement le service",
    ]
  },

  testimonial_added: {
    professional: [
      "Témoignage ajouté.",
      "Nouvel avis client intégré.",
    ],
    friendly: [
      "Témoignage ajouté ! La preuve sociale, ça rassure {emoji}",
      "Un avis de plus pour convaincre ! {emoji}",
    ],
    creative: [
      "Ce témoignage va rassurer tes visiteurs ! {emoji}",
      "Social proof activée ! {emoji}",
    ],
    zen: [
      "Témoignage ajouté. {emoji}",
      "C'est fait. {emoji}",
    ],
    emojis: ['⭐', '💬', '🌟', '👤'],
    mood: 'love',
    suggestions: [
      "Les témoignages avec photo convertissent 2x plus",
      "5 étoiles = confiance maximale",
    ]
  },

  faq_added: {
    professional: [
      "Question ajoutée à la FAQ.",
      "Nouvelle entrée FAQ créée.",
    ],
    friendly: [
      "Question ajoutée ! Tes visiteurs trouveront la réponse {emoji}",
      "FAQ enrichie ! {emoji}",
    ],
    creative: [
      "Une question de moins que tes clients se poseront ! {emoji}",
      "FAQ power ! {emoji}",
    ],
    zen: [
      "FAQ mise à jour. {emoji}",
      "Ajouté. {emoji}",
    ],
    emojis: ['❓', '💡', '📚', '✨'],
    mood: 'happy',
    suggestions: [
      "Réponds aux objections fréquentes dans la FAQ",
      "Les FAQ boostent le SEO",
    ]
  },

  // ═══ THÈME ═══
  theme_applied: {
    professional: [
      "Thème appliqué avec succès.",
      "Le nouveau thème est en place.",
    ],
    friendly: [
      "Nouveau look activé ! {emoji}",
      "Thème appliqué, ça change tout ! {emoji}",
    ],
    creative: [
      "Transformation complète ! {emoji}",
      "Wow, ton site a pris un coup de jeune ! {emoji}",
    ],
    zen: [
      "Thème appliqué. {emoji}",
      "Nouvelle ambiance. {emoji}",
    ],
    emojis: ['🎨', '✨', '🌈', '💫'],
    mood: 'celebrate',
    suggestions: [
      "Vérifie que tous les textes restent lisibles",
      "Les couleurs cohérentes = marque professionnelle",
    ]
  },

  theme_dark: {
    professional: [
      "Mode sombre activé.",
      "Thème sombre appliqué.",
    ],
    friendly: [
      "Mode sombre activé ! Ambiance chic {emoji}",
      "Dark mode ON ! {emoji}",
    ],
    creative: [
      "Bienvenue du côté obscur ! {emoji}",
      "Mode sombre = mode pro ! {emoji}",
    ],
    zen: [
      "Sombre. Élégant. {emoji}",
      "Mode nuit. {emoji}",
    ],
    emojis: ['🌙', '🖤', '✨', '🌃'],
    mood: 'cool',
    suggestions: [
      "Le dark mode est tendance et repose les yeux",
    ]
  },

  // ═══ ROLLBACK ═══
  rollback: {
    professional: [
      "Modification annulée.",
      "Retour à l'état précédent effectué.",
    ],
    friendly: [
      "C'est annulé ! Pas de souci {emoji}",
      "Hop, retour en arrière ! {emoji}",
      "J'ai tout remis comme avant {emoji}",
    ],
    creative: [
      "Retour vers le passé ! {emoji}",
      "Ctrl+Z activé ! {emoji}",
    ],
    zen: [
      "Annulé. {emoji}",
      "Retour arrière. {emoji}",
    ],
    emojis: ['⏪', '↩️', '😅', '🔄'],
    mood: 'oops',
    suggestions: []
  },

  // ═══ ERREUR ═══
  error: {
    professional: [
      "Une erreur s'est produite. Veuillez réessayer.",
      "Opération non aboutie.",
    ],
    friendly: [
      "Oups, ça n'a pas marché ! On réessaie ? {emoji}",
      "Petit souci... Tu veux réessayer ? {emoji}",
    ],
    creative: [
      "Bug détecté ! Mais je lâche pas l'affaire {emoji}",
      "Oups ! Même les génies font des erreurs {emoji}",
    ],
    zen: [
      "Erreur. Réessayons. {emoji}",
      "Ça n'a pas fonctionné. {emoji}",
    ],
    emojis: ['😅', '🤔', '🔧', '💫'],
    mood: 'oops',
    suggestions: [
      "Vérifie ta connexion et réessaie",
    ]
  },

  // ═══ GÉNÉRATION ═══
  content_generated: {
    professional: [
      "Contenu généré avec succès.",
      "Génération terminée.",
    ],
    friendly: [
      "Et voilà ! J'ai créé ça pour toi {emoji}",
      "Contenu généré ! Dis-moi si ça te plaît {emoji}",
    ],
    creative: [
      "Magie ! J'ai créé ça de toutes pièces {emoji}",
      "Génération terminée — c'est du sur-mesure ! {emoji}",
    ],
    zen: [
      "Généré. {emoji}",
      "Contenu créé. {emoji}",
    ],
    emojis: ['✨', '🪄', '🎁', '🚀'],
    mood: 'excited',
    suggestions: [
      "Personnalise le contenu généré à ton style",
    ]
  },

  // ═══ MULTI-ACTIONS ═══
  batch_applied: {
    professional: [
      "{count} modifications appliquées.",
      "Lot de {count} changements effectué.",
    ],
    friendly: [
      "{count} modifs d'un coup ! Efficace {emoji}",
      "Boom ! {count} changements appliqués {emoji}",
    ],
    creative: [
      "{count} modifications — tu es en feu ! {emoji}",
      "Rafale de {count} changements ! {emoji}",
    ],
    zen: [
      "{count} modifications. {emoji}",
      "Fait. {emoji}",
    ],
    emojis: ['🚀', '⚡', '💪', '🔥'],
    mood: 'celebrate',
    suggestions: [
      "Prévisualise le résultat final",
    ]
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGES PERSONNALISÉS PAR MÉTIER
// ═══════════════════════════════════════════════════════════════════════════

const ACTIVITY_SPECIFIC = {
  artisan: {
    service_added: "Service ajouté ! Tes clients verront ton expertise {emoji}",
    testimonial_added: "Avis client ajouté — ça rassure pour les travaux ! {emoji}",
    contact_updated: "Coordonnées à jour ! Tes clients pourront t'appeler facilement {emoji}",
  },
  restaurant: {
    service_added: "Plat/menu ajouté ! Ça donne faim {emoji}",
    title_changed: "Titre appétissant en place ! {emoji}",
    theme_dark: "Ambiance tamisée activée — parfait pour un resto ! {emoji}",
  },
  commerce: {
    service_added: "Produit/service ajouté à ta vitrine ! {emoji}",
    testimonial_added: "Avis client ajouté — ça rassure les acheteurs ! {emoji}",
  },
  sante: {
    service_added: "Soin/consultation ajouté ! {emoji}",
    testimonial_added: "Témoignage patient ajouté — la confiance avant tout {emoji}",
  },
  tech: {
    service_added: "Service tech ajouté ! {emoji}",
    theme_dark: "Dark mode — le choix des devs ! {emoji}",
  },
  creatif: {
    color_changed: "Cette couleur reflète bien ta créativité ! {emoji}",
    theme_applied: "Nouveau style artistique appliqué ! {emoji}",
  },
  formation: {
    service_added: "Formation ajoutée à ton catalogue ! {emoji}",
    faq_added: "Question ajoutée — tes futurs élèves te remercient {emoji}",
  },
  immobilier: {
    service_added: "Service immo ajouté ! {emoji}",
    testimonial_added: "Témoignage client ajouté — crucial dans l'immo ! {emoji}",
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// SUGGESTIONS CONTEXTUELLES
// ═══════════════════════════════════════════════════════════════════════════

const CONTEXTUAL_SUGGESTIONS = {
  // Après modification du hero
  hero: [
    "Le hero est la première chose que voient tes visiteurs",
    "Un bon hero = 50% du travail fait",
  ],
  // Après ajout de services
  services: [
    "3 services minimum pour paraître crédible",
    "Ajoute des icônes pour plus de clarté",
  ],
  // Après ajout de témoignages
  testimonials: [
    "Les témoignages avec photo convertissent 2x plus",
    "Varie les profils de clients pour toucher plus de monde",
  ],
  // Après modification FAQ
  faq: [
    "Réponds aux objections fréquentes ici",
    "La FAQ améliore ton référencement Google",
  ],
  // Après modification contact
  contact: [
    "Vérifie que ton email et téléphone sont corrects",
    "Ajoute tes horaires pour éviter les appels hors service",
  ],
  // Site incomplet
  incomplete: {
    no_testimonials: "Ajoute des témoignages pour rassurer tes visiteurs",
    no_faq: "Une FAQ répond aux questions avant qu'on te les pose",
    no_services: "Détaille tes services pour que les clients comprennent ton offre",
    few_services: "Ajoute encore {remaining} service(s) pour une offre complète",
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GREETINGS & SPECIAL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

const GREETINGS = {
  professional: [
    "Bonjour. Comment puis-je vous aider ?",
    "Prêt à optimiser votre site.",
  ],
  friendly: [
    "Salut ! On améliore ton site ensemble ? 😊",
    "Hey ! Prêt(e) à créer quelque chose de cool ? ✨",
    "Coucou ! Qu'est-ce qu'on fait aujourd'hui ? 🌙",
  ],
  creative: [
    "Let's GO ! Qu'est-ce qu'on crée aujourd'hui ? 🚀",
    "Salut l'artiste ! On fait des merveilles ? ✨",
    "Ready ? Let's make magic happen ! 🪄",
  ],
  zen: [
    "Bonjour. Je suis là. 🌙",
    "Prêt quand tu l'es. ✨",
    "Bienvenue. Que puis-je faire ? 🌿",
  ]
}

const THINKING_MESSAGES = {
  professional: [
    "Analyse en cours...",
    "Je travaille dessus...",
  ],
  friendly: [
    "Je réfléchis... 🤔",
    "Hmm, laisse-moi voir... 💭",
    "Un instant... ✨",
  ],
  creative: [
    "Cerveau en ébullition... 🧠",
    "Je mijote quelque chose... 🍳",
    "Magie en préparation... 🪄",
  ],
  zen: [
    "...",
    "Un moment...",
    "Je réfléchis...",
  ]
}

const CELEBRATION_MESSAGES = {
  professional: [
    "Excellent travail.",
    "Site bien avancé.",
  ],
  friendly: [
    "Bravo ! Ton site avance super bien ! 🎉",
    "Tu gères ! Continue comme ça ! 💪",
    "Wow, regarde ce que tu as créé ! 🌟",
  ],
  creative: [
    "Tu es une MACHINE ! 🔥",
    "Ce site va être incroyable ! 🚀",
    "Chef d'œuvre en construction ! 🎨",
  ],
  zen: [
    "Beau travail. 🌿",
    "Ça prend forme. ✨",
    "Bien. 🌙",
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Détermine le type d'action à partir des données
 */
function detectActionType(action, path) {
  const { type, section } = action
  const pathLower = path?.toLowerCase() || ''
  
  // Rollback
  if (type === 'rollback') return 'rollback'
  
  // Couleurs
  if (pathLower.includes('color') || pathLower.includes('bgcolor')) {
    if (pathLower.includes('background') && action.value?.includes('#1') || action.value?.includes('#0')) {
      return 'theme_dark'
    }
    return 'color_changed'
  }
  
  // Titres
  if (pathLower.includes('title') && !pathLower.includes('subtitle')) return 'title_changed'
  if (pathLower.includes('subtitle')) return 'subtitle_changed'
  
  // Boutons
  if (pathLower.includes('cta') || pathLower.includes('button')) return 'button_changed'
  
  // Items
  if (type === 'add_item') {
    if (section === 'services') return 'service_added'
    if (section === 'testimonials') return 'testimonial_added'
    if (section === 'faq') return 'faq_added'
    return 'item_added'
  }
  
  if (type === 'delete_item') return 'item_deleted'
  
  // Sections
  if (type === 'toggle_section') {
    return action.enabled ? 'section_enabled' : 'section_disabled'
  }
  
  // Thème
  if (type === 'apply_preset' || type === 'update_theme') return 'theme_applied'
  
  // Génération
  if (type === 'generate_section') return 'content_generated'
  
  // Batch
  if (type === 'batch') return 'batch_applied'
  
  // Default: amélioration de texte
  return 'text_improved'
}

/**
 * Sélectionne un message aléatoire dans un tableau
 */
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Génère un message humanisé pour une action
 */
export function generateLunaMessage(action, options = {}) {
  const {
    tone = 'friendly',
    activity = null,
    activityCategory = null,
    path = action.path,
    count = 1,
  } = options
  
  // Détecter le type d'action
  const actionType = detectActionType(action, path)
  
  // Récupérer les messages pour ce type
  const messages = ACTION_MESSAGES[actionType]
  if (!messages) {
    return {
      text: "C'est fait ! ✨",
      mood: LUNA_MOODS.happy,
      suggestion: null
    }
  }
  
  // Choisir le bon ton (fallback sur friendly)
  const toneMessages = messages[tone] || messages.friendly
  
  // Vérifier s'il y a un message spécifique au métier
  let messageText = null
  if (activityCategory && ACTIVITY_SPECIFIC[activityCategory]?.[actionType]) {
    messageText = ACTIVITY_SPECIFIC[activityCategory][actionType]
  } else {
    messageText = pickRandom(toneMessages)
  }
  
  // Remplacer les placeholders
  const emoji = pickRandom(messages.emojis)
  messageText = messageText
    .replace('{emoji}', emoji)
    .replace('{count}', count.toString())
  
  // Sélectionner une suggestion
  const suggestion = messages.suggestions?.length > 0 
    ? pickRandom(messages.suggestions)
    : null
  
  return {
    text: messageText,
    mood: LUNA_MOODS[messages.mood] || LUNA_MOODS.happy,
    suggestion,
    actionType
  }
}

/**
 * Génère un message pour plusieurs actions (batch)
 */
export function generateBatchMessage(actions, options = {}) {
  const { tone = 'friendly' } = options
  const count = actions.length
  
  if (count === 1) {
    return generateLunaMessage(actions[0], options)
  }
  
  const messages = ACTION_MESSAGES.batch_applied
  const toneMessages = messages[tone] || messages.friendly
  const emoji = pickRandom(messages.emojis)
  
  let messageText = pickRandom(toneMessages)
    .replace('{count}', count.toString())
    .replace('{emoji}', emoji)
  
  return {
    text: messageText,
    mood: LUNA_MOODS.celebrate,
    suggestion: "Prévisualise le résultat final",
    actionType: 'batch_applied'
  }
}

/**
 * Génère un greeting selon le ton
 */
export function generateGreeting(options = {}) {
  const { tone = 'friendly', activity = null } = options
  const greetings = GREETINGS[tone] || GREETINGS.friendly
  let greeting = pickRandom(greetings)
  
  // Ajouter mention du métier si disponible
  if (activity && tone !== 'professional') {
    greeting += ` Je vais t'aider à créer un super site pour ton activité de ${activity} !`
  }
  
  return {
    text: greeting,
    mood: LUNA_MOODS.happy
  }
}

/**
 * Génère un message de réflexion
 */
export function generateThinkingMessage(options = {}) {
  const { tone = 'friendly' } = options
  const messages = THINKING_MESSAGES[tone] || THINKING_MESSAGES.friendly
  return {
    text: pickRandom(messages),
    mood: LUNA_MOODS.thinking
  }
}

/**
 * Génère un message de célébration
 */
export function generateCelebrationMessage(options = {}) {
  const { tone = 'friendly' } = options
  const messages = CELEBRATION_MESSAGES[tone] || CELEBRATION_MESSAGES.friendly
  return {
    text: pickRandom(messages),
    mood: LUNA_MOODS.celebrate
  }
}

/**
 * Génère une suggestion contextuelle basée sur l'état du site
 */
export function generateContextualSuggestion(siteContent, lastSection = null) {
  const suggestions = []
  
  // Vérifier les sections manquantes
  if (!siteContent.testimonials?.items?.length) {
    suggestions.push(CONTEXTUAL_SUGGESTIONS.incomplete.no_testimonials)
  }
  
  if (!siteContent.faq?.items?.length) {
    suggestions.push(CONTEXTUAL_SUGGESTIONS.incomplete.no_faq)
  }
  
  const servicesCount = siteContent.services?.items?.length || 0
  if (servicesCount === 0) {
    suggestions.push(CONTEXTUAL_SUGGESTIONS.incomplete.no_services)
  } else if (servicesCount < 3) {
    suggestions.push(
      CONTEXTUAL_SUGGESTIONS.incomplete.few_services.replace('{remaining}', (3 - servicesCount).toString())
    )
  }
  
  // Suggestions basées sur la dernière section modifiée
  if (lastSection && CONTEXTUAL_SUGGESTIONS[lastSection]) {
    suggestions.push(...CONTEXTUAL_SUGGESTIONS[lastSection])
  }
  
  return suggestions.length > 0 ? pickRandom(suggestions) : null
}

/**
 * Génère un message d'erreur humanisé
 */
export function generateErrorMessage(options = {}) {
  const { tone = 'friendly', errorType = 'generic' } = options
  const messages = ACTION_MESSAGES.error
  const toneMessages = messages[tone] || messages.friendly
  const emoji = pickRandom(messages.emojis)
  
  return {
    text: pickRandom(toneMessages).replace('{emoji}', emoji),
    mood: LUNA_MOODS.oops,
    suggestion: pickRandom(messages.suggestions)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOW CONVERSATIONNEL - Suggestions liées par section
// ═══════════════════════════════════════════════════════════════════════════

const SECTION_FLOW_SUGGESTIONS = {
  hero: {
    next: ['services', 'about'],
    suggestions: {
      professional: [
        { label: "Optimiser le CTA", value: "améliore le bouton principal", emoji: "🎯" },
        { label: "Ajuster les couleurs", value: "propose des couleurs pour le hero", emoji: "🎨" },
        { label: "Passer aux services", value: "montre moi la section services", emoji: "➡️" },
      ],
      friendly: [
        { label: "Améliorer le bouton ?", value: "rends le bouton plus accrocheur", emoji: "🎯" },
        { label: "Jouer avec les couleurs ?", value: "propose des couleurs sympas", emoji: "🎨" },
        { label: "On passe aux services ?", value: "allons voir les services", emoji: "✨" },
      ],
      creative: [
        { label: "Boost le CTA !", value: "rends ce bouton irrésistible", emoji: "🔥" },
        { label: "Explosion de couleurs ?", value: "balance des couleurs qui claquent", emoji: "🎨" },
        { label: "Next : Services →", value: "go section services", emoji: "🚀" },
      ],
      zen: [
        { label: "Affiner le bouton", value: "améliore le bouton", emoji: "🎯" },
        { label: "Harmoniser", value: "harmonise les couleurs", emoji: "🎨" },
        { label: "Services", value: "section services", emoji: "→" },
      ]
    }
  },
  
  services: {
    next: ['testimonials', 'about'],
    suggestions: {
      professional: [
        { label: "Ajouter un service", value: "ajoute un nouveau service", emoji: "➕" },
        { label: "Générer des services", value: "génère 3 services adaptés à mon activité", emoji: "🔄" },
        { label: "Ajouter des témoignages", value: "passons aux témoignages", emoji: "⭐" },
      ],
      friendly: [
        { label: "En ajouter un autre ?", value: "ajoute un autre service", emoji: "➕" },
        { label: "Je t'en génère ?", value: "génère moi des services", emoji: "✨" },
        { label: "Des témoignages ?", value: "on ajoute des témoignages ?", emoji: "⭐" },
      ],
      creative: [
        { label: "+1 service !", value: "ajoute un service qui déchire", emoji: "🎯" },
        { label: "Génère-moi tout !", value: "génère des services créatifs", emoji: "🔥" },
        { label: "Social proof time !", value: "ajoutons des témoignages", emoji: "⭐" },
      ],
      zen: [
        { label: "Ajouter", value: "ajoute un service", emoji: "+" },
        { label: "Générer", value: "génère des services", emoji: "✨" },
        { label: "Témoignages", value: "section témoignages", emoji: "→" },
      ]
    }
  },
  
  testimonials: {
    next: ['faq', 'cta'],
    suggestions: {
      professional: [
        { label: "Ajouter un témoignage", value: "ajoute un témoignage", emoji: "➕" },
        { label: "Générer des avis", value: "génère des témoignages crédibles", emoji: "🔄" },
        { label: "Créer une FAQ", value: "passons à la FAQ", emoji: "❓" },
      ],
      friendly: [
        { label: "Un autre avis ?", value: "ajoute un autre témoignage", emoji: "⭐" },
        { label: "J'en invente ?", value: "génère des témoignages réalistes", emoji: "✨" },
        { label: "FAQ ensuite ?", value: "on fait la FAQ ?", emoji: "❓" },
      ],
      creative: [
        { label: "Encore un fan !", value: "ajoute un témoignage élogieux", emoji: "🌟" },
        { label: "Fabrique sociale !", value: "génère des avis 5 étoiles", emoji: "⭐" },
        { label: "FAQ time !", value: "créons une FAQ", emoji: "🎯" },
      ],
      zen: [
        { label: "Ajouter", value: "ajoute un témoignage", emoji: "+" },
        { label: "Générer", value: "génère des témoignages", emoji: "✨" },
        { label: "FAQ", value: "section FAQ", emoji: "→" },
      ]
    }
  },
  
  faq: {
    next: ['contact', 'cta'],
    suggestions: {
      professional: [
        { label: "Ajouter une question", value: "ajoute une question FAQ", emoji: "➕" },
        { label: "Générer une FAQ", value: "génère des questions fréquentes", emoji: "🔄" },
        { label: "Section contact", value: "vérifions le contact", emoji: "📞" },
      ],
      friendly: [
        { label: "Une autre question ?", value: "ajoute une question", emoji: "❓" },
        { label: "Je génère des FAQ ?", value: "génère des questions pertinentes", emoji: "✨" },
        { label: "Le contact ?", value: "on vérifie les coordonnées ?", emoji: "📞" },
      ],
      creative: [
        { label: "Question bonus !", value: "ajoute une question originale", emoji: "❓" },
        { label: "FAQ complète !", value: "génère une FAQ complète", emoji: "🔥" },
        { label: "Contact check !", value: "vérifions le contact", emoji: "📞" },
      ],
      zen: [
        { label: "Ajouter", value: "ajoute une question", emoji: "+" },
        { label: "Générer", value: "génère la FAQ", emoji: "✨" },
        { label: "Contact", value: "section contact", emoji: "→" },
      ]
    }
  },
  
  about: {
    next: ['services', 'testimonials'],
    suggestions: {
      professional: [
        { label: "Améliorer le texte", value: "améliore le texte de présentation", emoji: "📝" },
        { label: "Ajouter des valeurs", value: "ajoute des valeurs d'entreprise", emoji: "💎" },
        { label: "Voir les services", value: "passons aux services", emoji: "➡️" },
      ],
      friendly: [
        { label: "Rendre plus perso ?", value: "rends le texte plus chaleureux", emoji: "💬" },
        { label: "Ajouter tes valeurs ?", value: "ajoutons tes valeurs", emoji: "💎" },
        { label: "Les services ?", value: "on regarde les services ?", emoji: "✨" },
      ],
      creative: [
        { label: "Storytelling !", value: "raconte une histoire captivante", emoji: "📖" },
        { label: "Valeurs uniques !", value: "ajoute des valeurs qui marquent", emoji: "💎" },
        { label: "Services →", value: "go les services", emoji: "🚀" },
      ],
      zen: [
        { label: "Affiner", value: "améliore le texte", emoji: "📝" },
        { label: "Valeurs", value: "ajoute des valeurs", emoji: "💎" },
        { label: "Services", value: "section services", emoji: "→" },
      ]
    }
  },
  
  contact: {
    next: ['footer', 'cta'],
    suggestions: {
      professional: [
        { label: "Vérifier les infos", value: "montre moi les coordonnées", emoji: "✅" },
        { label: "Modifier les horaires", value: "modifie les horaires", emoji: "🕐" },
        { label: "Finaliser", value: "le site est presque prêt ?", emoji: "🏁" },
      ],
      friendly: [
        { label: "Tout est bon ?", value: "vérifie mes coordonnées", emoji: "✅" },
        { label: "Les horaires ?", value: "on ajuste les horaires ?", emoji: "🕐" },
        { label: "Presque fini ?", value: "on a bientôt fini ?", emoji: "🎉" },
      ],
      creative: [
        { label: "Check final !", value: "vérifie tout le contact", emoji: "✅" },
        { label: "Horaires parfaits !", value: "optimise les horaires", emoji: "⏰" },
        { label: "Ready to launch ?", value: "le site est prêt ?", emoji: "🚀" },
      ],
      zen: [
        { label: "Vérifier", value: "vérifie le contact", emoji: "✅" },
        { label: "Horaires", value: "ajuste les horaires", emoji: "🕐" },
        { label: "Finaliser", value: "on finalise", emoji: "→" },
      ]
    }
  },
  
  theme: {
    next: ['hero', 'services'],
    suggestions: {
      professional: [
        { label: "Appliquer partout", value: "applique ce style à tout le site", emoji: "🎨" },
        { label: "Mode sombre", value: "passe en mode sombre", emoji: "🌙" },
        { label: "Retour au contenu", value: "revenons au contenu", emoji: "📝" },
      ],
      friendly: [
        { label: "Partout pareil ?", value: "applique ça partout", emoji: "🎨" },
        { label: "Mode nuit ?", value: "on tente le mode sombre ?", emoji: "🌙" },
        { label: "Retour au texte ?", value: "on retourne au contenu ?", emoji: "📝" },
      ],
      creative: [
        { label: "Total makeover !", value: "applique ce style partout", emoji: "🔥" },
        { label: "Dark side !", value: "mode sombre total", emoji: "🌙" },
        { label: "Back to content !", value: "retour au contenu", emoji: "📝" },
      ],
      zen: [
        { label: "Harmoniser", value: "applique partout", emoji: "🎨" },
        { label: "Sombre", value: "mode sombre", emoji: "🌙" },
        { label: "Contenu", value: "retour contenu", emoji: "→" },
      ]
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGES DE PHASE - Selon le nombre d'actions
// ═══════════════════════════════════════════════════════════════════════════

const PHASE_MESSAGES = {
  // Phase 1: Proactive (1-2 actions)
  proactive: {
    professional: [
      "Que souhaitez-vous modifier ensuite ?",
      "Continuons l'optimisation.",
      "Prochaine étape ?",
    ],
    friendly: [
      "On continue ? J'ai d'autres idées ! 😊",
      "Qu'est-ce qu'on améliore maintenant ?",
      "Encore un petit truc ? ✨",
    ],
    creative: [
      "On s'arrête pas là ! Quoi d'autre ? 🔥",
      "C'est bien parti ! Next ? 🚀",
      "Let's keep going ! 💪",
    ],
    zen: [
      "Suite ?",
      "Autre chose ?",
      "Continuons.",
    ]
  },
  
  // Phase 2: Accompagnante (3-5 actions)
  supportive: {
    professional: [
      "Votre site prend forme. Souhaitez-vous continuer ?",
      "Bonne progression. Autre modification ?",
      "Le site avance bien.",
    ],
    friendly: [
      "Ton site prend forme ! On continue ou tu veux voir le résultat ? 😊",
      "Ça avance super bien ! Encore quelque chose ?",
      "Tu gères ! Une autre modif ? ✨",
    ],
    creative: [
      "Le site devient canon ! On pousse encore ? 🔥",
      "T'es en feu ! On continue le carnage ? 💪",
      "Ça prend une sacrée allure ! Next ? 🚀",
    ],
    zen: [
      "Ça prend forme. Continuons ?",
      "Bien avancé. Autre chose ?",
      "Le site évolue. ✨",
    ]
  },
  
  // Phase 3: Discrète (5+ actions)
  discrete: {
    professional: [
      "Les modifications sont appliquées. Je reste disponible si besoin.",
      "Votre site est bien avancé. N'hésitez pas si vous avez d'autres demandes.",
      "C'est en place. Vous pouvez prévisualiser ou continuer.",
    ],
    friendly: [
      "C'est fait ! Je reste là si t'as besoin, sinon tu peux prévisualiser 👀",
      "Voilà ! Ton site avance bien. Dis-moi si tu veux autre chose 😊",
      "C'est bon ! Fais-moi signe si tu veux continuer ✨",
    ],
    creative: [
      "Done ! Ton site est en bonne voie. Je suis là si t'as une idée folle 🚀",
      "Check ! Le site prend du level. Appelle-moi si besoin 🔥",
      "C'est carré ! Ready to preview ou on continue ? 💪",
    ],
    zen: [
      "C'est fait. Je suis là si besoin.",
      "Appliqué. Continue quand tu veux.",
      "En place. ✨",
    ]
  },
  
  // Phase Célébration (10+ actions ou site complet)
  celebration: {
    professional: [
      "Excellent travail. Votre site est prêt à être publié.",
      "Félicitations, le site est complet.",
      "Travail accompli. Vous pouvez publier.",
    ],
    friendly: [
      "Wow, t'as bien bossé ! 🎉 Ton site est au top, ready to go !",
      "Bravo ! 🌟 Ton site est prêt à conquérir le monde !",
      "Incroyable ce que t'as fait ! Prêt à publier ? 🚀",
    ],
    creative: [
      "MASTERPIECE ALERT ! 🔥 Ce site va tout déchirer !",
      "Tu viens de créer une pépite ! 💎 Go publier ça !",
      "C'EST MAGNIFIQUE ! 🎨 Le monde attend de voir ça !",
    ],
    zen: [
      "Complet. Prêt à être partagé. 🌿",
      "Tout est là. Publie quand tu le sens. ✨",
      "Accompli. 🙏",
    ]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGES DE MILESTONE
// ═══════════════════════════════════════════════════════════════════════════

const MILESTONE_MESSAGES = {
  first_action: {
    professional: ["Première modification effectuée."],
    friendly: ["Première modif ! C'est parti ! 🎉"],
    creative: ["First blood ! Let's GO ! 🔥"],
    zen: ["Premier pas. ✨"],
  },
  
  five_actions: {
    professional: ["5 modifications réalisées. Bon rythme."],
    friendly: ["Déjà 5 modifs ! Tu gères 💪"],
    creative: ["5 modifs ! T'es une machine ! 🔥"],
    zen: ["5 changements. Bien. ✨"],
  },
  
  ten_actions: {
    professional: ["10 modifications. Votre site est bien personnalisé."],
    friendly: ["10 modifs ! Ton site devient vraiment unique 🌟"],
    creative: ["10 ! Ce site va être LÉGENDAIRE ! 🚀"],
    zen: ["10 évolutions. Le site se transforme. ✨"],
  },
  
  section_complete: {
    services: {
      professional: ["Section services complète."],
      friendly: ["Section services au top ! ✅"],
      creative: ["Services en place ! Boom ! 💥"],
      zen: ["Services : complet. ✨"],
    },
    testimonials: {
      professional: ["Témoignages en place. La preuve sociale est là."],
      friendly: ["Témoignages ajoutés ! Ça rassure les visiteurs ⭐"],
      creative: ["Social proof activée ! Les gens vont avoir confiance 🌟"],
      zen: ["Témoignages : fait. ✨"],
    },
    faq: {
      professional: ["FAQ créée. Vos visiteurs trouveront leurs réponses."],
      friendly: ["FAQ en place ! Plus de questions sans réponse 📚"],
      creative: ["FAQ ready ! Tes visiteurs sont servis 🎯"],
      zen: ["FAQ : complète. ✨"],
    }
  },
  
  site_ready: {
    professional: ["Votre site est complet et prêt à être publié."],
    friendly: ["Ton site est PRÊT ! 🎉 Tu peux le publier !"],
    creative: ["SITE READY TO ROCK ! 🚀 Publie ce chef-d'œuvre !"],
    zen: ["Tout est en place. Prêt. 🌿"],
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOW FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Détermine la phase actuelle selon le nombre d'actions
 */
function getPhase(actionCount) {
  if (actionCount <= 2) return 'proactive'
  if (actionCount <= 5) return 'supportive'
  if (actionCount < 10) return 'discrete'
  return 'celebration'
}

/**
 * Génère les suggestions de flow pour la section actuelle
 */
export function getFlowSuggestions(section, tone = 'friendly', actionCount = 0) {
  // Si trop d'actions, moins de suggestions
  if (actionCount > 7) {
    return [] // Luna se calme
  }
  
  const sectionFlow = SECTION_FLOW_SUGGESTIONS[section]
  if (!sectionFlow) {
    // Section non mappée, suggestions génériques
    return [
      { label: "Autre chose", value: "que puis-je modifier d'autre ?", emoji: "✨" },
      { label: "Prévisualiser", value: "montre moi le résultat", emoji: "👁️" },
    ]
  }
  
  const toneSuggestions = sectionFlow.suggestions[tone] || sectionFlow.suggestions.friendly
  
  // Retourne 2-3 suggestions selon la phase
  const phase = getPhase(actionCount)
  if (phase === 'proactive') {
    return toneSuggestions.slice(0, 3)
  } else if (phase === 'supportive') {
    return toneSuggestions.slice(0, 2)
  } else {
    return toneSuggestions.slice(0, 1)
  }
}

/**
 * Génère le message de suivi selon la phase
 */
export function getPhaseMessage(actionCount, tone = 'friendly') {
  const phase = getPhase(actionCount)
  const messages = PHASE_MESSAGES[phase]
  const toneMessages = messages[tone] || messages.friendly
  
  return pickRandom(toneMessages)
}

/**
 * Vérifie et retourne un message de milestone si applicable
 */
export function checkMilestone(actionCount, siteContent, tone = 'friendly') {
  // Premier action
  if (actionCount === 1) {
    const msgs = MILESTONE_MESSAGES.first_action[tone] || MILESTONE_MESSAGES.first_action.friendly
    return { type: 'first_action', message: pickRandom(msgs) }
  }
  
  // 5 actions
  if (actionCount === 5) {
    const msgs = MILESTONE_MESSAGES.five_actions[tone] || MILESTONE_MESSAGES.five_actions.friendly
    return { type: 'five_actions', message: pickRandom(msgs) }
  }
  
  // 10 actions
  if (actionCount === 10) {
    const msgs = MILESTONE_MESSAGES.ten_actions[tone] || MILESTONE_MESSAGES.ten_actions.friendly
    return { type: 'ten_actions', message: pickRandom(msgs) }
  }
  
  // Vérifier sections complètes
  const servicesCount = siteContent?.services?.items?.length || 0
  const testimonialsCount = siteContent?.testimonials?.items?.length || 0
  const faqCount = siteContent?.faq?.items?.length || 0
  
  // Site prêt ? (hero + 3 services + 2 témoignages + 2 FAQ)
  if (servicesCount >= 3 && testimonialsCount >= 2 && faqCount >= 2) {
    const msgs = MILESTONE_MESSAGES.site_ready[tone] || MILESTONE_MESSAGES.site_ready.friendly
    return { type: 'site_ready', message: pickRandom(msgs), isMajor: true }
  }
  
  return null
}

/**
 * Génère un message de fin de conversation intelligent
 */
export function generateClosingMessage(options = {}) {
  const { tone = 'friendly', actionCount = 0, siteContent = {} } = options
  
  const phase = getPhase(actionCount)
  
  // Vérifier si site complet
  const servicesCount = siteContent?.services?.items?.length || 0
  const testimonialsCount = siteContent?.testimonials?.items?.length || 0
  
  if (servicesCount >= 3 && testimonialsCount >= 2) {
    // Site quasi complet
    const messages = {
      professional: "Votre site est prêt. Vous pouvez le publier ou continuer les ajustements.",
      friendly: "Ton site est au top ! 🎉 Publie-le ou fais-moi signe si tu veux peaufiner !",
      creative: "Ce site est une TUERIE ! 🔥 Ready to go live ou on pousse encore ?",
      zen: "Prêt. Publie quand tu le sens. 🌿"
    }
    return {
      text: messages[tone] || messages.friendly,
      mood: LUNA_MOODS.celebrate,
      isClosing: true
    }
  }
  
  // Sinon message de phase normal
  const phaseMessage = getPhaseMessage(actionCount, tone)
  const phaseMood = phase === 'celebration' ? LUNA_MOODS.celebrate : 
                    phase === 'discrete' ? LUNA_MOODS.wink :
                    LUNA_MOODS.happy
  
  return {
    text: phaseMessage,
    mood: phaseMood,
    isClosing: phase === 'discrete' || phase === 'celebration'
  }
}

/**
 * Génère une réponse complète avec message + suggestions de flow
 */
export function generateFlowResponse(action, options = {}) {
  const {
    tone = 'friendly',
    activity = null,
    activityCategory = null,
    actionCount = 0,
    siteContent = {},
    section = null
  } = options
  
  // 1. Générer le message principal
  const lunaMessage = generateLunaMessage(action, {
    tone,
    activity,
    activityCategory,
    path: action.path
  })
  
  // 2. Vérifier milestone
  const milestone = checkMilestone(actionCount, siteContent, tone)
  
  // 3. Obtenir les suggestions de flow
  const currentSection = section || action.section || action.path?.split('.')[0]
  const flowSuggestions = getFlowSuggestions(currentSection, tone, actionCount)
  
  // 4. Message de phase si pas de milestone
  const phaseInfo = generateClosingMessage({ tone, actionCount, siteContent })
  
  // 5. Construire la réponse
  let finalText = lunaMessage.text
  
  // Ajouter milestone si présent
  if (milestone && milestone.isMajor) {
    finalText = `${milestone.message}\n\n${finalText}`
  }
  
  // Ajouter message de phase si on est en mode discret
  if (phaseInfo.isClosing && actionCount > 5) {
    finalText = `${finalText}\n\n${phaseInfo.text}`
  }
  
  return {
    text: finalText,
    mood: milestone?.isMajor ? LUNA_MOODS.celebrate : lunaMessage.mood,
    suggestion: lunaMessage.suggestion,
    flowSuggestions,
    milestone,
    phase: getPhase(actionCount),
    isClosing: phaseInfo.isClosing
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  generateLunaMessage,
  generateBatchMessage,
  generateGreeting,
  generateThinkingMessage,
  generateCelebrationMessage,
  generateContextualSuggestion,
  generateErrorMessage,
  generateFlowResponse,
  generateClosingMessage,
  getFlowSuggestions,
  getPhaseMessage,
  checkMilestone,
  LUNA_MOODS,
}
