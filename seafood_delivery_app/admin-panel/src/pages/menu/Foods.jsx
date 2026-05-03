import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Star, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const CATEGORIES = ['Fish', 'Shellfish', 'Cephalopod', 'Dried & Smoked']

const INIT_FOODS = [
  { id: 1, name: 'Tiger Prawns (500g)',  category: 'Shellfish',  price: 499, stock: 45, rating: 4.8, status: 'active',   bestseller: true  },
  { id: 2, name: 'Salmon Fillet (300g)', category: 'Fish',       price: 650, stock: 22, rating: 4.7, status: 'active',   bestseller: false },
  { id: 3, name: 'Pomfret Fresh (1kg)',  category: 'Fish',       price: 399, stock: 18, rating: 4.6, status: 'active',   bestseller: true  },
  { id: 4, name: 'Crab Whole (800g)',    category: 'Shellfish',  price: 550, stock: 8,  rating: 4.9, status: 'active',   bestseller: false },
  { id: 5, name: 'Squids (500g)',        category: 'Cephalopod', price: 249, stock: 0,  rating: 4.4, status: 'inactive', bestseller: false },
  { id: 6, name: 'Mackerel (1kg)',       category: 'Fish',       price: 179, stock: 62, rating: 4.3, status: 'active',   bestseller: false },
  { id: 7, name: 'Lobster (600g)',       category: 'Shellfish',  price: 899, stock: 12, rating: 4.9, status: 'active',   bestseller: true  },
]

const EMPTY_FORM = { name: '', category: 'Fish', price: '', stock: '', bestseller: false }

function FoodModal({ food, onSave, onClose }) {
  const [form, setForm] = useState(food
    ? { name: food.name, category: food.category, price: String(food.price), stock: String(food.stock), bestseller: food.bestseller }
    : EMPTY_FORM
  )
  const isEdit = !!food
  const valid = form.name.trim() && form.price && !isNaN(Number(form.price)) && form.stock !== '' && !isNaN(Number(form.stock))
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${food.name}` : 'Add a new seafood product'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
            <input className="input" placeholder="e.g. Tiger Prawns (500g)" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Price (₹)</label>
              <input className="input" type="number" min="0" placeholder="499" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stock (units)</label>
              <input className="input" type="number" min="0" placeholder="50" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${form.bestseller ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'}`} onClick={() => set('bestseller', !form.bestseller)}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.bestseller ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Best Seller</span>
          </label>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid} className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ food, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Product</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{food.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure? This will remove the product from the menu.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function Foods() {
  const [search,     setSearch]     = useState('')
  const [items,      setItems]      = useState(INIT_FOODS)
  const [editFood,   setEditFood]   = useState(null)
  const [deleteFood, setDeleteFood] = useState(null)
  const [showAdd,    setShowAdd]    = useState(false)

  const toggle   = id => setItems(fs => fs.map(f => f.id === id ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } : f))
  const filtered = items.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = form => {
    setItems(fs => [...fs, {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      bestseller: form.bestseller,
      rating: 0,
      status: 'active',
    }])
    setShowAdd(false)
  }

  const handleEdit = form => {
    setItems(fs => fs.map(f => f.id === editFood.id
      ? { ...f, name: form.name.trim(), category: form.category, price: Number(form.price), stock: Number(form.stock), bestseller: form.bestseller }
      : f
    ))
    setEditFood(null)
  }

  const handleDelete = () => {
    setItems(fs => fs.filter(f => f.id !== deleteFood.id))
    setDeleteFood(null)
  }

  return (
    <div>
      <PageHeader
        title="Foods"
        subtitle={`${items.length} products`}
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Product</button>}
      />

      <div className="card p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Badges', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{f.name}</td>
                  <td className="px-4 py-3"><Badge variant="gray">{f.category}</Badge></td>
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">₹{f.price}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${f.stock === 0 ? 'text-red-500' : f.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                      {f.stock === 0 ? 'Out of stock' : f.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-medium"><Star size={11} fill="currentColor" />{f.rating}</span>
                  </td>
                  <td className="px-4 py-3">
                    {f.bestseller && <Badge variant="orange">Best Seller</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(f.id)} className={f.status === 'active' ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}>
                      {f.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditFood(f)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteFood(f)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd    && <FoodModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editFood   && <FoodModal food={editFood} onSave={handleEdit} onClose={() => setEditFood(null)} />}
      {deleteFood && <DeleteConfirm food={deleteFood} onConfirm={handleDelete} onClose={() => setDeleteFood(null)} />}
    </div>
  )
}
