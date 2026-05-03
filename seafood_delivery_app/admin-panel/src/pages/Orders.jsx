import { useState } from 'react'
import {
  Search, Filter, RefreshCw, X, Check, AlertCircle,
  Package, Truck, CheckCircle2, Clock, XCircle, MapPin, Phone, User,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'

// ── Status flow definition ────────────────────────────────────────────────────
const STATUS_FLOW = [
  { key: 'pending',    label: 'Order Placed',     icon: Clock         },
  { key: 'confirmed',  label: 'Order Confirmed',  icon: CheckCircle2  },
  { key: 'packed',     label: 'Order Packed',     icon: Package       },
  { key: 'picked_up',  label: 'Order Picked Up',  icon: User          },
  { key: 'in_transit', label: 'In Transit',       icon: Truck         },
  { key: 'delivered',  label: 'Order Delivered',  icon: Check         },
]

// Admin-allowed transitions only
// picked_up, in_transit, delivered are triggered by the driver app — not shown here
const TRANSITIONS = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['packed',    'cancelled'],
  packed:     ['cancelled'],
  picked_up:  ['cancelled'],
  in_transit: ['cancelled'],
  delivered:  [],
  cancelled:  [],
}

const DRIVER_NEXT = {
  packed:     'Order Picked Up',
  picked_up:  'In Transit',
  in_transit: 'Order Delivered',
}

const STATUS_LABELS = {
  pending: 'Order Placed', confirmed: 'Order Confirmed', packed: 'Order Packed',
  picked_up: 'Order Picked Up', in_transit: 'In Transit', delivered: 'Order Delivered',
  cancelled: 'Cancelled',
}

// ── Cancellation reasons ──────────────────────────────────────────────────────
const CANCEL_REASONS = [
  'Item out of stock',
  'Customer not available at delivery address',
  'Address not found / incorrect',
  'Customer requested cancellation',
  'Payment failed / not received',
  'Order placed by mistake',
  'Long delivery time',
  'Duplicate order',
  'Other',
]

