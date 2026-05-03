import { useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT = [
  { id: 1, reason: 'Ordered by mistake',          type: 'customer', active: true  },
  { id: 2, reason: 'Delivery taking too long',    type: 'customer', active: true  },
  { id: 3, reason: 'Found better price elsewhere',type: 'customer', active: true  },
  { id: 4, reason: 'Item out of stock',           type: 'admin',    active: true  },
  { id: 5, reason: 'Customer unreachable',        type: 'driver',   active: true  },
  { id: 6, reason: 'Wrong address provided',      type: 'driver',   active: true  },
  { id: 7, reason: 'Duplicate order',             type: 'admin',    active: false },
]

const typeVariant = { customer: 'info', driver: 'brand', admin: 'warning' }

export default function CancellationReasons() {
  const [items,     setItems]     = useState(INIT)
  const [newReason, setNewReason] = useState('')
  const [newType,   setNewType]   = useState('customer')
  const [editId,    setEditId]    = useState(null)
  const [editText,  setEditText]  = useState('')
  const [editType,  setEditType]  = useState('customer')

  const toggle = id => setItems(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r))
  const remove = id => setItems(rs => rs.filter(r => r.id !== id))

  const add = () => {
    if (!newReason.trim()) return
    setItems(rs => [...rs, { id: Date.now(), reason: newReason.trim(), type: newType, active: true }])
    setNewReason('')
  }

  const startEdit = (r) => { setEditId(r.id); setEditText(r.reason); setEditType(r.type) }
  const saveEdit  = () => {
    if (!editText.trim()) return
    setItems(rs => rs.map(r => r.id === editId ? { ...r, reason: editText.trim(), type: editType } : r))
    setEditId(null)
  }
  const cancelEdit = () => setEditId(null)

  return (
    <div>
      <PageHeader title="Cancellation Reasons" subtitle="Manage reasons available for order cancellation" />

      <div className="card p-5 mb-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Reason</p>
        <div className="flex gap-3 flex-wrap">
          <input className="input flex-1 min-w-48" placeholder="Enter reason..." value={newReason} onChange={e => setNewReason(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
          <select className="input w-36" value={newType} onChange={e => setNewType(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-primary" onClick={add}><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {items.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3.5 gap-3">
              {editId === r.id ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    autoFocus
                    className="input flex-1 text-sm py-1.5"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                  />
                  <select className="input w-32 text-sm py-1.5" value={editType} onChange={e => setEditType(e.target.value)}>
                    <option value="customer">Customer</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant={typeVariant[r.type]}>{r.type}</Badge>
                  <p className={`text-sm ${r.active ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 line-through'}`}>{r.reason}</p>
                </div>
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
