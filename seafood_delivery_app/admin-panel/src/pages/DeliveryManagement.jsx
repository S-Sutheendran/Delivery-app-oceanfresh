import { useState } from 'react'
import { MapPin, Navigation, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'

const ACTIVE = [
  { id: 'DEL-091', orderId: '#ORD-1041', driver: 'Kiran M.',  customer: 'Priya Patel',  from: 'Bandra Hub',  to: 'Andheri West',    eta: '12 min', status: 'in_transit', lat: 19.1, lng: 72.8 },
  { id: 'DEL-090', orderId: '#ORD-1040', driver: 'Suresh K.', customer: 'Amit Kumar',   from: 'Dadar Hub',   to: 'Dadar East',      eta: '8 min',  status: 'picked_up',  lat: 19.0, lng: 72.8 },
  { id: 'DEL-089', orderId: '#ORD-1038', driver: 'Raj T.',    customer: 'Neha Singh',   from: 'Bandra Hub',  to: 'Kurla',           eta: '20 min', status: 'in_transit', lat: 19.06, lng: 72.87 },
  { id: 'DEL-088', orderId: '#ORD-1037', driver: 'Mohan V.',  customer: 'Rohit Mehra',  from: 'Malad Hub',   to: 'Malad West',      eta: '5 min',  status: 'arrived',    lat: 19.18, lng: 72.84 },
]

const statusMap = { in_transit: 'info', picked_up: 'brand', arrived: 'success', assigned: 'warning' }

export default function DeliveryManagement() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PageHeader title="Delivery Management" subtitle="Track active deliveries in real time" />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Deliveries', value: '4',  icon: Navigation,    color: 'text-brand-600' },
          { label: 'Avg ETA',           value: '11m', icon: Clock,         color: 'text-amber-600' },
          { label: 'Completed Today',   value: '39', icon: CheckCircle2,  color: 'text-green-600' },
          { label: 'Delayed',           value: '1',  icon: AlertCircle,   color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <s.icon size={20} className={s.color} />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active list */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Deliveries</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {ACTIVE.map(d => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`w-full text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${selected?.id === d.id ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{d.driver}</p>
                  <Badge variant={statusMap[d.status]}>{d.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{d.orderId} → {d.customer}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-gray-400" />
                  <p className="text-xs text-gray-400">{d.from} → {d.to}</p>
                </div>
                <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1">ETA: {d.eta}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="card overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {selected ? `Tracking: ${selected.driver}` : 'Live Map'}
            </h3>
          </div>
          <div className="flex-1 min-h-64 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/10 dark:to-blue-900/10 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
              <MapPin size={28} className="text-brand-600 dark:text-brand-400" />
            </div>
            {selected ? (
              <div className="text-center px-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selected.driver}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selected.from} → {selected.to}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">ETA {selected.eta} · {selected.status.replace('_', ' ')}</p>
                <p className="text-[10px] text-gray-400 mt-3">Map integration available via Google Maps / OpenStreetMap</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">Select a delivery to track</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