// ── Mock order data ───────────────────────────────────────────────────────────
const INIT_ORDERS = [
  {
    id: '#ORD-1042', customer: 'Rahul Sharma', phone: '+91 98765 43210',
    address: '14B Sea View Apt, Bandra West, Mumbai 400050',
    items: [
      { name: 'Tiger Prawns (500g)', qty: 2, price: '₹500' },
      { name: 'Pomfret Fresh (1kg)', qty: 1, price: '₹149' },
    ],
    total: '₹649', status: 'delivered', driver: 'Suresh K.', driverPhone: '+91 90123 45678',
    date: '2024-01-15 14:32', zone: 'Bandra', paymentMethod: 'UPI', deliveryTime: '28 min',
    notes: 'Please ring bell twice.', cancelReason: null,
  },
  {
    id: '#ORD-1041', customer: 'Priya Patel', phone: '+91 87654 32109',
    address: '5 Ocean Villa, Andheri East, Mumbai 400069',
    items: [
      { name: 'Salmon Fillet (300g)', qty: 2, price: '₹820' },
    ],
    total: '₹820', status: 'in_transit', driver: 'Kiran M.', driverPhone: '+91 89012 34567',
    date: '2024-01-15 14:10', zone: 'Andheri', paymentMethod: 'Card', deliveryTime: 'Ongoing',
    notes: '', cancelReason: null,
  },
  {
    id: '#ORD-1040', customer: 'Amit Kumar', phone: '+91 76543 21098',
    address: '22 Gandhi Nagar, Dadar West, Mumbai 400028',
    items: [
      { name: 'Tiger Prawns (500g)', qty: 1, price: '₹250' },
      { name: 'Crab Whole (800g)',   qty: 2, price: '₹490' },
      { name: 'Squids (500g)',       qty: 1, price: '₹200' },
      { name: 'Hilsa Fish (1kg)',    qty: 1, price: '₹400' },
    ],
    total: '₹1,340', status: 'confirmed', driver: 'Pending', driverPhone: '—',
    date: '2024-01-15 13:55', zone: 'Dadar', paymentMethod: 'COD', deliveryTime: '—',
    notes: 'Leave at door if not available.', cancelReason: null,
  },
  {
    id: '#ORD-1039', customer: 'Sneha Reddy', phone: '+91 65432 10987',
    address: '8 LBS Marg, Kurla West, Mumbai 400070',
    items: [
      { name: 'Pomfret Fresh (1kg)', qty: 1, price: '₹299' },
    ],
    total: '₹299', status: 'delivered', driver: 'Raj T.', driverPhone: '+91 78901 23456',
    date: '2024-01-15 13:20', zone: 'Kurla', paymentMethod: 'UPI', deliveryTime: '22 min',
    notes: '', cancelReason: null,
  },
  {
    id: '#ORD-1038', customer: 'Vikas Gupta', phone: '+91 54321 09876',
    address: '31 SV Road, Borivali West, Mumbai 400092',
    items: [
      { name: 'Tiger Prawns (500g)',  qty: 2, price: '₹500' },
      { name: 'Salmon Fillet (300g)', qty: 1, price: '₹410' },
      { name: 'Clams (500g)',         qty: 1, price: '₹65'  },
    ],
    total: '₹975', status: 'cancelled', driver: '—', driverPhone: '—',
    date: '2024-01-15 12:45', zone: 'Borivali', paymentMethod: 'UPI', deliveryTime: '—',
    notes: '', cancelReason: 'Customer requested cancellation',
  },
  {
    id: '#ORD-1037', customer: 'Neha Singh', phone: '+91 43210 98765',
    address: '7 Turner Rd, Bandra East, Mumbai 400051',
    items: [
      { name: 'Squids (500g)', qty: 1, price: '₹200' },
      { name: 'Clams (500g)',  qty: 2, price: '₹130' },
    ],
    total: '₹560', status: 'delivered', driver: 'Suresh K.', driverPhone: '+91 90123 45678',
    date: '2024-01-15 12:10', zone: 'Bandra', paymentMethod: 'Card', deliveryTime: '38 min',
    notes: '', cancelReason: null,
  },
  {
    id: '#ORD-1036', customer: 'Rohit Mehra', phone: '+91 32109 87654',
    address: '15 Malad Link Rd, Malad West, Mumbai 400064',
    items: [
      { name: 'Salmon Fillet (300g)', qty: 3, price: '₹1,230' },
      { name: 'Tiger Prawns (500g)', qty: 2,  price: '₹500'   },
      { name: 'Hilsa Fish (1kg)',    qty: 1,  price: '₹370'   },
    ],
    total: '₹2,100', status: 'delivered', driver: 'Raj T.', driverPhone: '+91 78901 23456',
    date: '2024-01-15 11:30', zone: 'Malad', paymentMethod: 'UPI', deliveryTime: '52 min',
    notes: 'Fragile – handle with care.', cancelReason: null,
  },
  {
    id: '#ORD-1035', customer: 'Anjali Desai', phone: '+91 21098 76543',
    address: '3 Vartak Nagar, Thane West, Mumbai 400606',
    items: [
      { name: 'Pomfret Fresh (1kg)', qty: 1, price: '₹450' },
    ],
    total: '₹450', status: 'pending', driver: 'Pending', driverPhone: '—',
    date: '2024-01-15 11:05', zone: 'Thane', paymentMethod: 'COD', deliveryTime: '—',
    notes: '', cancelReason: null,
  },
]

