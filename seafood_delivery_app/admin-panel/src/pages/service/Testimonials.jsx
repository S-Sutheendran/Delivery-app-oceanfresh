import { useState } from 'react'
import { Plus, Star, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_TESTIMONIALS = [
  { id: 1, name: 'Rahul S.',   rating: 5, text: 'Freshest seafood I have ever ordered online! Delivery was super fast.', featured: true,  approved: true  },
  { id: 2, name: 'Priya P.',   rating: 5, text: 'The tiger prawns were absolutely divine. Will order again!',           featured: true,  approved: true  },
  { id: 3, name: 'Amit K.',    rating: 4, text: 'Great quality fish. Packaging was excellent, no leakage.',              featured: false, approved: true  },
  { id: 4, name: 'Sneha R.',   rating: 5, text: 'OceanFresh is my go-to for seafood. Consistent quality every time.',   featured: false, approved: true  },
  { id: 5, name: 'Vikas G.',   rating: 3, text: 'Good quality but delivery was a bit late.',                            featured: false, approved: false },
]

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={24}
            className={s <= value ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}
            fill={s <= value ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      <span className="ml-1.5 text-sm text-gray-500 dark:text-gray-400">{value}/5</span>
    </div>
  )
}

function AddTestimonialModal({ onSave, onClose }) {
  const [name,   setName]   = useState('')
  const [rating, setRating] = useState(5)
  const [text,   setText]   = useState('')

  const valid = name.trim().length > 0 && text.trim().length > 0

  const handleSave = () => {
    if (!valid) return
    onSave({ name: name.trim(), rating, text: text.trim() })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Add Testimonial</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manually add a customer testimonial</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Customer Name</label>
            <input
              className="input"
              placeholder="e.g. Rahul S."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Review Text</label>
            <textarea
              className="input resize-none h-28"
              placeholder="Customer's review in their own words…"
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/300</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Add Testimonial
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [items,   setItems]   = useState(INIT_TESTIMONIALS)
  const [showAdd, setShowAdd] = useState(false)

  const toggleFeatured = id => setItems(ts => ts.map(t => t.id === id ? { ...t, featured: !t.featured } : t))
  const toggleApproved = id => setItems(ts => ts.map(t => t.id === id ? { ...t, approved: !t.approved } : t))
  const remove         = id => setItems(ts => ts.filter(t => t.id !== id))

  const handleAdd = ({ name, rating, text }) => {
    setItems(ts => [...ts, { id: Date.now(), name, rating, text, featured: false, approved: false }])
    setShowAdd(false)
  }

  return (
    <div>
      <PageHeader
        title="Customer Testimonials"
        subtitle={`${items.filter(t => t.featured).length} featured · ${items.filter(t => !t.approved).length} pending approval`}
        action={
          <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Testimonial
          </button>
        }
      />

      <div className="space-y-4">
        {items.map(t => (
          <div key={t.id} className={`card p-5 ${!t.approved ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{t.name}</p>
                    {t.featured && <Badge variant="brand">Featured</Badge>}
                    <Badge variant={t.approved ? 'success' : 'warning'}>
                      {t.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex mt-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={12}
                        className={s <= t.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}
                        fill={s <= t.rating ? 'currentColor' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleFeatured(t.id)}
                  title="Toggle featured"
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                    t.featured
                      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.featured ? '★ Featured' : '☆ Feature'}
                </button>
                <button type="button" onClick={() => toggleApproved(t.id)} className={t.approved ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}>
                  {t.approved ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic">"{t.text}"</p>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddTestimonialModal
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
