import { useState } from 'react'
import { Search, Plus, Star, Eye, Ban, X, Phone, MapPin, Truck, CheckCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_DRIVERS = [
  { id: 'D001', name: 'Suresh Kumar',  phone: '+91 99887 76655', vehicle: 'Bike',   zone: 'Bandra',   status: 'approved',  online: true,  orders: 312, rating: 4.8 },
  { id: 'D002', name: 'Kiran Mehta',   phone: '+91 88776 65544', vehicle: 'Scooter',zone: 'Andheri',  status: 'approved',  online: true,  orders: 248, rating: 4.6 },
  { id: 'D003', name: 'Raj Thakur',    phone: '+91 77665 54433', vehicle: 'Bike',   zone: 'Bandra',   status: 'approved',  online: false, orders: 190, rating: 4.9 },
  { id: 'D004', name: 'Mohan Verma',   phone: '+91 66554 43322', vehicle: 'Scooter',zone: 'Malad',    status: 'approved',  online: true,  orders: 421, rating: 4.7 },
  { id: 'D005', name: 'Arjun Nair',    phone: '+91 55443 32211', vehicle: 'Bike',   zone: 'Dadar',    status: 'approved',  online: false, orders: 134, rating: 4.5 },
  { id: 'D006', name: 'Santosh Yadav', phone: '+91 44332 21100', vehicle: 'Van',    zone: 'Thane',    status: 'suspended', online: false, orders: 67,  rating: 3.9 },
]

const ZONES = ['Bandra', 'Andheri', 'Dadar', 'Malad', 'Thane', 'Borivali']
const VEHICLES = ['Bike', 'Scooter', 'Van']
const EMPTY_FORM = { name: '', phone: '', vehicle: 'Bike', zone: 'Bandra' }

function DriverModal({ driver, onSave, onClose }) {
  const [form, setForm] = useState(driver ? { name: driver.name, phone: driver.phone, vehicle: driver.vehicle, zone: driver.zone } : EMPTY_FORM)
  const isEdit = !!driver
  const valid = form.name.trim() && form.phone.trim()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Driver' : 'Add New Driver'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${driver.name}` : 'Register a new delivery driver'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input className="input" placeholder="e.g. Suresh Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
            <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Vehicle</label>
              <select className="input" value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
                {VEHICLES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Zone</label>
              <select className="input" value={form.zone} onChange={e => set('zone', e.target.value)}>
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid} className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            {isEdit ? 'Save Changes' : 'Add Driver'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DriverDetailModal({ driver, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Driver Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-lg">
              {driver.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{driver.name}</p>
              <Badge variant={driver.status === 'approved' ? 'success' : 'error'}>{driver.status}</Badge>
            </div>
          </div>
          {[
            { icon: Phone,       label: 'Phone',   value: driver.phone    },
            { icon: Truck,       label: 'Vehicle', value: driver.vehicle  },
            { icon: MapPin,      label: 'Zone',    value: driver.zone     },
            { icon: CheckCircle, label: 'Orders',  value: `${driver.orders} completed` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-14">{label}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <Star size={14} className="text-amber-500 shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 w-14">Rating</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
              <Star size={12} fill="currentColor" />{driver.rating}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${driver.online ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 w-14">Status</span>
            <span className={`text-sm font-medium ${driver.online ? 'text-green-600' : 'text-gray-400'}`}>
              {driver.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="btn-secondary w-full justify-center">Close</button>
        </div>
      </div>
    </div>
  )
}

function BanConfirmModal({ driver, onConfirm, onClose }) {
  const isSuspended = driver.status === 'suspended'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSuspended ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <Ban size={18} className={isSuspended ? 'text-green-600' : 'text-red-600'} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isSuspended ? 'Reinstate Driver' : 'Suspend Driver'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{driver.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSuspended
            ? `Reinstate ${driver.name}? They will be able to receive deliveries again.`
            : `Suspend ${driver.name}? They will not be able to receive new orders.`}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2 text-white font-semibold rounded-lg transition-colors text-sm ${isSuspended ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
            {isSuspended ? 'Reinstate' : 'Suspend'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryPerson() {
  const [search,    setSearch]    = useState('')
  const [drivers,   setDrivers]   = useState(INIT_DRIVERS)
  const [viewDriver, setViewDriver] = useState(null)
  const [banDriver,  setBanDriver]  = useState(null)
  const [editDriver, setEditDriver] = useState(null)
  const [showAdd,    setShowAdd]    = useState(false)

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search)
  )

  const handleAdd = form => {
    setDrivers(ds => [...ds, {
      id: `D${String(Date.now()).slice(-3)}`,
      name: form.name.trim(), phone: form.phone.trim(),
      vehicle: form.vehicle, zone: form.zone,
      status: 'approved', online: false, orders: 0, rating: 0,
    }])
    setShowAdd(false)
  }

  const handleEdit = form => {
    setDrivers(ds => ds.map(d => d.id === editDriver.id ? { ...d, ...form } : d))
    setEditDriver(null)
  }

  const handleBanToggle = () => {
    setDrivers(ds => ds.map(d =>
      d.id === banDriver.id ? { ...d, status: d.status === 'suspended' ? 'approved' : 'suspended' } : d
    ))
    setBanDriver(null)
  }

  return (
    <div>
      <PageHeader
        title="Delivery Person"
        subtitle={`${drivers.filter(d => d.online).length} online now · ${drivers.length} total`}
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Driver</button>}
      />

      <div className="card p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Driver', 'Phone', 'Vehicle', 'Zone', 'Orders', 'Rating', 'Status', 'Online', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {d.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{d.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.vehicle}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.zone}</td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{d.orders}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                      <Star size={12} fill="currentColor" />{d.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={d.status === 'approved' ? 'success' : 'error'}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${d.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewDriver(d)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setBanDriver(d)}
                        className={`p-1.5 rounded-lg transition-colors ${d.status === 'suspended' ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                        title={d.status === 'suspended' ? 'Reinstate driver' : 'Suspend driver'}
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd    && <DriverModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editDriver && <DriverModal driver={editDriver} onSave={handleEdit} onClose={() => setEditDriver(null)} />}
      {viewDriver && <DriverDetailModal driver={viewDriver} onClose={() => setViewDriver(null)} />}
      {banDriver  && <BanConfirmModal driver={banDriver} onConfirm={handleBanToggle} onClose={() => setBanDriver(null)} />}
    </div>
  )
}
