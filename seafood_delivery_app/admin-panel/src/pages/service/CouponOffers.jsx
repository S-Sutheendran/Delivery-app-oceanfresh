import { useState } from 'react'
import { Plus, Edit2, Trash2, Copy, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_COUPONS = [
  { id: 1, code: 'OCEAN20',   type: 'percent', value: 20,  minOrder: 500,  maxUsage: 500,  usage: 142, expiry: '2024-03-31', status: 'active'   },
  { id: 2, code: 'FRESH50',   type: 'flat',    value: 50,  minOrder: 299,  maxUsage: 200,  usage: 89,  expiry: '2024-02-28', status: 'active'   },
  { id: 3, code: 'WELCOME10', type: 'percent', value: 10,  minOrder: 200,  maxUsage: 0,    usage: 1200,expiry: '2024-12-31', status: 'active'   },
  { id: 4, code: 'PRAWNS30',  type: 'percent', value: 30,  minOrder: 700,  maxUsage: 100,  usage: 34,  expiry: '2024-01-20', status: 'expired'  },
  { id: 5, code: 'NEWUSER',   type: 'flat',    value: 100, minOrder: 400,  maxUsage: 1000, usage: 0,   expiry: '2024-06-30', status: 'inactive' },
]

const statusMap = { active: 'success', expired: 'error', inactive: 'gray' }
const EMPTY_FORM = { code: '', type: 'percent', value: '', minOrder: '', maxUsage: '', expiry: '', status: 'active' }

function CouponModal({ coupon, onSave, onClose }) {
  const isEdit = !!coupon
  const [form, setForm] = useState(coupon
    ? { code: coupon.code, type: coupon.type, value: String(coupon.value), minOrder: String(coupon.minOrder), maxUsage: String(coupon.maxUsage), expiry: coupon.expiry, status: coupon.status }
    : EMPTY_FORM
  )
  const valid = form.code.trim() && form.value && !isNaN(Number(form.value)) && form.expiry
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${coupon.code}` : 'Create a new discount coupon'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Coupon Code</label>
            <input
              className="input font-mono uppercase"
              placeholder="e.g. OCEAN20"
              value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase())}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Discount Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {form.type === 'percent' ? 'Discount %' : 'Discount ₹'}
              </label>
              <input className="input" type="number" min="1" placeholder={form.type === 'percent' ? '20' : '50'} value={form.value} onChange={e => set('value', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Min Order (₹)</label>
              <input className="input" type="number" min="0" placeholder="500" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Max Usage (0 = unlimited)</label>
              <input className="input" type="number" min="0" placeholder="0" value={form.maxUsage} onChange={e => set('maxUsage', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Expiry Date</label>
              <input className="input" type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ coupon, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Coupon</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Delete coupon <code className="bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded font-mono">{coupon.code}</code>? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function CouponOffers() {
  const [coupons,      setCoupons]     = useState(INIT_COUPONS)
  const [copied,       setCopied]      = useState(null)
  const [editCoupon,   setEditCoupon]  = useState(null)
  const [deleteCoupon, setDeleteCoupon]= useState(null)
  const [showAdd,      setShowAdd]     = useState(false)

  const copy = (code) => {
    navigator.clipboard?.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  const handleAdd = form => {
    setCoupons(cs => [...cs, {
      id: Date.now(),
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxUsage: Number(form.maxUsage) || 0,
      usage: 0,
      expiry: form.expiry,
      status: form.status,
    }])
    setShowAdd(false)
  }

  const handleEdit = form => {
    setCoupons(cs => cs.map(c => c.id === editCoupon.id
      ? { ...c, code: form.code.trim(), type: form.type, value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUsage: Number(form.maxUsage) || 0, expiry: form.expiry, status: form.status }
      : c
    ))
    setEditCoupon(null)
  }

  const handleDelete = () => {
    setCoupons(cs => cs.filter(c => c.id !== deleteCoupon.id))
    setDeleteCoupon(null)
  }

  const fmtUsage = c => c.maxUsage === 0 ? `${c.usage}/∞` : `${c.usage}/${c.maxUsage}`

  return (
    <div>
      <PageHeader
        title="Coupon Offers"
        subtitle={`${coupons.filter(c => c.status === 'active').length} active coupons`}
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Create Coupon</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Code', 'Type', 'Discount', 'Min Order', 'Usage', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded text-xs font-mono font-bold">{c.code}</code>
                      <button onClick={() => copy(c.code)} className="p-1 text-gray-400 hover:text-brand-600 transition-colors">
                        <Copy size={12} />
                      </button>
                      {copied === c.code && <span className="text-xs text-green-500">Copied!</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="gray">{c.type}</Badge></td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.minOrder ? `₹${c.minOrder}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{fmtUsage(c)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.expiry}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[c.status]}>{c.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditCoupon(c)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteCoupon(c)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd      && <CouponModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editCoupon   && <CouponModal coupon={editCoupon} onSave={handleEdit} onClose={() => setEditCoupon(null)} />}
      {deleteCoupon && <DeleteConfirm coupon={deleteCoupon} onConfirm={handleDelete} onClose={() => setDeleteCoupon(null)} />}
    </div>
  )
}