const STATUS_MAP    = { delivered: 'success', in_transit: 'info', confirmed: 'brand', cancelled: 'error', pending: 'warning', packed: 'info', picked_up: 'info' }
const FILTER_OPTIONS = ['All', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled']

// ── Status flow stepper ──────────────────────────────────────────────────────
function StatusFlow({ currentStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
          <XCircle size={16} className="text-red-500 shrink-0" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">Order Cancelled</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">This order cannot be modified.</p>
      </div>
    )
  }

  const currentIdx  = STATUS_FLOW.findIndex(s => s.key === currentStatus)
  // When fully delivered, all steps are "done" — show green tick on every step
  const allCompleted = currentStatus === 'delivered'

  return (
    <div className="relative py-2">
      {/* Connector line */}
      <div className="absolute top-6 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
      {/* Filled progress line */}
      <div
        className="absolute top-6 left-5 h-0.5 bg-green-400 z-0 transition-all"
        style={{ width: allCompleted ? 'calc(100% - 40px)' : `calc((100% - 40px) * ${currentIdx} / 5)` }}
      />

      <div className="flex items-start justify-between relative z-10">
        {STATUS_FLOW.map((step, i) => {
          const isDone    = allCompleted || i < currentIdx
          const isCurrent = !allCompleted && i === currentIdx

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1 min-w-0 px-0.5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                isDone
                  ? 'bg-green-500 border-green-500 text-white'
                  : isCurrent
                  ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200 dark:shadow-brand-900/30 scale-110'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'
              }`}>
                {isDone ? <Check size={18} strokeWidth={2.5} /> : <step.icon size={16} />}
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight max-w-[62px] ${
                isDone    ? 'text-green-600 dark:text-green-400'
                : isCurrent ? 'text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Cancellation reason picker ────────────────────────────────────────────────
function CancellationReasonModal({ onConfirm, onBack }) {
  const [selected, setSelected]   = useState('')
  const [otherText, setOtherText] = useState('')

  const finalReason = selected === 'Other' ? otherText.trim() : selected
  const canConfirm  = selected && (selected !== 'Other' || otherText.trim().length > 0)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <XCircle size={16} className="text-red-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Cancellation Reason</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Please select a reason for cancelling this order.</p>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
          {CANCEL_REASONS.map(r => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all flex items-center gap-3 ${
                selected === r
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/40'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                selected === r ? 'border-red-400 bg-red-400' : 'border-gray-300 dark:border-gray-500'
              }`}>
                {selected === r && <Check size={9} className="text-white" strokeWidth={3} />}
              </span>
              {r}
            </button>
          ))}

          {selected === 'Other' && (
            <textarea
              autoFocus
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              placeholder="Please describe the cancellation reason in detail…"
              className="input resize-none h-24 mt-1"
              maxLength={200}
            />
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button onClick={onBack} className="btn-secondary flex-1">
            ← Back
          </button>
          <button
            onClick={() => canConfirm && onConfirm(finalReason)}
            disabled={!canConfirm}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Order detail + status change modal ───────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }) {
  const [newStatus,         setNewStatus]         = useState('')
  const [showReasonPicker,  setShowReasonPicker]  = useState(false)
  const allowed = TRANSITIONS[order.status] ?? []

  const handleConfirmClick = () => {
    if (newStatus === 'cancelled') {
      setShowReasonPicker(true)
    } else {
      onStatusChange(order.id, newStatus, null)
      onClose()
    }
  }

  const handleCancelWithReason = (reason) => {
    onStatusChange(order.id, 'cancelled', reason)
    setShowReasonPicker(false)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '92vh' }}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-mono">{order.id}</h3>
                <Badge variant={STATUS_MAP[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                <span className="text-xs text-gray-400">{order.paymentMethod}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.date} · Zone: {order.zone}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-5">

            {/* ── Cancellation reason banner (for cancelled orders) ── */}
            {order.status === 'cancelled' && order.cancelReason && (
              <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-0.5">Cancellation Reason</p>
                  <p className="text-sm text-red-600 dark:text-red-300">{order.cancelReason}</p>
                </div>
              </div>
            )}

            {/* ── Status flow ── */}
            <div className="card p-5">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Order Progress</p>
              <StatusFlow currentStatus={order.status} />
            </div>

            {/* ── Driver-controlled next step notice ── */}
            {DRIVER_NEXT[order.status] && (
              <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <Truck size={14} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Next step <strong>{DRIVER_NEXT[order.status]}</strong> will be updated automatically by the driver app.
                </p>
              </div>
            )}

            {/* ── Change status ── */}
            {allowed.length > 0 && (
              <div className="card p-5">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                  Change Status
                  {order.status === 'confirmed' && (
                    <span className="ml-2 text-[10px] text-brand-500 normal-case font-medium">— Mark as packed once order is prepared</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allowed.map(s => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(prev => prev === s ? '' : s)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        newStatus === s
                          ? s === 'cancelled'
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-brand-600 border-brand-600 text-white'
                          : s === 'cancelled'
                          ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-400 bg-white dark:bg-gray-700'
                      }`}
                    >
                      {s === 'cancelled' && <XCircle size={14} />}
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>

                {newStatus && (
                  <div className={`flex items-center gap-3 mt-4 pt-4 border-t ${
                    newStatus === 'cancelled'
                      ? 'border-red-100 dark:border-red-800'
                      : 'border-gray-100 dark:border-gray-700'
                  }`}>
                    <AlertCircle size={14} className={`shrink-0 ${newStatus === 'cancelled' ? 'text-red-500' : 'text-brand-500'}`} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex-1">
                      Changing:{' '}
                      <strong className="text-gray-700 dark:text-gray-300">{STATUS_LABELS[order.status]}</strong>
                      {' → '}
                      <strong className={newStatus === 'cancelled' ? 'text-red-600 dark:text-red-400' : 'text-brand-600 dark:text-brand-400'}>
                        {STATUS_LABELS[newStatus]}
                      </strong>
                      {newStatus === 'cancelled' && '. You will be asked to select a reason.'}
                    </p>
                    <button
                      onClick={handleConfirmClick}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0 transition-colors ${
                        newStatus === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-600 hover:bg-brand-700'
                      }`}
                    >
                      {newStatus === 'cancelled' ? 'Next →' : 'Confirm'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Customer + Driver info ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Customer</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{order.address}</span>
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Delivery Partner</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Truck size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{order.driver}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.driverPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Delivery time: <strong className="text-gray-700 dark:text-gray-300">{order.deliveryTime}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Order items ── */}
            <div className="card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Order Items</p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0">
                        {item.qty}×
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.price}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Order Total</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">{order.total}</span>
                </div>
              </div>
            </div>

            {/* ── Customer note ── */}
            {order.notes && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertCircle size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Customer Note:</strong> {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancellation reason modal (layered on top) ── */}
      {showReasonPicker && (
        <CancellationReasonModal
          onConfirm={handleCancelWithReason}
          onBack={() => setShowReasonPicker(false)}
        />
      )}
    </>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Orders() {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [orders,   setOrders]   = useState(INIT_ORDERS)
  const [selected, setSelected] = useState(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    const matchStatus = filter === 'All' || o.status === filter
    return matchSearch && matchStatus
  })

  const handleStatusChange = (id, newStatus, reason) => {
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status: newStatus, cancelReason: reason ?? o.cancelReason } : o
    ))
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
        action={<button className="btn-secondary"><RefreshCw size={14} /> Refresh</button>}
      />

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Search by order ID or customer name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-400 shrink-0" />
            {FILTER_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s === 'All' ? 'All' : STATUS_LABELS[s] ?? s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Order ID', 'Customer', 'Items', 'Total', 'Zone', 'Driver', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-brand-600 dark:text-brand-400">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{o.items.length}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{o.total}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{o.zone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{o.driver}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[o.status]}>{STATUS_LABELS[o.status]}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(o)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        TRANSITIONS[o.status]?.length > 0
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {TRANSITIONS[o.status]?.length > 0 && (
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                      )}
                      {TRANSITIONS[o.status]?.length > 0 ? 'Actions' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No orders found.</div>
          )}
        </div>
      </div>

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
