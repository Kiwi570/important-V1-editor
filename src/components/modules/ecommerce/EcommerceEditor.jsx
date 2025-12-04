import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useEditorContext } from '../../../pages/Editor'
import * as LucideIcons from 'lucide-react'
import {
  Type, ShoppingBag, Grid, Settings, Palette, Tag, Package, Truck,
  Plus, Search, Filter, Eye
} from 'lucide-react'

// Import des composants partagés
import {
  PRESET_COLORS,
  MODULE_ICONS,
  BADGE_PRESETS,
  CollapsibleSection,
  TextField,
  TextareaField,
  ToggleField,
  SelectField,
  NumberField,
  IconPicker,
  ColorPickerInline,
  ImageUploader,
  BadgeSelector,
  PriceEditor,
  ItemCard,
  AddItemButton,
  EmptyState
} from '../shared'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES E-COMMERCE
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_ICONS = [
  'Grid', 'Sparkles', 'TrendingUp', 'Percent', 'Star', 'Heart', 'Gift',
  'Package', 'ShoppingBag', 'Tag', 'Award', 'Zap', 'Coffee', 'Shirt'
]

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'low_stock', label: 'Stock faible' },
  { value: 'out_of_stock', label: 'Rupture' },
  { value: 'preorder', label: 'Précommande' }
]

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT EDITOR - Éditeur individuel de produit
// ═══════════════════════════════════════════════════════════════════════════

