import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSitesStore } from '../stores/sitesStore'
import { useToast } from '../components/ui/Toast'
import {
  Plus, Search, Edit3, Copy, Trash2, ExternalLink, MoreVertical,
  Globe, Calendar, Zap, Sparkles, ArrowRight, X, Check, Loader
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// SITE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function SiteCard({ site, onDuplicate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(site.slug)
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl"
    >
      {/* Preview thumbnail */}
      <div 
        className="h-40 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${site.draft_content?.theme?.primaryColor || '#2D5A3D'} 0%, ${site.draft_content?.theme?.secondaryColor || '#E5B94E'} 100%)`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/90">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Globe className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">{site.name}</p>
          </div>
        </div>
        
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          site.status === 'published' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        }`}>
          {site.status === 'published' ? 'Publié' : 'Brouillon'}
        </div>

        {/* Quick actions on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/editor/${site.slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition"
          >
            <Edit3 className="w-4 h-4" />
            Éditer
          </Link>
          {site.status === 'published' && (
            <Link
              to={`/site/${site.slug}`}
              target="_blank"
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-white group-hover:text-green-400 transition">{site.name}</h3>
            <p className="text-sm text-gray-500">{site.domain}</p>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 py-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 min-w-[140px]"
                  >
                    <Link
                      to={`/editor/${site.slug}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      Éditer
                    </Link>
                    <button
                      onClick={() => { onDuplicate(site.slug); setShowMenu(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                    >
                      <Copy className="w-4 h-4" />
                      Dupliquer
                    </button>
                    {site.status === 'published' && (
                      <Link
                        to={`/site/${site.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir le site
                      </Link>
                    )}
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      {showDeleteConfirm ? 'Confirmer' : 'Supprimer'}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(site.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATE SITE MODAL
// ═══════════════════════════════════════════════════════════════════════════

function CreateSiteModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 500)) // Simulate
    onCreate(name.trim())
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Nouveau site</h2>
              <p className="text-sm text-gray-500">Créez votre site en quelques secondes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nom du site</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Ex: Mon Super Site"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-medium transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Créer
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const { getAllSites, getSiteCount, createSite, duplicateSite, deleteSite, initializeSites } = useSitesStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    initializeSites()
  }, [initializeSites])

  const sites = getAllSites()
  const siteCount = getSiteCount()

  // Filter sites
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handlers
  const handleCreate = (name) => {
    const newSite = createSite(name)
    toast.success('Site créé !', `${name} est prêt à être édité`)
    navigate(`/editor/${newSite.slug}`)
  }

  const handleDuplicate = (slug) => {
    const newSite = duplicateSite(slug)
    if (newSite) {
      toast.success('Site dupliqué !', `${newSite.name} a été créé`)
    }
  }

  const handleDelete = (slug) => {
    const success = deleteSite(slug)
    if (success) {
      toast.success('Site supprimé', 'Le site a été supprimé avec succès')
    } else {
      toast.error('Erreur', 'Impossible de supprimer le dernier site')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Universal Editor</h1>
                <p className="text-sm text-gray-500">Créez des sites web avec l'IA</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Nouveau site
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-2xl font-bold text-white">{siteCount}</p>
              <p className="text-xs text-gray-500">{siteCount === 1 ? 'Site' : 'Sites'}</p>
            </div>
          </div>

          {siteCount >= 3 && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un site..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition"
              />
            </div>
          )}
        </div>

        {/* Sites Grid */}
        {filteredSites.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSites.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>

            {/* Add Site Card */}
            <motion.button
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="min-h-[280px] flex flex-col items-center justify-center gap-3 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl hover:border-green-500/50 hover:bg-gray-800 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-700 group-hover:bg-green-500/20 rounded-2xl flex items-center justify-center transition">
                <Plus className="w-7 h-7 text-gray-500 group-hover:text-green-400 transition" />
              </div>
              <span className="text-gray-500 group-hover:text-green-400 font-medium transition">
                Créer un nouveau site
              </span>
            </motion.button>
          </motion.div>
        ) : (
          // Empty state
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'Aucun site trouvé' : 'Créez votre premier site'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Essayez avec d\'autres termes de recherche'
                : 'Lancez-vous et créez un site professionnel en quelques minutes avec l\'aide de l\'IA'
              }
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/20"
              >
                <Sparkles className="w-5 h-5" />
                Créer mon premier site
              </motion.button>
            )}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateSiteModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
