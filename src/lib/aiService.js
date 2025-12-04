// ═══════════════════════════════════════════════════════════════════════════
// AI SERVICE V5 - Phase 2: Context Enrichi + Actions Batch + Rollback
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const THEME_PRESETS = {
  forest: { name: 'Forêt', primary: '#2D5A3D', secondary: '#E5B94E' },
  ocean: { name: 'Océan', primary: '#1E3A5F', secondary: '#4ECDC4' },
  sunset: { name: 'Coucher', primary: '#D4451A', secondary: '#FFB347' },
  lavender: { name: 'Lavande', primary: '#6B5B95', secondary: '#E8B4CB' },
  midnight: { name: 'Minuit', primary: '#1A1A2E', secondary: '#E94560' },
  minimal: { name: 'Minimal', primary: '#333333', secondary: '#666666' }
}

export const FONT_OPTIONS = {
  inter: 'Inter (Moderne)',
  playfair: 'Playfair (Élégant)',
  poppins: 'Poppins (Friendly)',
  roboto: 'Roboto (Classique)',
  montserrat: 'Montserrat (Géométrique)',
  lora: 'Lora (Littéraire)'
}

// ═══════════════════════════════════════════════════════════════════════════
// EDITABLE PATHS MAP - Tous les chemins modifiables par l'IA
// ═══════════════════════════════════════════════════════════════════════════

