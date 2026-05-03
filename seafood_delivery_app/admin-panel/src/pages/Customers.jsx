import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, ExternalLink, Ban, X } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'

const INIT_CUSTOMERS = [
  { id: 'C001', name: 'Rahul Sharma',  phone: '+91 98765 43210', email: 'rahul@email.com',   orders: 24, spent: '₹12,450', joined: 'Jan 2023', status: 'active'   },
  { id: 'C002', name: 'Priya Patel',   phone: '+91 87654 32109', email: 'priya@email.com',   orders: 18, spent: '₹9,200',  joined: 'Mar 2023', status: 'active'   },
  { id: 'C003', name: 'Amit Kumar',    phone: '+91 76543 21098', email: 'amit@email.com',    orders: 32, spent: '₹18,700', joined: 'Nov 2022', status: 'active'   },
  { id: 'C004', name: 'Sneha Reddy',   phone: '+91 65432 10987', email: 'sneha@email.com',   orders: 5,  spent: '₹2,100',  joined: 'Dec 2023', status: 'active'   },
  { id: 'C005', name: 'Vikas Gupta',   phone: '+91 54321 09876', email: 'vikas@email.com',   orders: 2,  spent: '₹850',    joined: 'Jan 2024', status: 'inactive' },
  { id: 'C006', name: 'Neha Singh',    phone: '+91 43210 98765', email: 'neha@email.com',    orders: 47, spent: '₹28,300', joined: 'Aug 2022', status: 'active'   },
  { id: 'C007', name: 'Rohit Mehra',   phone: '+91 32109 87654', email: 'rohit@email.com',   orders: 11, spent: '₹6,400',  joined: 'Jun 2023', status: 'blocked'  },
  { id: 'C008', name: 'Anjali Desai',  phone: '+91 21098 76543', email: 'anjali@email.com',  orders: 8,  spent: '₹4,200',  joined: 'Sep 2023', status: 'active'   },
]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function AddCustomerModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const valid = form.name.trim() && form.phone.trim() && form.email.trim()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Add New Customer</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Register a new customer account</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input className="input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
            <input className="input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Customers() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState(INIT_CUSTOMERS)
  const [search,    setSearch]    = useState('')
  const [showAdd,   setShowAdd]   = useState(false)

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = { active: 'success', inactive: 'gray', blocked: 'error' }

  const toggleBlock = (id) => {
    setCustomers(cs => cs.map(c =>
      c.id === id ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' } : c
    ))
  }

  const handleAdd = (form) => {
    const now = new Date()
    setCustomers(cs => [...cs, {
      id: `C${String(Date.now()).slice(-3)}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      orders: 0,
      spent: '₹0',
      joined: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
      status: 'active',
    }])
    setShowAdd(false)
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <UserPlus size={14} /> Add Customer
          </button>
        }
      />

      <div className="card p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Customer', 'Phone', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/customers/${c.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold flex items-center justify-center shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.email}</td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{c.spent}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.joined}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/customers/${c.id}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink size={12} />
                        View
                      </button>
                      <button
                        onClick={() => toggleBlock(c.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.status === 'blocked'
                            ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        title={c.status === 'blocked' ? 'Unblock customer' : 'Block customer'}
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

      {showAdd && <AddCustomerModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
