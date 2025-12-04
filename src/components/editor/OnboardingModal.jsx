// ═══════════════════════════════════════════════════════════════════════════
// ONBOARDING MODAL - 3 questions pour personnaliser l'IA
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ArrowLeft, Check, X } from 'lucide-react'
import useUserPreferencesStore, { 
  ACTIVITY_CATEGORIES, 
  TONE_OPTIONS, 
  COLOR_OPTIONS 
} from '../../stores/userPreferencesStore'

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const {
    onboardingStep,
    setOnboardingStep,
    activityCategory,
    activityCustom,
    setActivity,
    tone,
    setTone,
    preferredColor,
    setPreferredColor,
    completeOnboarding
  } = useUserPreferencesStore()

  const [customActivity, setCustomActivity] = useState(activityCustom || '')
  const [showCustomInput, setShowCustomInput] = useState(false)

  if (!isOpen) return null

  const handleActivitySelect = (categoryId) => {
    if (categoryId === 'autre') {
      setShowCustomInput(true)
      setActivity(categoryId, customActivity)
    } else {
      setShowCustomInput(false)
      setActivity(categoryId, '')
    }
  }

  const handleNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      completeOnboarding()
      onComplete?.()
      onClose?.()
    }
  }

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
    onComplete?.()
    onClose?.()
  }

  const canProceed = () => {
    switch (onboardingStep) {
      case 1: return activityCategory !== null
      case 2: return tone !== null
      case 3: return preferredColor !== null
      default: return false
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-700/50"
        >
          {/* Header avec Luna */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">Salut ! Je suis Luna 🌙</h2>
                <p className="text-gray-300 text-sm">Ton assistante créative</p>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 py-4 bg-gray-800/50">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  step === onboardingStep 
                    ? 'bg-purple-500' 
                    : step < onboardingStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-600'
                }`}
                animate={step === onboardingStep ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {onboardingStep === 1 && (
                <Step1Activity
                  key="step1"
                  selectedCategory={activityCategory}
                  customActivity={customActivity}
                  showCustomInput={showCustomInput}
                  onSelect={handleActivitySelect}
                  onCustomChange={(val) => {
                    setCustomActivity(val)
                    setActivity(activityCategory, val)
                  }}
                />
              )}
              {onboardingStep === 2 && (
                <Step2Tone
                  key="step2"
                  selectedTone={tone}
                  onSelect={setTone}
                />
              )}
              {onboardingStep === 3 && (
                <Step3Color
                  key="step3"
                  selectedColor={preferredColor}
                  onSelect={setPreferredColor}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex items-center justify-between">
            <div>
              {onboardingStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Passer
                </button>
              )}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed()}
              whileHover={{ scale: canProceed() ? 1.02 : 1 }}
              whileTap={{ scale: canProceed() ? 0.98 : 1 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {onboardingStep === 3 ? (
                <>
                  C'est parti !
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1 - Activité
// ═══════════════════════════════════════════════════════════════════════════

function Step1Activity({ selectedCategory, customActivity, showCustomInput, onSelect, onCustomChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        C'est quoi ton activité ? 🎯
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Je personnaliserai mes suggestions pour toi
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {ACTIVITY_CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl text-left transition-all border ${
              selectedCategory === category.id
                ? 'bg-purple-500/20 border-purple-500 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              <span className="font-medium">{category.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Input personnalisé */}
      <AnimatePresence>
        {(showCustomInput || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={customActivity}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder={showCustomInput ? "Décris ton activité..." : "Précise si tu veux (optionnel)"}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2 - Ton
// ═══════════════════════════════════════════════════════════════════════════

function Step2Tone({ selectedTone, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        Quel ton pour ton site ? 🎨
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Je m'adapterai à ton style de communication
      </p>

      <div className="space-y-3">
        {TONE_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full p-4 rounded-xl text-left transition-all border ${
              selectedTone === option.id
                ? 'bg-purple-500/20 border-purple-500'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{option.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-white">{option.label}</div>
                <div className="text-sm text-gray-400 mt-0.5">{option.description}</div>
                <div className="text-xs text-gray-500 mt-2 italic">"{option.example}"</div>
              </div>
              {selectedTone === option.id && (
                <Check className="w-5 h-5 text-purple-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3 - Couleur
// ═══════════════════════════════════════════════════════════════════════════

function Step3Color({ selectedColor, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        Une couleur dominante ? 🎨
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Je proposerai des designs qui te correspondent
      </p>

      <div className="grid grid-cols-2 gap-3">
        {COLOR_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl text-left transition-all border relative overflow-hidden ${
              selectedColor === option.id
                ? 'border-purple-500 ring-2 ring-purple-500/30'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            style={{
              background: option.hex 
                ? `linear-gradient(135deg, ${option.hex}20 0%, transparent 50%)`
                : 'linear-gradient(135deg, #6B5B9520 0%, #E8B4CB20 50%, #4ECDC420 100%)'
            }}
          >
            <div className="flex items-center gap-3">
              {option.hex ? (
                <div 
                  className="w-8 h-8 rounded-full shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: option.hex }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-lg" />
              )}
              <div>
                <div className="font-medium text-white flex items-center gap-1">
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </div>
              </div>
            </div>
            
            {selectedColor === option.id && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <Check className="w-5 h-5 text-purple-400" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