export const EDITABLE_PATHS = {
  // THEME GLOBAL
  "theme.primaryColor": { type: "color", label: "Couleur principale", category: "theme" },
  "theme.secondaryColor": { type: "color", label: "Couleur secondaire", category: "theme" },
  "theme.fontHeading": { type: "select", label: "Police titres", options: Object.keys(FONT_OPTIONS), category: "theme" },
  "theme.fontBody": { type: "select", label: "Police texte", options: Object.keys(FONT_OPTIONS), category: "theme" },
  "theme.mode": { type: "select", label: "Mode", options: ["light", "dark"], category: "theme" },

  // HEADER
  "header.enabled": { type: "boolean", label: "Section active", category: "header" },
  "header.logoText": { type: "text", label: "Logo texte", maxLength: 30, category: "header" },
  "header.ctaButton.text": { type: "text", label: "Texte bouton CTA", category: "header" },
  "header.ctaButton.url": { type: "text", label: "URL bouton CTA", category: "header" },
  "header.sticky": { type: "boolean", label: "Header fixe", category: "header" },
  "header.styles.background.color": { type: "color", label: "Fond header", category: "header-design" },
  "header.styles.ctaButton.bgColor": { type: "color", label: "Couleur bouton CTA", category: "header-design" },
  "header.styles.shadow": { type: "boolean", label: "Ombre header", category: "header-design" },

  // HERO
  "hero.enabled": { type: "boolean", label: "Section active", category: "hero" },
  "hero.badge": { type: "text", label: "Badge", maxLength: 50, category: "hero" },
  "hero.title": { type: "text", label: "Titre principal", maxLength: 80, category: "hero" },
  "hero.subtitle": { type: "textarea", label: "Sous-titre", maxLength: 200, category: "hero" },
  "hero.ctaPrimary.text": { type: "text", label: "Texte bouton principal", category: "hero" },
  "hero.ctaPrimary.url": { type: "text", label: "URL bouton principal", category: "hero" },
  "hero.ctaSecondary.text": { type: "text", label: "Texte bouton secondaire", category: "hero" },
  "hero.ctaSecondary.url": { type: "text", label: "URL bouton secondaire", category: "hero" },
  "hero.styles.background.color": { type: "color", label: "Fond hero", category: "hero-design" },
  "hero.styles.title.color": { type: "color", label: "Couleur titre", category: "hero-design" },
  "hero.styles.badge.bgColor": { type: "color", label: "Fond badge", category: "hero-design" },
  "hero.styles.badge.textColor": { type: "color", label: "Texte badge", category: "hero-design" },
  "hero.styles.primaryButton.bgColor": { type: "color", label: "Fond bouton primaire", category: "hero-design" },
  "hero.styles.secondaryButton.borderColor": { type: "color", label: "Bordure bouton secondaire", category: "hero-design" },
  "hero.styles.buttonRadius": { type: "number", label: "Arrondi boutons", min: 0, max: 30, category: "hero-design" },
  "hero.styles.padding.vertical": { type: "number", label: "Padding vertical", min: 40, max: 160, category: "hero-design" },

  // SERVICES
  "services.enabled": { type: "boolean", label: "Section active", category: "services" },
  "services.title": { type: "text", label: "Titre section", category: "services" },
  "services.subtitle": { type: "textarea", label: "Sous-titre", category: "services" },
  "services.styles.background.color": { type: "color", label: "Fond section", category: "services-design" },
  "services.styles.cardRadius": { type: "number", label: "Arrondi cartes", min: 0, max: 30, category: "services-design" },
  "services.styles.cardBg": { type: "color", label: "Fond cartes", category: "services-design" },
  "services.styles.columns": { type: "number", label: "Colonnes", min: 2, max: 4, category: "services-design" },

  // ABOUT
  "about.enabled": { type: "boolean", label: "Section active", category: "about" },
  "about.title": { type: "text", label: "Titre", category: "about" },
  "about.subtitle": { type: "text", label: "Sous-titre", category: "about" },
  "about.content": { type: "textarea", label: "Contenu", category: "about" },
  "about.styles.background.color": { type: "color", label: "Fond section", category: "about-design" },
  "about.styles.titleColor": { type: "color", label: "Couleur titre", category: "about-design" },
  "about.styles.textAlign": { type: "select", label: "Alignement", options: ["left", "center", "right"], category: "about-design" },

  // TESTIMONIALS
  "testimonials.enabled": { type: "boolean", label: "Section active", category: "testimonials" },
  "testimonials.title": { type: "text", label: "Titre section", category: "testimonials" },
  "testimonials.subtitle": { type: "textarea", label: "Sous-titre", category: "testimonials" },
  "testimonials.styles.background.color": { type: "color", label: "Fond section", category: "testimonials-design" },
  "testimonials.styles.cardBg": { type: "color", label: "Fond cartes", category: "testimonials-design" },
  "testimonials.styles.starColor": { type: "color", label: "Couleur étoiles", category: "testimonials-design" },

  // FAQ
  "faq.enabled": { type: "boolean", label: "Section active", category: "faq" },
  "faq.title": { type: "text", label: "Titre", category: "faq" },
  "faq.subtitle": { type: "textarea", label: "Sous-titre", category: "faq" },
  "faq.styles.background.color": { type: "color", label: "Fond section", category: "faq-design" },
  "faq.styles.questionBg": { type: "color", label: "Fond questions", category: "faq-design" },

  // CTA
  "cta.enabled": { type: "boolean", label: "Section active", category: "cta" },
  "cta.title": { type: "text", label: "Titre", category: "cta" },
  "cta.subtitle": { type: "textarea", label: "Sous-titre", category: "cta" },
  "cta.buttonPrimary.text": { type: "text", label: "Texte bouton principal", category: "cta" },
  "cta.buttonSecondary.text": { type: "text", label: "Texte bouton secondaire", category: "cta" },
  "cta.styles.background.color": { type: "color", label: "Fond section", category: "cta-design" },

  // CONTACT
  "contact.enabled": { type: "boolean", label: "Section active", category: "contact" },
  "contact.title": { type: "text", label: "Titre", category: "contact" },
  "contact.phone": { type: "text", label: "Téléphone", category: "contact" },
  "contact.email": { type: "text", label: "Email", category: "contact" },
  "contact.address": { type: "textarea", label: "Adresse", category: "contact" },
  "contact.showForm": { type: "boolean", label: "Afficher formulaire", category: "contact" },
  "contact.styles.background.color": { type: "color", label: "Fond section", category: "contact-design" },

  // FOOTER
  "footer.enabled": { type: "boolean", label: "Section active", category: "footer" },
  "footer.logoText": { type: "text", label: "Logo texte", category: "footer" },
  "footer.description": { type: "textarea", label: "Description", category: "footer" },
  "footer.copyright": { type: "text", label: "Copyright", category: "footer" },
  "footer.styles.background.color": { type: "color", label: "Fond footer", category: "footer-design" },
  "footer.styles.textColor": { type: "color", label: "Couleur texte", category: "footer-design" }
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLLBACK DETECTION - Patterns pour détecter les demandes d'annulation
// ═══════════════════════════════════════════════════════════════════════════

const ROLLBACK_PATTERNS = [
  { pattern: /^(annule|annuler|undo|cancel)$/i, type: 'last' },
  { pattern: /annule\s*(ça|ca|le dernier|ton dernier|cette modif)/i, type: 'last' },
  { pattern: /reviens?\s*(en arrière|avant)/i, type: 'last' },
  { pattern: /défais?\s*(ça|ca|le dernier)/i, type: 'last' },
  { pattern: /annule\s*les?\s*(\d+)\s*derniers?\s*(changements?|modifs?)/i, type: 'multiple' },
  { pattern: /reviens?\s*(à|au)\s*avant\s*(le|la|les?)?\s*(.+)/i, type: 'toBatch' },
  { pattern: /recommence\s*(depuis le début|à zéro|tout)/i, type: 'reset' },
  { pattern: /garde\s*(juste|seulement|que)\s*(.+),?\s*annule\s*(le reste|les autres)/i, type: 'partial' },
  { pattern: /non\s*(finalement|en fait)/i, type: 'last' },
  { pattern: /c'était\s*mieux\s*avant/i, type: 'last' }
]

export function detectRollbackIntent(message) {
  const normalized = message.toLowerCase().trim()
  
  for (const { pattern, type } of ROLLBACK_PATTERNS) {
    const match = normalized.match(pattern)
    if (match) {
      return {
        isRollback: true,
        type,
        match: match[0],
        count: type === 'multiple' ? parseInt(match[1]) : 1,
        target: type === 'toBatch' ? match[3] : null,
        keep: type === 'partial' ? match[2] : null
      }
    }
  }
  
  return { isRollback: false }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT BUILDER - Génère le contexte enrichi pour l'IA
// ═══════════════════════════════════════════════════════════════════════════

export function buildEnrichedContext({
  siteContent,
  selectedElement = null,
  activeSection = null,
  activeTab = 'content',
  conversationHistory = [],
  aiActionHistory = [],
  userPreferences = null
}) {
  const ctx = {
    system: '',
    user: ''
  }

  // ═══ SYSTÈME : Capacités et règles ═══
  ctx.system = `Tu es l'assistant IA de l'éditeur Universal Editor. Tu modifies le site web de l'utilisateur.

═══ FORMAT DE RÉPONSE JSON OBLIGATOIRE ═══
Tu dois TOUJOURS répondre avec un JSON valide, rien d'autre. Pas de texte avant ou après.
{
  "message": "Message court avec 1-2 emojis",
  "actions": [{"type":"update","path":"hero.title","value":"Nouveau texte","label":"Titre"}],
  "requiresConfirmation": false,
  "options": [{"id":"1","label":"Option","emoji":"🎯"}]
}

IMPORTANT: Ne mets JAMAIS de code JavaScript dans le JSON (pas de Date.now(), pas de variables).
Toutes les valeurs doivent être des strings, numbers, booleans ou arrays/objects valides.

═══ TYPES D'ACTIONS ═══

1. UPDATE (modification simple):
   {"type":"update","path":"hero.title","value":"Nouveau titre","label":"Titre modifié"}

2. UPDATE NESTED (styles):
   {"type":"update","path":"hero.styles.background.color","value":"#1a1a1a","label":"Fond sombre"}

3. UPDATE BUTTON (objet complet):
   {"type":"update","path":"hero.ctaPrimary","value":{"text":"Clic","url":"#"},"label":"Bouton"}

4. UPDATE ARRAY ITEM:
   {"type":"update_item","path":"services.items","index":0,"updates":{"name":"Nouveau"},"label":"Service modifié"}

5. ADD ITEM:
   {"type":"add_item","path":"services.items","value":{"name":"Nouveau","icon":"Star","tagline":"","description":""},"label":"Service ajouté"}

6. DELETE ITEM:
   {"type":"delete_item","path":"faq.items","index":2,"label":"Question supprimée"}

7. GENERATE SECTION (plusieurs items):
   {"type":"generate_section","section":"testimonials","data":{"items":[...]},"label":"Témoignages générés"}

8. APPLY THEME PRESET:
   {"type":"apply_preset","preset":"ocean","label":"Thème Océan"}

9. UPDATE THEME:
   {"type":"update_theme","primary":"#1E3A5F","secondary":"#4ECDC4","label":"Couleurs modifiées"}

═══ RÈGLES D'INTELLIGENCE ═══

Tu es un assistant intelligent pour un éditeur de sites. Tu dois être MALIN et poser les bonnes questions au bon moment.

🧠 RÈGLE D'OR : Si l'utilisateur ne précise pas assez → DEMANDE avec des options cliquables
             Si l'utilisateur précise clairement → AGIS directement

═══ COMPORTEMENT PAR TYPE D'ÉLÉMENT ═══

📝 TEXTES (titre, sous-titre, description, badge, content):
- "modifie" / "change" sans précision → Propose 3 alternatives adaptées au contexte
- "améliore" / "rends plus accrocheur" → Applique directement une amélioration
- Texte spécifique fourni → Applique directement

🎨 COULEURS:
- Couleur PRÉCISÉE ("en vert", "en bleu", "sombre") → Applique directement le code hex
- "change la couleur" SANS précision → Demande avec options de couleurs
- Toujours modifier le chemin .styles.*.color, JAMAIS le texte !

🔘 BOUTONS (ctaPrimary, ctaSecondary, ctaButton):
- "modifie le bouton" sans précision → Demande: texte ? url ? les deux ?
- "change le texte du bouton en X" → Applique directement
- "change l'url/lien du bouton" sans précision → Demande quelle URL

🖼️ IMAGES:
- Toute demande d'image → "Les images se modifient dans l'éditeur à gauche, section Design > Image"

📦 ITEMS (services, témoignages, FAQ, stats):
- "ajoute un service/témoignage/FAQ" sans détails → Demande les infos nécessaires
- "génère 3 services pour [activité]" → Génère directement avec le contexte
- "supprime le 2ème service" → Applique directement
- "modifie le service X" sans précision → Demande quoi modifier (nom, description, prix...)

🎭 SECTIONS:
- "active/désactive la section X" → Applique directement
- "cache les témoignages" → Désactive la section
- "montre la FAQ" → Active la section

🎨 THÈME GLOBAL:
- "change le thème" sans précision → Propose les presets (Océan, Forêt, Minuit...)
- "thème sombre" → Applique le preset correspondant
- "change la police" sans précision → Propose les options de polices

═══ FORMAT DES OPTIONS ═══

Pour les questions, utilise ce format:
{
  "message": "Question claire avec emoji 🎯",
  "actions": [],
  "options": [
    {"id":"1", "label":"Choix clair et concis", "emoji":"🎨", "value":"commande à exécuter si cliqué"}
  ]
}

═══ EXEMPLES COMPLETS ═══

--- TEXTES ---

User: "modifie le titre" (hero.title sélectionné = "Faites de la RSE un levier")
→ {"message":"Voici 3 propositions ! ✨","actions":[],"options":[
  {"id":"1","label":"La RSE : votre avantage compétitif","emoji":"🚀","value":"mets le titre: La RSE : votre avantage compétitif"},
  {"id":"2","label":"Transformez vos contraintes en opportunités","emoji":"💡","value":"mets le titre: Transformez vos contraintes en opportunités"},
  {"id":"3","label":"L'impact qui fait la différence","emoji":"💚","value":"mets le titre: L'impact qui fait la différence"}
]}

User: "rends ce titre plus percutant"
→ {"message":"Titre boosté ! 🔥","actions":[{"type":"update","path":"hero.title","value":"La RSE : votre arme secrète","label":"Titre percutant"}]}

--- COULEURS ---

User: "change la couleur"
→ {"message":"Quelle couleur souhaitez-vous ? 🎨","actions":[],"options":[
  {"id":"1","label":"Vert nature","emoji":"🌿","value":"mets en vert foncé"},
  {"id":"2","label":"Bleu professionnel","emoji":"💙","value":"mets en bleu"},
  {"id":"3","label":"Rouge dynamique","emoji":"🔴","value":"mets en rouge"},
  {"id":"4","label":"Violet élégant","emoji":"💜","value":"mets en violet"}
]}

User: "mets en bleu" ou "change la couleur en bleu"
→ {"message":"Couleur appliquée ! 💙","actions":[{"type":"update","path":"hero.styles.title.color","value":"#1E40AF","label":"Couleur titre"}]}

User: "fond sombre pour le hero"
→ {"message":"Mode sombre activé ! 🌙","actions":[
  {"type":"update","path":"hero.styles.background.color","value":"#1a1a2e","label":"Fond sombre"},
  {"type":"update","path":"hero.styles.title.color","value":"#ffffff","label":"Titre blanc"},
  {"type":"update","path":"hero.styles.subtitle.color","value":"#e0e0e0","label":"Sous-titre clair"}
]}

--- BOUTONS ---

User: "modifie le bouton" (ctaPrimary sélectionné)
→ {"message":"Que souhaitez-vous modifier ? 🔘","actions":[],"options":[
  {"id":"1","label":"Changer le texte","emoji":"✏️","value":"change le texte du bouton"},
  {"id":"2","label":"Changer le lien/URL","emoji":"🔗","value":"change l'URL du bouton"},
  {"id":"3","label":"Les deux","emoji":"🔄","value":"change le texte et l'URL du bouton"}
]}

User: "change le texte du bouton"
→ {"message":"Quel texte ? ✏️","actions":[],"options":[
  {"id":"1","label":"Commencer maintenant","emoji":"🚀","value":"mets le texte: Commencer maintenant"},
  {"id":"2","label":"En savoir plus","emoji":"📖","value":"mets le texte: En savoir plus"},
  {"id":"3","label":"Nous contacter","emoji":"📞","value":"mets le texte: Nous contacter"}
]}

User: "mets 'Démarrer' comme texte de bouton"
→ {"message":"Bouton mis à jour ! ✅","actions":[{"type":"update","path":"hero.ctaPrimary.text","value":"Démarrer","label":"Texte bouton"}]}

User: "change l'URL du bouton vers la page contact"
→ {"message":"Lien modifié ! 🔗","actions":[{"type":"update","path":"hero.ctaPrimary.url","value":"#contact","label":"URL bouton"}]}

--- ITEMS (Services, Témoignages, FAQ) ---

User: "ajoute un service"
→ {"message":"Quel type de service ? 🛠️","actions":[],"options":[
  {"id":"1","label":"Je te décris le service","emoji":"✏️","value":"je vais te décrire le service"},
  {"id":"2","label":"Génère-en un adapté à mon activité","emoji":"🤖","value":"génère un service adapté à mon activité"},
  {"id":"3","label":"Service générique","emoji":"📦","value":"ajoute un service générique"}
]}

User: "génère 3 services pour une agence web"
→ {"message":"3 services créés ! 🚀","actions":[{"type":"generate_section","section":"services","data":{"items":[
  {"id":"s1","icon":"Code","name":"Développement Web","tagline":"Sites sur-mesure","description":"Création de sites modernes"},
  {"id":"s2","icon":"Palette","name":"Design UI/UX","tagline":"Interfaces intuitives","description":"Des designs qui convertissent"},
  {"id":"s3","icon":"Rocket","name":"SEO & Performance","tagline":"Visibilité maximale","description":"Optimisation pour les moteurs"}
]},"label":"Services générés"}],"requiresConfirmation":true}

User: "supprime le 2ème service"
→ {"message":"Service supprimé ! 🗑️","actions":[{"type":"delete_item","path":"services.items","index":1,"label":"Service supprimé"}]}

User: "ajoute une question FAQ"
→ {"message":"Quelle question ? 🤔","actions":[],"options":[
  {"id":"1","label":"Je te donne la question","emoji":"✏️","value":"je vais te donner la question"},
  {"id":"2","label":"Génère une question pertinente","emoji":"🤖","value":"génère une question FAQ pertinente pour mon activité"}
]}

User: "ajoute la question 'Quels sont vos tarifs ?' avec la réponse 'Nos tarifs dépendent...'"
→ {"message":"FAQ ajoutée ! ✅","actions":[{"type":"add_item","path":"faq.items","value":{"id":"faq-new","question":"Quels sont vos tarifs ?","answer":"Nos tarifs dépendent..."},"label":"Question ajoutée"}]}

--- THÈME ---

User: "change le thème"
→ {"message":"Quel style préférez-vous ? 🎨","actions":[],"options":[
  {"id":"1","label":"Océan (bleu professionnel)","emoji":"🌊","value":"applique le thème Océan"},
  {"id":"2","label":"Forêt (vert nature)","emoji":"🌲","value":"applique le thème Forêt"},
  {"id":"3","label":"Minuit (sombre élégant)","emoji":"🌙","value":"applique le thème Minuit"},
  {"id":"4","label":"Coucher de soleil (chaleureux)","emoji":"🌅","value":"applique le thème Coucher"}
]}

User: "applique le thème Océan"
→ {"message":"Thème Océan appliqué ! 🌊","actions":[{"type":"apply_preset","preset":"ocean","label":"Thème Océan"}]}

User: "change la police"
→ {"message":"Quelle police ? 📝","actions":[],"options":[
  {"id":"1","label":"Playfair (élégante)","emoji":"✨","value":"mets la police Playfair"},
  {"id":"2","label":"Inter (moderne)","emoji":"💻","value":"mets la police Inter"},
  {"id":"3","label":"Poppins (friendly)","emoji":"😊","value":"mets la police Poppins"}
]}

--- SECTIONS ---

User: "désactive les témoignages"
→ {"message":"Section masquée ! 👁️‍🗨️","actions":[{"type":"update","path":"testimonials.enabled","value":false,"label":"Témoignages désactivés"}]}

User: "active la FAQ"
→ {"message":"FAQ visible ! ✅","actions":[{"type":"update","path":"faq.enabled","value":true,"label":"FAQ activée"}]}

--- IMAGES ---

User: "change l'image du hero" ou "modifie l'image"
→ {"message":"Pour modifier les images, utilise l'éditeur à gauche :\n1. Clique sur la section\n2. Va dans l'onglet Design\n3. Modifie l'URL de l'image 🖼️","actions":[]}

═══ RÈGLES IMPORTANTES ═══

1. TOUJOURS répondre en JSON valide, pas de texte avant/après
2. Si élément sélectionné (Focus Mode) → agis sur CET élément
3. Si demande vague → propose des OPTIONS cliquables (3-4 max)
4. Si demande claire → applique DIRECTEMENT avec une action
5. COHÉRENCE: fond sombre → adapte automatiquement les textes en clair
6. requiresConfirmation: true si >3 actions ou changement majeur
7. Messages courts avec 1-2 emojis max
8. Les "value" des options doivent être des phrases que tu peux comprendre`

  // ═══ UTILISATEUR : Contexte actuel ═══
  let userContext = '═══ CONTEXTE ACTUEL ═══\n\n'

  // Préférences utilisateur (onboarding)
  if (userPreferences) {
    userContext += `👤 UTILISATEUR:\n`
    if (userPreferences.activity) {
      userContext += `- Activité: ${userPreferences.activity}\n`
    }
    if (userPreferences.tone) {
      userContext += `- Ton préféré: ${userPreferences.tone} (${userPreferences.toneDescription || ''})\n`
    }
    if (userPreferences.preferredColorName) {
      userContext += `- Couleur préférée: ${userPreferences.preferredColorName}\n`
    }
    userContext += `→ ADAPTE tes suggestions à son activité et son ton !\n\n`
  }

  // Position dans l'éditeur
  userContext += `📍 POSITION:\n`
  userContext += `- Section active: ${activeSection || 'aucune'}\n`
  userContext += `- Onglet: ${activeTab === 'design' ? 'Design (styles)' : 'Contenu (textes)'}\n`
  
  if (selectedElement) {
    userContext += `\n🎯 ÉLÉMENT SÉLECTIONNÉ (Click-to-Edit ACTIF):\n`
    userContext += `- Chemin: ${selectedElement.section}.${selectedElement.field}\n`
    userContext += `- Label: ${selectedElement.label || selectedElement.field}\n`
    userContext += `- Valeur actuelle: "${selectedElement.currentValue || '(vide)'}"\n`
    if (selectedElement.itemIndex !== null && selectedElement.itemIndex !== undefined) {
      userContext += `- Index item: ${selectedElement.itemIndex}\n`
    }
    userContext += `→ L'utilisateur veut modifier CET élément précis !\n`
  }

  // Thème actuel
  const theme = siteContent?.theme || {}
  userContext += `\n🎨 THÈME:\n`
  userContext += `- Primaire: ${theme.primaryColor || '#2D5A3D'}\n`
  userContext += `- Secondaire: ${theme.secondaryColor || '#E5B94E'}\n`
  userContext += `- Polices: ${theme.fontHeading || 'playfair'} / ${theme.fontBody || 'inter'}\n`
  userContext += `- Mode: ${theme.mode || 'light'}\n`

  // Contenu des sections
  userContext += `\n📄 SECTIONS:\n`
  const sections = ['header', 'hero', 'services', 'about', 'testimonials', 'faq', 'cta', 'contact', 'footer']
  
  sections.forEach(key => {
    const s = siteContent?.[key]
    if (!s) return
    
    const enabled = s.enabled !== false ? '✅' : '❌'
    userContext += `\n${key.toUpperCase()} ${enabled}:\n`
    
    // Champs texte
    if (s.logoText) userContext += `  logo: "${s.logoText}"\n`
    if (s.title) userContext += `  title: "${s.title}"\n`
    if (s.subtitle) userContext += `  subtitle: "${s.subtitle?.slice(0, 50)}..."\n`
    if (s.badge) userContext += `  badge: "${s.badge}"\n`
    if (s.content) userContext += `  content: "${s.content?.slice(0, 50)}..."\n`
    
    // Boutons
    if (s.ctaButton?.text) userContext += `  ctaButton: "${s.ctaButton.text}"\n`
    if (s.ctaPrimary?.text) userContext += `  ctaPrimary: "${s.ctaPrimary.text}"\n`
    if (s.ctaSecondary?.text) userContext += `  ctaSecondary: "${s.ctaSecondary.text}"\n`
    if (s.buttonPrimary?.text) userContext += `  buttonPrimary: "${s.buttonPrimary.text}"\n`
    
    // Items
    const itemsKey = key === 'about' ? 'values' : 'items'
    if (s[itemsKey]?.length) {
      userContext += `  ${itemsKey} (${s[itemsKey].length}):\n`
      s[itemsKey].slice(0, 4).forEach((item, i) => {
        const name = item.name || item.title || item.question || item.author || `Item ${i+1}`
        userContext += `    [${i}] ${name}\n`
      })
      if (s[itemsKey].length > 4) userContext += `    ...+${s[itemsKey].length - 4}\n`
    }

    // Styles (si design)
    if (activeTab === 'design' && s.styles) {
      const styleKeys = Object.keys(s.styles).slice(0, 3)
      if (styleKeys.length) {
        userContext += `  styles: ${styleKeys.map(k => `${k}:${JSON.stringify(s.styles[k])}`).join(', ')}\n`
      }
    }
  })

  // Historique IA récent
  if (aiActionHistory.length > 0) {
    userContext += `\n📜 DERNIÈRES ACTIONS IA:\n`
    aiActionHistory.slice(-3).forEach((action, i) => {
      userContext += `  ${i + 1}. ${action.description} (${action.changes?.length || 0} modifs)\n`
    })
  }

  ctx.user = userContext
  return ctx
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export function getValueAtPath(obj, path) {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current === undefined || current === null) return undefined
    current = current[part]
  }
  return current
}

export function setValueAtPath(obj, path, value) {
  const parts = path.split('.')
  const newObj = JSON.parse(JSON.stringify(obj))
  let current = newObj
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || current[part] === null) {
      current[part] = {}
    }
    current = current[part]
  }
  
  current[parts[parts.length - 1]] = value
  return newObj
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function executeActions(actions, siteContent) {
  if (!actions?.length) return { results: [], updatedContent: siteContent, changes: [] }
  
  const results = []
  const changes = []
  let content = JSON.parse(JSON.stringify(siteContent))
  
  for (const action of actions) {
    try {
      const { type, path, value, label, index, preset, section, data, updates, primary, secondary } = action
      
      switch (type) {
        case 'update': {
          const oldValue = getValueAtPath(content, path)
          content = setValueAtPath(content, path, value)
          changes.push({ path, oldValue, newValue: value })
          results.push({ success: true, label: label || path })
          break
        }
        
        case 'update_item': {
          const items = getValueAtPath(content, path)
          if (Array.isArray(items) && items[index]) {
            const oldValue = { ...items[index] }
            items[index] = { ...items[index], ...updates }
            changes.push({ path: `${path}[${index}]`, oldValue, newValue: items[index] })
            results.push({ success: true, label: label || `Item ${index + 1}` })
          }
          break
        }
        
        case 'add_item': {
          const items = getValueAtPath(content, path)
          if (Array.isArray(items)) {
            const newItem = { id: `item-${Date.now()}`, ...value }
            items.push(newItem)
            changes.push({ path: `${path}[${items.length - 1}]`, oldValue: null, newValue: newItem })
            results.push({ success: true, label: label || 'Ajouté' })
          }
          break
        }
        
        case 'delete_item': {
          const items = getValueAtPath(content, path)
          if (Array.isArray(items) && items[index]) {
            const oldValue = items[index]
            items.splice(index, 1)
            changes.push({ path: `${path}[${index}]`, oldValue, newValue: null })
            results.push({ success: true, label: label || 'Supprimé' })
          }
          break
        }
        
        case 'apply_preset': {
          const presetData = THEME_PRESETS[preset]
          if (presetData) {
            const oldTheme = { ...content.theme }
            content.theme = {
              ...content.theme,
              primaryColor: presetData.primary,
              secondaryColor: presetData.secondary
            }
            changes.push({ path: 'theme', oldValue: oldTheme, newValue: content.theme })
            results.push({ success: true, label: `Thème ${presetData.name}` })
          }
          break
        }
        
        case 'update_theme': {
          const oldTheme = { ...content.theme }
          if (primary) content.theme.primaryColor = primary
          if (secondary) content.theme.secondaryColor = secondary
          changes.push({ path: 'theme', oldValue: oldTheme, newValue: content.theme })
          results.push({ success: true, label: label || 'Thème' })
          break
        }
        
        case 'generate_section': {
          const oldSection = content[section] ? { ...content[section] } : {}
          content[section] = { ...content[section], ...data }
          
          const itemsKey = section === 'about' ? 'values' : 'items'
          if (data[itemsKey]) {
            content[section][itemsKey] = data[itemsKey].map((item, i) => ({
              id: item.id || `gen-${Date.now()}-${i}`,
              ...item
            }))
          }
          changes.push({ path: section, oldValue: oldSection, newValue: content[section] })
          results.push({ success: true, label: label || `${section} généré` })
          break
        }
        
        case 'toggle_section': {
          const { enabled } = action
          const oldValue = content[section]?.enabled
          if (content[section]) {
            content[section].enabled = enabled
            changes.push({ path: `${section}.enabled`, oldValue, newValue: enabled })
            results.push({ success: true, label: `${section} ${enabled ? 'activé' : 'désactivé'}` })
          }
          break
        }
        
        // Legacy: update_field
        case 'update_field': {
          const { field } = action
          const fullPath = `${section}.${field}`
          const oldValue = getValueAtPath(content, fullPath)
          content = setValueAtPath(content, fullPath, value)
          changes.push({ path: fullPath, oldValue, newValue: value })
          results.push({ success: true, label: label || field })
          break
        }
        
        // Legacy: update_button
        case 'update_button': {
          const { button } = action
          const fullPath = `${section}.${button}`
          const oldValue = getValueAtPath(content, fullPath)
          content = setValueAtPath(content, fullPath, { ...oldValue, ...updates })
          changes.push({ path: fullPath, oldValue, newValue: getValueAtPath(content, fullPath) })
          results.push({ success: true, label: label || 'Bouton' })
          break
        }
        
        default:
          console.warn('Action non reconnue:', type)
      }
    } catch (err) {
      console.error('Erreur action:', err, action)
      results.push({ success: false, label: `Erreur: ${action.type}` })
    }
  }
  
  return { results, updatedContent: content, changes }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN API CALL
// ═══════════════════════════════════════════════════════════════════════════

export async function generateWithActions(
  prompt,
  siteContent,
  conversationHistory = [],
  apiKey,
  selectedElement = null,
  options = {}
) {
  const {
    activeSection = null,
    activeTab = 'content',
    aiActionHistory = [],
    userPreferences = null
  } = options

  if (!apiKey) {
    return {
      message: "🔑 Configure ta clé API dans les paramètres (⚙️)",
      actions: [],
      options: []
    }
  }

  // Détecter rollback
  const rollbackIntent = detectRollbackIntent(prompt)
  if (rollbackIntent.isRollback) {
    return {
      message: "⏪ Compris !",
      isRollback: true,
      rollbackType: rollbackIntent.type,
      rollbackCount: rollbackIntent.count,
      rollbackTarget: rollbackIntent.target,
      actions: []
    }
  }

  try {
    const context = buildEnrichedContext({
      siteContent,
      selectedElement,
      activeSection,
      activeTab,
      conversationHistory,
      aiActionHistory,
      userPreferences
    })

    const messages = []
    
    // Historique
    for (const msg of conversationHistory.slice(-8)) {
      if (msg.role === 'assistant') {
        messages.push({
          role: 'assistant',
          content: JSON.stringify({ message: msg.content, actions: [] })
        })
      } else {
        messages.push({ role: 'user', content: msg.content })
      }
    }
    
    messages.push({
      role: 'user',
      content: `${context.user}\n\n═══ DEMANDE ═══\n${prompt}`
    })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: context.system,
        messages
      })
    })

    if (!response.ok) {
      if (response.status === 429) {
        return {
          message: "⏳ Trop de requêtes, patiente un peu...",
          actions: [],
          options: [{ id: "1", label: "Réessayer", value: prompt, emoji: "🔄" }]
        }
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    
    try {
      // Nettoyer le texte
      let clean = text.trim()
      
      // Enlever les backticks markdown si présents
      clean = clean.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '')
      clean = clean.trim()
      
      // Trouver le JSON dans la réponse
      let jsonStr = clean
      if (!clean.startsWith('{')) {
        const match = clean.match(/\{[\s\S]*\}/)
        if (match) jsonStr = match[0]
      }
      
      // Nettoyer les erreurs courantes de l'IA
      jsonStr = jsonStr
        .replace(/Date\.now\(\)/g, `"batch-${Date.now()}"`)
        .replace(/:\s*true\/false/g, ': false')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
      
      const parsed = JSON.parse(jsonStr)
      
      return {
        message: cleanText(parsed.message) || "C'est fait !",
        actions: parsed.actions || [],
        batchId: parsed.batchId || `batch-${Date.now()}`,
        requiresConfirmation: parsed.requiresConfirmation || (parsed.actions?.length > 3),
        options: parsed.options || [],
        preview: parsed.preview || null,
        celebration: parsed.celebration || false
      }
    } catch (e) {
      console.error('Parse error:', e, text)
      
      // Fallback: extraire juste le message si possible
      const msgMatch = text.match(/"message"\s*:\s*"([^"]+)"/)
      if (msgMatch) {
        return {
          message: msgMatch[1],
          actions: [],
          options: [],
          batchId: `batch-${Date.now()}`
        }
      }
    }
    
    return { message: cleanText(text).slice(0, 200), actions: [], options: [], batchId: `batch-${Date.now()}` }

  } catch (err) {
    console.error('API Error:', err)
    return {
      message: `😅 Erreur: ${err.message}`,
      actions: [],
      options: [{ id: "1", label: "Réessayer", value: prompt, emoji: "🔄" }]
    }
  }
}