function ProductEditor({ product, categories, onUpdate, onDelete, onDuplicate }) {
  const handleChange = (field, value) => {
    onUpdate({ ...product, [field]: value })
  }

  const handlePriceChange = ({ price, originalPrice, priceLabel }) => {
    onUpdate({ 
      ...product, 
      price, 
      originalPrice,
      priceLabel 
    })
  }

  const handleBadgeChange = (badge) => {
    onUpdate({
      ...product,
      badge: badge?.label || null,
      badgeColor: badge?.color || null
    })
  }

  // Subtitle avec stock et catégorie
  const subtitle = [
    product.priceLabel || `${product.price || 0} €`,
    product.stock !== undefined ? `Stock: ${product.stock}` : null,
    categories?.find(c => c.id === product.category)?.name
  ].filter(Boolean).join(' • ')

  return (
    <ItemCard
      id={product.id}
      image={product.image}
      icon={product.image ? null : 'Package'}
      iconColor={PRESET_COLORS[0]}
      title={product.name || 'Nouveau produit'}
      subtitle={subtitle}
      badge={product.badge ? { label: product.badge, color: product.badgeColor || '#8b5cf6' } : null}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    >
      {/* Row 1: Image */}
      <ImageUploader
        label="Image du produit"
        value={product.image}
        onChange={(v) => handleChange('image', v)}
        aspectRatio="1/1"
        placeholder="Glissez une image ou ajoutez une URL"
      />

      {/* Row 2: Name */}
      <TextField
        label="Nom du produit"
        value={product.name}
        onChange={(v) => handleChange('name', v)}
        placeholder="Ex: T-Shirt Premium"
      />

      {/* Row 3: Description */}
      <TextareaField
        label="Description"
        value={product.description}
        onChange={(v) => handleChange('description', v)}
        placeholder="Décrivez ce produit..."
        rows={2}
      />

      {/* Row 4: Price */}
      <PriceEditor
        price={product.price || 0}
        originalPrice={product.originalPrice}
        priceLabel={product.priceLabel}
        onChange={handlePriceChange}
      />

      {/* Row 5: Category & Stock */}
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Catégorie"
          value={product.category || ''}
          onChange={(v) => handleChange('category', v)}
          options={[
            { value: '', label: 'Aucune' },
            ...(categories || []).map(c => ({ value: c.id, label: c.name }))
          ]}
        />
        <NumberField
          label="Stock"
          value={product.stock}
          onChange={(v) => handleChange('stock', v)}
          min={0}
          suffix="unités"
        />
      </div>

      {/* Row 6: Badge */}
      <BadgeSelector
        value={product.badge ? { type: 'custom', label: product.badge, color: product.badgeColor } : null}
        onChange={handleBadgeChange}
      />

      {/* Row 7: Rating (optionnel) */}
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Note (0-5)"
          value={product.rating}
          onChange={(v) => handleChange('rating', Math.min(5, Math.max(0, v)))}
          min={0}
          max={5}
          step={0.5}
          suffix="★"
        />
        <NumberField
          label="Nb d'avis"
          value={product.reviewCount}
          onChange={(v) => handleChange('reviewCount', v)}
          min={0}
        />
      </div>
    </ItemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS LIST
// ═══════════════════════════════════════════════════════════════════════════

function ProductsList({ products, categories, onChange }) {
  const handleUpdate = (index, updatedProduct) => {
    const newProducts = [...products]
    newProducts[index] = updatedProduct
    onChange(newProducts)
  }

  const handleDelete = (index) => {
    onChange(products.filter((_, i) => i !== index))
  }

  const handleDuplicate = (index) => {
    const duplicate = { ...products[index], id: `p${Date.now()}` }
    const newProducts = [...products]
    newProducts.splice(index + 1, 0, duplicate)
    onChange(newProducts)
  }

  const handleAdd = () => {
    const newProduct = {
      id: `p${Date.now()}`,
      name: 'Nouveau produit',
      description: 'Description du produit',
      price: 29.99,
      originalPrice: null,
      priceLabel: '29,99 €',
      image: null,
      category: categories?.[0]?.id || '',
      stock: 10,
      rating: 5,
      reviewCount: 0,
      badge: null,
      badgeColor: null
    }
    onChange([...products, newProduct])
  }

  const handleReorder = (newOrder) => {
    onChange(newOrder)
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={Package}
        title="Aucun produit"
        description="Ajoutez votre premier produit"
        action={handleAdd}
        actionLabel="Ajouter un produit"
      />
    )
  }

  return (
    <div className="space-y-2">
      <Reorder.Group axis="y" values={products} onReorder={handleReorder} className="space-y-2">
        {products.map((product, index) => (
          <Reorder.Item key={product.id} value={product}>
            <ProductEditor
              product={product}
              categories={categories}
              onUpdate={(p) => handleUpdate(index, p)}
              onDelete={() => handleDelete(index)}
              onDuplicate={() => handleDuplicate(index)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      <AddItemButton onClick={handleAdd} label="Ajouter un produit" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY EDITOR
// ═══════════════════════════════════════════════════════════════════════════

function CategoryEditor({ category, onUpdate, onDelete }) {
  const handleChange = (field, value) => {
    onUpdate({ ...category, [field]: value })
  }

  return (
    <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
      <select
        value={category.icon || 'Grid'}
        onChange={(e) => handleChange('icon', e.target.value)}
        className="px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs w-24"
      >
        {CATEGORY_ICONS.map(icon => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </select>
      <input
        type="text"
        value={category.name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="flex-1 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs"
        placeholder="Nom de la catégorie"
      />
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
      >
        <LucideIcons.Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function CategoriesList({ categories, onChange }) {
  const handleUpdate = (index, updatedCategory) => {
    const newCategories = [...categories]
    newCategories[index] = updatedCategory
    onChange(newCategories)
  }

  const handleDelete = (index) => {
    onChange(categories.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    onChange([
      ...categories, 
      { id: `cat${Date.now()}`, name: 'Nouvelle catégorie', icon: 'Tag' }
    ])
  }

  return (
    <div className="space-y-2">
      {categories?.map((category, index) => (
        <CategoryEditor
          key={category.id}
          category={category}
          onUpdate={(c) => handleUpdate(index, c)}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <AddItemButton onClick={handleAdd} label="Ajouter une catégorie" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ECOMMERCE MODULE EDITOR
// ═══════════════════════════════════════════════════════════════════════════

export default function EcommerceModuleEditor() {
  const { draftContent, updateField } = useEditorContext()
  const data = draftContent?.ecommerce || {}
  const styles = data.styles || {}

  const handleUpdate = (field, value) => {
    updateField('ecommerce', field, value)
  }

  const handleStyleUpdate = (field, value) => {
    updateField('ecommerce', 'styles', { ...styles, [field]: value })
  }

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HEADER / TEXTES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="En-tête" icon={Type} badge="Textes">
        <TextField
          label="Titre principal"
          value={data.title}
          onChange={(v) => handleUpdate('title', v)}
          placeholder="Notre Boutique"
        />
        <TextareaField
          label="Sous-titre"
          value={data.subtitle}
          onChange={(v) => handleUpdate('subtitle', v)}
          placeholder="Découvrez notre sélection de produits"
          rows={2}
        />
        <TextField
          label="Badge (optionnel)"
          value={data.badge}
          onChange={(v) => handleUpdate('badge', v)}
          placeholder="🛍️ Livraison offerte dès 50€"
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* CATÉGORIES */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Catégories" icon={Grid} badge={`${data.categories?.length || 0}`}>
        <CategoriesList
          categories={data.categories || []}
          onChange={(v) => handleUpdate('categories', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PRODUITS */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Produits" icon={ShoppingBag} badge={`${data.products?.length || 0}`}>
        <ProductsList
          products={data.products || []}
          categories={data.categories || []}
          onChange={(v) => handleUpdate('products', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* OPTIONS D'AFFICHAGE */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Options d'affichage" icon={Eye} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Colonnes"
            value={data.columns || 3}
            onChange={(v) => handleUpdate('columns', parseInt(v))}
            options={[
              { value: 2, label: '2 colonnes' },
              { value: 3, label: '3 colonnes' },
              { value: 4, label: '4 colonnes' }
            ]}
          />
          <SelectField
            label="Style des cartes"
            value={data.cardStyle || 'default'}
            onChange={(v) => handleUpdate('cardStyle', v)}
            options={[
              { value: 'default', label: 'Standard' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'bordered', label: 'Bordé' },
              { value: 'elevated', label: 'Élevé' }
            ]}
          />
        </div>
        <ToggleField
          label="Afficher les prix"
          value={data.showPrices !== false}
          onChange={(v) => handleUpdate('showPrices', v)}
        />
        <ToggleField
          label="Afficher le stock"
          description="Indicateur de disponibilité"
          value={data.showStock !== false}
          onChange={(v) => handleUpdate('showStock', v)}
        />
        <ToggleField
          label="Afficher les notes"
          description="Étoiles et nombre d'avis"
          value={data.showRatings !== false}
          onChange={(v) => handleUpdate('showRatings', v)}
        />
        <ToggleField
          label="Afficher les filtres"
          description="Filtres par catégorie"
          value={data.showFilters !== false}
          onChange={(v) => handleUpdate('showFilters', v)}
        />
        <ToggleField
          label="Afficher la recherche"
          value={data.showSearch !== false}
          onChange={(v) => handleUpdate('showSearch', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PANIER */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Panier" icon={LucideIcons.ShoppingCart} defaultOpen={false}>
        <TextField
          label="Texte du bouton"
          value={data.cartButtonText}
          onChange={(v) => handleUpdate('cartButtonText', v)}
          placeholder="Ajouter au panier"
        />
        <TextField
          label="Message panier vide"
          value={data.emptyCartMessage}
          onChange={(v) => handleUpdate('emptyCartMessage', v)}
          placeholder="Votre panier est vide"
        />
        <ToggleField
          label="Panier flottant"
          description="Mini panier visible en permanence"
          value={data.showFloatingCart !== false}
          onChange={(v) => handleUpdate('showFloatingCart', v)}
        />
        <ToggleField
          label="Quick view"
          description="Aperçu rapide au clic"
          value={data.enableQuickView !== false}
          onChange={(v) => handleUpdate('enableQuickView', v)}
        />
      </CollapsibleSection>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* DESIGN */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection title="Design" icon={Palette} defaultOpen={false}>
        <ColorPickerInline
          label="Couleur de fond"
          value={styles.background?.color}
          onChange={(v) => handleStyleUpdate('background', { ...styles.background, color: v })}
        />
        <ColorPickerInline
          label="Couleur des cartes"
          value={styles.cardBg}
          onChange={(v) => handleStyleUpdate('cardBg', v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Rayon des cartes"
            value={styles.cardRadius || 16}
            onChange={(v) => handleStyleUpdate('cardRadius', parseInt(v))}
            options={[
              { value: 0, label: 'Carré' },
              { value: 8, label: 'Petit' },
              { value: 12, label: 'Moyen' },
              { value: 16, label: 'Large' },
              { value: 24, label: 'Extra' }
            ]}
          />
          <SelectField
            label="Ombre"
            value={styles.cardShadow || 'md'}
            onChange={(v) => handleStyleUpdate('cardShadow', v)}
            options={[
              { value: 'none', label: 'Aucune' },
              { value: 'sm', label: 'Légère' },
              { value: 'md', label: 'Moyenne' },
              { value: 'lg', label: 'Prononcée' }
            ]}
          />
        </div>
        <ToggleField
          label="Effet au survol"
          description="Animation des cartes"
          value={styles.cardHoverEffect !== false}
          onChange={(v) => handleStyleUpdate('cardHoverEffect', v)}
        />
      </CollapsibleSection>
    </div>
  )
}
