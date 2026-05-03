import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const INIT_TAGS = [
  { id: 1, name: 'Best Seller',  color: '#FF6B35', emoji: '🔥' },
  { id: 2, name: 'Top Rated',   color: '#FFC107', emoji: '⭐' },
  { id: 3, name: 'Fresh Today', color: '#00BCD4', emoji: '🌊' },
  { id: 4, name: 'Seasonal',    color: '#4CAF50', emoji: '🌿' },
  { id: 5, name: 'New Arrival', color: '#9C27B0', emoji: '✨' },
  { id: 6, name: 'Premium',     color: '#607D8B', emoji: '💎' },
]

function TagModal({ tag, onSave, onClose }) {
  const [name,  setName]  = useState(tag?.name  ?? '')
  const [emoji, setEmoji] = useState(tag?.emoji ?? '')
  const [color, setColor] = useState(tag?.color ?? '#00838F')
  const isEdit = !!tag
  const valid = name.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Tag' : 'Add New Tag'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${tag.name}` : 'Create a new product tag'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tag Name</label>
            <input className="input" placeholder="e.g. Flash Sale" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Emoji</label>
              <input className="input" placeholder="🏷" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Colour</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-0.5" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{color}</span>
              </div>
            </div>
          </div>
          {(name || emoji) && (
            <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Preview</p>
              <div className="flex items-center gap-2">
                <span className="text-lg">{emoji || '🏷'}</span>
                <span className="font-semibold text-sm" style={{ color }}>{name || 'Tag name'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => valid && onSave({ name: name.trim(), emoji, color })} disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            {isEdit ? 'Save Changes' : 'Add Tag'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ItemTags() {
  const [tags,    setTags]    = useState(INIT_TAGS)
  const [editTag, setEditTag] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const [name,  setName]  = useState('')
  const [emoji, setEmoji] = useState('')
  const [color, setColor] = useState('#00838F')

  const addInline = () => {
    if (!name.trim()) return
    setTags(ts => [...ts, { id: Date.now(), name: name.trim(), color, emoji }])
    setName(''); setEmoji(''); setColor('#00838F')
  }

  const handleEdit = form => {
    setTags(ts => ts.map(t => t.id === editTag.id ? { ...t, ...form } : t))
    setEditTag(null)
  }

  const remove = id => setTags(ts => ts.filter(t => t.id !== id))

  return (
    <div>
      <PageHeader title="Item Tags" subtitle="Tags shown as badges on product cards"
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Tag</button>}
      />

      <div className="card p-5 mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Add</p>
        <div className="flex flex-wrap gap-3">
          <input className="input flex-1 min-w-36" placeholder="Tag name (e.g. Flash Sale)" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInline()} />
          <input className="input w-24" placeholder="Emoji" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">Colour</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-0.5" />
          </div>
          <button className="btn-primary" onClick={addInline}><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map(t => (
          <div key={t.id} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: t.color + '20' }}>
              {t.emoji || '🏷'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{t.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs text-gray-400">{t.color}</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditTag(t)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => remove(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <TagModal onSave={form => { setTags(ts => [...ts, { id: Date.now(), ...form }]); setShowAdd(false) }} onClose={() => setShowAdd(false)} />}
      {editTag && <TagModal tag={editTag} onSave={handleEdit} onClose={() => setEditTag(null)} />}
    </div>
  )
}