function cleanText(text) {
  if (!text) return ''
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"').trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// PROACTIVE SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getProactiveSuggestions(siteContent, selectedElement = null, activeSection = null) {
  const suggestions = []
  if (!siteContent) return suggestions
  
  // Suggestions basées sur l'élément sélectionné (Click-to-Edit)
  if (selectedElement) {
    const { field, section } = selectedElement
    
    // Textes
    if (field === 'title' || field === 'logoText') {
      suggestions.push({ emoji: '✨', text: 'Rendre plus accrocheur' })
      suggestions.push({ emoji: '🔄', text: 'Proposer des alternatives' })
      suggestions.push({ emoji: '🎨', text: 'Changer la couleur' })
    } else if (field === 'subtitle' || field === 'description' || field === 'content') {
      suggestions.push({ emoji: '✏️', text: 'Améliorer le texte' })
      suggestions.push({ emoji: '📝', text: 'Raccourcir' })
      suggestions.push({ emoji: '🔄', text: 'Reformuler' })
    } else if (field.includes('cta') || field.includes('button') || field.includes('Button')) {
      suggestions.push({ emoji: '🎯', text: 'Texte plus percutant' })
      suggestions.push({ emoji: '🔗', text: 'Changer le lien' })
      suggestions.push({ emoji: '🎨', text: 'Changer la couleur' })
    } else if (field === 'badge') {
      suggestions.push({ emoji: '🏷️', text: 'Plus impactant' })
      suggestions.push({ emoji: '🔄', text: 'Proposer des alternatives' })
    } else if (field === 'quote') {
      suggestions.push({ emoji: '💬', text: 'Améliorer le témoignage' })
      suggestions.push({ emoji: '✨', text: 'Plus authentique' })
    } else if (field === 'question') {
      suggestions.push({ emoji: '❓', text: 'Reformuler la question' })
    } else if (field === 'answer') {
      suggestions.push({ emoji: '💡', text: 'Améliorer la réponse' })
      suggestions.push({ emoji: '📝', text: 'Plus concis' })
    }
    
    return suggestions.slice(0, 3)
  }
  
  // Suggestions basées sur la section active
  if (activeSection) {
    const sectionData = siteContent[activeSection]
    
    if (activeSection === 'hero') {
      suggestions.push({ emoji: '🌙', text: 'Passer en mode sombre' })
      suggestions.push({ emoji: '✨', text: 'Refaire en style moderne' })
      suggestions.push({ emoji: '🎨', text: 'Changer les couleurs' })
    } else if (activeSection === 'services') {
      suggestions.push({ emoji: '➕', text: 'Ajouter un service' })
      suggestions.push({ emoji: '🔄', text: 'Régénérer les services' })
      if (sectionData?.items?.length > 3) {
        suggestions.push({ emoji: '🗑️', text: 'Supprimer un service' })
      }
    } else if (activeSection === 'testimonials') {
      suggestions.push({ emoji: '➕', text: 'Ajouter un témoignage' })
      suggestions.push({ emoji: '🤖', text: 'Générer des témoignages' })
    } else if (activeSection === 'faq') {
      suggestions.push({ emoji: '➕', text: 'Ajouter une question' })
      suggestions.push({ emoji: '🤖', text: 'Générer des FAQ pertinentes' })
    } else if (activeSection === 'contact') {
      suggestions.push({ emoji: '📧', text: 'Modifier les coordonnées' })
      suggestions.push({ emoji: '🕐', text: 'Changer les horaires' })
    } else if (activeSection === 'footer') {
      suggestions.push({ emoji: '📱', text: 'Ajouter un réseau social' })
      suggestions.push({ emoji: '📜', text: 'Ajouter une mention légale' })
    } else {
      suggestions.push({ emoji: '🎨', text: `Améliorer le design` })
      suggestions.push({ emoji: '✨', text: `Rendre plus moderne` })
    }
    
    // Option de masquer la section si elle est active
    if (sectionData?.enabled !== false) {
      suggestions.push({ emoji: '👁️', text: 'Masquer cette section' })
    }
    
    return suggestions.slice(0, 3)
  }
  
  // Suggestions générales (aucun élément sélectionné)
  if (!siteContent.testimonials?.items?.length) {
    suggestions.push({ emoji: '⭐', text: 'Générer des témoignages' })
  }
  if (!siteContent.faq?.items?.length) {
    suggestions.push({ emoji: '❓', text: 'Créer une FAQ' })
  }
  suggestions.push({ emoji: '🎨', text: 'Changer de thème' })
  suggestions.push({ emoji: '🌙', text: 'Passer en mode sombre' })
  suggestions.push({ emoji: '✨', text: 'Moderniser le hero' })
  
  return suggestions.slice(0, 4)
}
