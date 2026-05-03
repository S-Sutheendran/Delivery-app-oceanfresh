import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Download, X, Phone, Truck, Calendar, Package } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_PAYOUTS = [
  { id: 'PR001', driver: 'Suresh Kumar',  phone: '+91 99887 76655', amount: 4200, period: 'Jan 1–15', orders: 42, status: 'pending',  submitted: '2024-01-16', zone: 'Bandra'  },
  { id: 'PR002', driver: 'Kiran Mehta',   phone: '+91 88776 65544', amount: 3600, period: 'Jan 1–15', orders: 36, status: 'approved', submitted: '2024-01-16', zone: 'Andheri' },
  { id: 'PR003', driver: 'Raj Thakur',    phone: '+91 77665 54433', amount: 2900, period: 'Jan 1–15', orders: 29, status: 'paid',     submitted: '2024-01-15', zone: 'Bandra'  },
  { id: 'PR004', driver: 'Mohan Verma',   phone: '+91 66554 43322', amount: 5100, period: 'Jan 1–15', orders: 51, status: 'pending',  submitted: '2024-01-16', zone: 'Malad'   },
  { id: 'PR005', driver: 'Arjun Nair',    phone: '+91 55443 32211', amount: 1800, period: 'Jan 1–15', orders: 18, status: 'rejected', submitted: '2024-01-14', zone: 'Dadar'   },
]

const statusMap = { pending: 'warning', approved: 'brand', paid: 'success', rejected: 'error' }

function PayoutDetailModal({ payout, onClose, onApprove, onReject }) {
  const canAct = payout.status === 'pending'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Payout Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{payout.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-sm">
              {payout.driver.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{payout.driver}</p>
              <Badge variant={statusMap[payout.status]}>{payout.status}</Badge>
            </div>
          </div>
          {[
            { icon: Phone,    label: 'Phone',     value: payout.phone    },
            { icon: Truck,    label: 'Zone',      value: payout.zone     },
            { icon: Calendar, label: 'Period',    value: payout.period   },
            { icon: Package,  label: 'Orders',    value: `${payout.orders} deliveries` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{label}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</span>
            </div>
          ))}
          <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-center">
            <p className="text-xs text-brand-600 dark:text-brand-400 mb-1">Payout Amount</p>
            <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">₹{payout.amount.toLocaleString()}</p>
          </div>
          <p className="text-xs text-gray-400 text-center">Submitted: {payout.submitted}</p>
        </div>
        {canAct ? (
          <div className="flex gap-3 px-5 pb-5">
            <button onClick={onReject} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5">
              <XCircle size={14} /> Reject
            </button>
            <button onClick={onApprove} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5">
              <CheckCircle size={14} /> Approve
            </button>
          </div>
        ) : (
          <div className="px-5 pb-5">
            <button onClick={onClose} className="btn-secondary w-full justify-center">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

function RejectModal({ payout, onConfirm, onClose }) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Reject Payout</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rejecting {payout.driver}'s request for ₹{payout.amount.toLocaleString()}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reason (optional)</label>
          <textarea
            className="input resize-none h-20"
            placeholder="Enter reason for rejection…"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => onConfirm(reason.trim())} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PayoutRequest() {
  const [payouts,    setPayouts]   = useState(INIT_PAYOUTS)
  const [viewPayout, setViewPayout] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  const pending = payouts.filter(p => p.status === 'pending')
  const total   = pending.reduce((s, p) => s + p.amount, 0)

  const approve = (id) => {
    setPayouts(ps => ps.map(p => p.id === id ? { ...p, status: 'approved' } : p))
    setViewPayout(prev => prev?.id === id ? { ...prev, status: 'approved' } : prev)
  }

  const reject = (id, reason) => {
    setPayouts(ps => ps.map(p => p.id === id ? { ...p, status: 'rejected', rejectReason: reason } : p))
    setViewPayout(null)
    setRejectTarget(null)
  }

  return (
    <div>
      <PageHeader
        title="Payout Request"
        subtitle={`₹${total.toLocaleString()} pending approval · ${pending.length} request${pending.length !== 1 ? 's' : ''}`}
        action={<button className="btn-secondary gap-2"><Download size={14} /> Export</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Driver', 'Period', 'Orders', 'Amount', 'Status', 'Submitted', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{p.driver}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.period}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.orders}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[p.status]}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{p.submitted}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewPayout(p)}
                        title="View details"
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      {p.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approve(p.id)}
                            title="Approve payout"
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => setRejectTarget(p)}
                            title="Reject payout"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewPayout && (
        <PayoutDetailModal
          payout={viewPayout}
          onClose={() => setViewPayout(null)}
          onApprove={() => approve(viewPayout.id)}
          onReject={() => { setRejectTarget(viewPayout); setViewPayout(null) }}
        />
      )}
      {rejectTarget && (
        <RejectModal
          payout={rejectTarget}
          onConfirm={reason => reject(rejectTarget.id, reason)}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  )
}
