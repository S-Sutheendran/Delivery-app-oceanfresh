import { useState, useRef } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Image, X, Upload, Info } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_BANNERS = [
  { id: 1, title: 'Fresh Catch Today!',    subtitle: 'Up to 30% off on Fish',   target: 'home',     order: 1, active: true,  imageUrl: null },
  { id: 2, title: 'Premium Lobster',        subtitle: 'Direct from the coast',   target: 'home',     order: 2, active: true,  imageUrl: null },
  { id: 3, title: 'Free Delivery Over ₹500',subtitle: 'Order now & save',        target: 'home',     order: 3, active: true,  imageUrl: null },
  { id: 4, title: 'New Arrivals',           subtitle: 'Check seasonal specials', target: 'app',      order: 1, active: false, imageUrl: null },
]

const EMPTY_FORM = { title: '', subtitle: '', target: 'home', order: '1', imageUrl: null }

const DIMENSION_GUIDE = {
  home:     { w: 1200, h: 400,  ratio: '3:1',  note: 'Full-width home banner' },
  app:      { w: 720,  h: 320,  ratio: '9:4',  note: 'App splash / feature banner' },
  checkout: { w: 800,  h: 200,  ratio: '4:1',  note: 'Narrow checkout strip' },
}

function BannerModal({ banner, onSave, onClose }) {
  const isEdit = !!banner
  const [form, setForm] = useState(
    banner
      ? { title: banner.title, subtitle: banner.subtitle, target: banner.target, order: String(banner.order), imageUrl: banner.imageUrl }
      : EMPTY_FORM
  )
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const valid = form.title.trim() && form.order && !isNaN(Number(form.order))
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const guide = DIMENSION_GUIDE[form.target]

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => set('imageUrl', e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Banner' : 'Add Banner'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isEdit ? `Editing: ${banner.title}` : 'Create a new promotional banner'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Image upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Banner Image</label>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Info size={11} />
                <span>{guide.w}×{guide.h}px ({guide.ratio}) — {guide.note}</span>
              </div>
            </div>

            {form.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={form.imageUrl} alt="Banner preview" className="w-full object-cover" style={{ aspectRatio: `${guide.w}/${guide.h}` }} />
                <button
                  onClick={() => set('imageUrl', null)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Recommended: {guide.w}×{guide.h}px
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG, WebP supported</p>
                </div>
                <div className="mt-1 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Image size={12} />
                  Recommended: {guide.w}×{guide.h}px ({guide.ratio})
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
            <input className="input" placeholder="e.g. Fresh Catch Today!" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subtitle</label>
            <input className="input" placeholder="e.g. Up to 30% off on Fish" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Target</label>
              <select className="input" value={form.target} onChange={e => set('target', e.target.value)}>
                <option value="home">Home (1200×400)</option>
                <option value="app">App (720×320)</option>
                <option value="checkout">Checkout (800×200)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
              <input className="input" type="number" min="1" placeholder="1" value={form.order} onChange={e => set('order', e.target.value)} />
            </div>
          </div>

          {/* Dimension reference table */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info size={11} /> Image dimension guide</p>
            <div className="space-y-1.5">
              {Object.entries(DIMENSION_GUIDE).map(([target, d]) => (
                <div key={target} className={`flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 transition-colors ${form.target === target ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                  <span className="capitalize font-medium">{target}</span>
                  <span>{d.w}×{d.h}px</span>
                  <span>{d.ratio}</span>
                  <span className="text-gray-400 hidden sm:block">{d.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {isEdit ? 'Save Changes' : 'Add Banner'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Banner() {
  const [banners,    setBanners]   = useState(INIT_BANNERS)
  const [editBanner, setEditBanner] = useState(null)
  const [showAdd,    setShowAdd]   = useState(false)

  const toggle = id => setBanners(bs => bs.map(b => b.id === id ? { ...b, active: !b.active } : b))
  const remove = id => setBanners(bs => bs.filter(b => b.id !== id))

  const handleAdd = form => {
    setBanners(bs => [...bs, {
      id: Date.now(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      target: form.target,
      order: Number(form.order),
      active: true,
      imageUrl: form.imageUrl,
    }])
    setShowAdd(false)
  }

  const handleEdit = form => {
    setBanners(bs => bs.map(b => b.id === editBanner.id
      ? { ...b, title: form.title.trim(), subtitle: form.subtitle.trim(), target: form.target, order: Number(form.order), imageUrl: form.imageUrl }
      : b
    ))
    setEditBanner(null)
  }

  return (
    <div>
      <PageHeader
        title="Banner Management"
        subtitle="Manage promotional banners in the customer app"
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Banner</button>}
      />

      <div className="space-y-4">
        {banners.map(b => (
          <div key={b.id} className="card p-5 flex items-center gap-4">
            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0">
              {b.imageUrl
                ? <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Image size={22} className="text-white/70" />
                  </div>
                )
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{b.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{b.subtitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="gray">Order: {b.order}</Badge>
                <Badge variant="info">{b.target}</Badge>
                {b.imageUrl
                  ? <Badge variant="success">Image set</Badge>
                  : <Badge variant="warning">No image</Badge>
                }
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggle(b.id)} className={b.active ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}>
                {b.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
              <button onClick={() => setEditBanner(b)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"><Edit2 size={15} /></button>
              <button onClick={() => remove(b.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd    && <BannerModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editBanner && <BannerModal banner={editBanner} onSave={handleEdit} onClose={() => setEditBanner(null)} />}
    </div>
  )
}
