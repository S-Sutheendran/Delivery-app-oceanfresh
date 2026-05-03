import { useState } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_CATS = [
  { id: 1, name: 'Fish',         emoji: '🐟', description: 'Fresh and frozen fish varieties', products: 24, active: true,
    subs: [{ id: 11, name: 'Freshwater Fish', products: 8 }, { id: 12, name: 'Saltwater Fish', products: 16 }] },
  { id: 2, name: 'Shellfish',    emoji: '🦐', description: 'Prawns, crabs, lobsters and more', products: 18, active: true,
    subs: [{ id: 21, name: 'Prawns & Shrimp', products: 7 }, { id: 22, name: 'Crabs', products: 5 }, { id: 23, name: 'Lobster', products: 6 }] },
  { id: 3, name: 'Cephalopods',  emoji: '🦑', description: 'Squid, octopus and cuttlefish', products: 8, active: true,
    subs: [{ id: 31, name: 'Squid', products: 4 }, { id: 32, name: 'Octopus', products: 4 }] },
  { id: 4, name: 'Dried & Smoked', emoji: '🏺', description: 'Dried fish and smoked seafood', products: 12, active: false,
    subs: [] },
]

function CatModal({ cat, onSave, onClose }) {
  const [name,  setName]  = useState(cat?.name  ?? '')
  const [emoji, setEmoji] = useState(cat?.emoji ?? '')
  const [desc,  setDesc]  = useState(cat?.description ?? '')
  const isEdit = !!cat
  const valid = name.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Category' : 'Add Category'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${cat.name}` : 'Create a new product category'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Emoji</label>
              <input className="input text-center text-lg" placeholder="🐟" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
              <input className="input" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <input className="input" placeholder="Brief description" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => valid && onSave({ name: name.trim(), emoji, description: desc.trim() })} disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            {isEdit ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SubModal({ catName, sub, onSave, onClose }) {
  const [name, setName] = useState(sub?.name ?? '')
  const valid = name.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{sub ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Under: {catName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subcategory Name</label>
          <input className="input" placeholder="e.g. Freshwater Fish" value={name} autoFocus onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && valid && onSave(name.trim())} />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => valid && onSave(name.trim())} disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            {sub ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ title, description, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}

function CategoryRow({ cat, onEdit, onDelete, onEditSub, onDeleteSub, onAddSub, onToggle }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-left transition-colors"
      >
        <span className="text-2xl">{cat.emoji || '📦'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</p>
            <Badge variant={cat.active ? 'success' : 'gray'}>{cat.active ? 'Active' : 'Inactive'}</Badge>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{cat.description}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">{cat.products} products</span>
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <button onClick={() => onToggle(cat.id)} className={`p-1.5 rounded-lg transition-colors text-xs font-medium px-2 ${cat.active ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {cat.active ? 'Disable' : 'Enable'}
            </button>
            <button onClick={() => onEdit(cat)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
            <button onClick={() => onDelete(cat)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
          </div>
          {cat.subs.length > 0 ? (open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />) : <div className="w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {cat.subs.map(s => (
            <div key={s.id} className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{s.name}</p>
                <span className="text-xs text-gray-400">({s.products} products)</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEditSub(cat, s)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={13} /></button>
                <button onClick={() => onDeleteSub(cat, s)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/60">
            <button onClick={() => onAddSub(cat)} className="btn-secondary text-xs py-1 gap-1"><Plus size={12} /> Add Subcategory</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Categories() {
  const [cats,      setCats]      = useState(INIT_CATS)
  const [showAdd,   setShowAdd]   = useState(false)
  const [editCat,   setEditCat]   = useState(null)
  const [deleteCat, setDeleteCat] = useState(null)

  const [addSubFor,    setAddSubFor]    = useState(null)
  const [editSubData,  setEditSubData]  = useState(null)
  const [deleteSubData,setDeleteSubData]= useState(null)

  const toggleCat = id => setCats(cs => cs.map(c => c.id === id ? { ...c, active: !c.active } : c))

  const handleAddCat = form => {
    setCats(cs => [...cs, { id: Date.now(), ...form, products: 0, active: true, subs: [] }])
    setShowAdd(false)
  }

  const handleEditCat = form => {
    setCats(cs => cs.map(c => c.id === editCat.id ? { ...c, ...form } : c))
    setEditCat(null)
  }

  const handleDeleteCat = () => {
    setCats(cs => cs.filter(c => c.id !== deleteCat.id))
    setDeleteCat(null)
  }

  const handleAddSub = name => {
    setCats(cs => cs.map(c => c.id === addSubFor.id
      ? { ...c, subs: [...c.subs, { id: Date.now(), name, products: 0 }] }
      : c
    ))
    setAddSubFor(null)
  }

  const handleEditSub = name => {
    const { cat, sub } = editSubData
    setCats(cs => cs.map(c => c.id === cat.id
      ? { ...c, subs: c.subs.map(s => s.id === sub.id ? { ...s, name } : s) }
      : c
    ))
    setEditSubData(null)
  }

  const handleDeleteSub = () => {
    const { cat, sub } = deleteSubData
    setCats(cs => cs.map(c => c.id === cat.id
      ? { ...c, subs: c.subs.filter(s => s.id !== sub.id) }
      : c
    ))
    setDeleteSubData(null)
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories and subcategories"
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Category</button>}
      />
      <div className="space-y-3">
        {cats.map(c => (
          <CategoryRow
            key={c.id}
            cat={c}
            onToggle={toggleCat}
            onEdit={setEditCat}
            onDelete={setDeleteCat}
            onAddSub={setAddSubFor}
            onEditSub={(cat, sub) => setEditSubData({ cat, sub })}
            onDeleteSub={(cat, sub) => setDeleteSubData({ cat, sub })}
          />
        ))}
      </div>

      {showAdd   && <CatModal onSave={handleAddCat} onClose={() => setShowAdd(false)} />}
      {editCat   && <CatModal cat={editCat} onSave={handleEditCat} onClose={() => setEditCat(null)} />}
      {deleteCat && (
        <DeleteConfirm
          title="Delete Category"
          description={`Delete "${deleteCat.name}" and all its subcategories?`}
          onConfirm={handleDeleteCat}
          onClose={() => setDeleteCat(null)}
        />
      )}

      {addSubFor && (
        <SubModal catName={addSubFor.name} onSave={handleAddSub} onClose={() => setAddSubFor(null)} />
      )}
      {editSubData && (
        <SubModal catName={editSubData.cat.name} sub={editSubData.sub} onSave={handleEditSub} onClose={() => setEditSubData(null)} />
      )}
      {deleteSubData && (
        <DeleteConfirm
          title="Delete Subcategory"
          description={`Delete "${deleteSubData.sub.name}" from ${deleteSubData.cat.name}?`}
          onConfirm={handleDeleteSub}
          onClose={() => setDeleteSubData(null)}
        />
      )}
    </div>
  )
}
