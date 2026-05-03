import { useState } from 'react'
import { Plus, MapPin, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'

const INIT_ZONES = [
  { id: 1, name: 'Bandra Zone',   area: 'Bandra West, Bandra East', drivers: 8,  orders: 124, fee: 39,  active: true  },
  { id: 2, name: 'Andheri Zone',  area: 'Andheri West, Andheri East, Jogeshwari', drivers: 12, orders: 198, fee: 49,  active: true  },
  { id: 3, name: 'Dadar Zone',    area: 'Dadar, Prabhadevi, Parel', drivers: 6,  orders: 87,  fee: 35,  active: true  },
  { id: 4, name: 'Malad Zone',    area: 'Malad, Kandivali', drivers: 5,  orders: 63,  fee: 59,  active: true  },
  { id: 5, name: 'Thane Zone',    area: 'Thane, Mulund',    drivers: 4,  orders: 41,  fee: 69,  active: false },
  { id: 6, name: 'Borivali Zone', area: 'Borivali, Dahisar', drivers: 3,  orders: 28,  fee: 65,  active: false },
]

const EMPTY_FORM = { name: '', area: '', fee: '' }

function ZoneModal({ zone, onSave, onClose }) {
  const [form, setForm] = useState(
    zone ? { name: zone.name, area: zone.area, fee: String(zone.fee) } : EMPTY_FORM
  )
  const isEdit = !!zone
  const valid = form.name.trim() && form.area.trim() && form.fee.trim() && !isNaN(Number(form.fee))

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Zone' : 'Add New Zone'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isEdit ? `Editing: ${zone.name}` : 'Create a new delivery zone'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Zone Name</label>
            <input
              className="input"
              placeholder="e.g. Bandra Zone"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Coverage Area</label>
            <input
              className="input"
              placeholder="e.g. Bandra West, Bandra East"
              value={form.area}
              onChange={e => set('area', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Delivery Fee (₹)</label>
            <input
              className="input"
              type="number"
              min="0"
              placeholder="e.g. 49"
              value={form.fee}
              onChange={e => set('fee', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {isEdit ? 'Save Changes' : 'Add Zone'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ zone, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Zone</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong className="text-gray-800 dark:text-gray-200">{zone.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ZoneManagement() {
  const [zones,       setZones]      = useState(INIT_ZONES)
  const [editZone,    setEditZone]   = useState(null)
  const [deleteZone,  setDeleteZone] = useState(null)
  const [showAdd,     setShowAdd]    = useState(false)

  const toggle = id => setZones(zs => zs.map(z => z.id === id ? { ...z, active: !z.active } : z))

  const handleAdd = form => {
    const newZone = {
      id: Date.now(),
      name: form.name.trim(),
      area: form.area.trim(),
      fee: Number(form.fee),
      drivers: 0,
      orders: 0,
      active: true,
    }
    setZones(zs => [...zs, newZone])
    setShowAdd(false)
  }

  const handleEdit = form => {
    setZones(zs => zs.map(z =>
      z.id === editZone.id
        ? { ...z, name: form.name.trim(), area: form.area.trim(), fee: Number(form.fee) }
        : z
    ))
    setEditZone(null)
  }

  const handleDelete = () => {
    setZones(zs => zs.filter(z => z.id !== deleteZone.id))
    setDeleteZone(null)
  }

  return (
    <div>
      <PageHeader
        title="Zone Management"
        subtitle={`${zones.filter(z => z.active).length} active zones`}
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Zone
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {zones.map(z => (
          <div key={z.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900/20 rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{z.name}</p>
                  <Badge variant={z.active ? 'success' : 'gray'}>{z.active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
              <button
                onClick={() => toggle(z.id)}
                className={`p-1 transition-colors ${z.active ? 'text-green-500 hover:text-green-700' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500'}`}
              >
                {z.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{z.area}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Drivers',  value: z.drivers },
                { label: 'Orders',   value: z.orders  },
                { label: 'Del. Fee', value: `₹${z.fee}` },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{s.value}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                className="btn-secondary flex-1 justify-center text-xs py-1.5"
                onClick={() => setEditZone(z)}
              >
                <Edit2 size={12} /> Edit
              </button>
              <button
                className="btn-danger flex-1 justify-center text-xs py-1.5"
                onClick={() => setDeleteZone(z)}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <ZoneModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editZone && <ZoneModal zone={editZone} onSave={handleEdit} onClose={() => setEditZone(null)} />}
      {deleteZone && <DeleteConfirm zone={deleteZone} onConfirm={handleDelete} onClose={() => setDeleteZone(null)} />}
    </div>
  )
}
