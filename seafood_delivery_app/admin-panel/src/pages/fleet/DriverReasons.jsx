import { useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const INIT = [
  { id: 1, reason: 'Vehicle breakdown',             active: true  },
  { id: 2, reason: 'Personal emergency',            active: true  },
  { id: 3, reason: 'Too far delivery location',     active: true  },
  { id: 4, reason: 'Insufficient fuel',             active: true  },
  { id: 5, reason: 'End of shift',                  active: true  },
  { id: 6, reason: 'Weather conditions',            active: false },
]

export default function DriverReasons() {
  const [items,     setItems]     = useState(INIT)
  const [newReason, setNewReason] = useState('')
  const [editId,    setEditId]    = useState(null)
  const [editText,  setEditText]  = useState('')

  const toggle = id => setItems(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r))
  const remove = id => setItems(rs => rs.filter(r => r.id !== id))

  const add = () => {
    if (!newReason.trim()) return
    setItems(rs => [...rs, { id: Date.now(), reason: newReason.trim(), active: true }])
    setNewReason('')
  }

  const startEdit = (r) => { setEditId(r.id); setEditText(r.reason) }
  const saveEdit  = () => {
    if (!editText.trim()) return
    setItems(rs => rs.map(r => r.id === editId ? { ...r, reason: editText.trim() } : r))
    setEditId(null)
  }
  const cancelEdit = () => setEditId(null)

  return (
    <div>
      <PageHeader title="Driver Reasons" subtitle="Reasons drivers can select when rejecting or cancelling an order" />

      <div className="card p-5 mb-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Reason</p>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Enter reason..."
            value={newReason}
            onChange={e => setNewReason(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button className="btn-primary" onClick={add}><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
              {editId === r.id ? (
                <input
                  autoFocus
                  className="input flex-1 text-sm py-1.5"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                />
              ) : (
                <p className={`text-sm flex-1 ${r.active ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                  {r.reason}
                </p>
              )}
              <div className="flex items-center gap-1 shrink-0">
                {editId === r.id ? (
                  <>
                    <button onClick={saveEdit} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"><Check size={14} /></button>
                    <button onClick={cancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => toggle(r.id)} className={`transition-colors ${r.active ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {r.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button onClick={() => startEdit(r)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => remove(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
