import { useState, useRef } from 'react'
import { Plus, Eye, Download, CheckCircle, XCircle, X, Upload, FileText, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_DOCS = [
  { id: 1, title: 'Terms & Conditions',    type: 'Legal',  version: 'v2.1', updated: '2024-01-01', status: 'published', fileName: 'terms_v2.1.pdf',        content: null },
  { id: 2, title: 'Privacy Policy',         type: 'Legal',  version: 'v1.8', updated: '2024-01-01', status: 'published', fileName: 'privacy_v1.8.pdf',       content: null },
  { id: 3, title: 'Driver Agreement',       type: 'Driver', version: 'v3.0', updated: '2023-12-15', status: 'published', fileName: 'driver_agreement_v3.pdf', content: null },
  { id: 4, title: 'Refund Policy',          type: 'Legal',  version: 'v1.2', updated: '2023-11-20', status: 'published', fileName: 'refund_v1.2.pdf',         content: null },
  { id: 5, title: 'Food Safety Guidelines', type: 'Ops',    version: 'v1.0', updated: '2023-10-10', status: 'draft',     fileName: 'food_safety_v1.pdf',      content: null },
]

const typeVariant = { Legal: 'info', Driver: 'brand', Ops: 'warning' }
const DOC_TYPES   = ['Legal', 'Driver', 'Ops']
const EMPTY_FORM  = { title: '', type: 'Legal', version: '', status: 'draft', fileName: '', content: null }

function UploadModal({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const valid = form.title.trim() && form.version.trim() && form.fileName
  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => set('content', e.target.result)
    reader.readAsDataURL(file)
    set('fileName', file.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Upload Document</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add a new legal or operational document</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* File drop area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">File</label>
            {form.fileName ? (
              <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-xl">
                <FileText size={18} className="text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-sm text-brand-700 dark:text-brand-300 font-medium flex-1 truncate">{form.fileName}</span>
                <button onClick={() => { set('fileName', ''); set('content', null) }} className="p-1 text-brand-400 hover:text-red-500 transition-colors"><X size={14} /></button>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <Upload size={20} className="text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Drop file here or click to upload</p>
                <p className="text-xs text-gray-400">PDF, DOC, DOCX supported</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Document Title</label>
            <input className="input" placeholder="e.g. Terms & Conditions" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Version</label>
              <input className="input" placeholder="v1.0" value={form.version} onChange={e => set('version', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  )
}

function ViewModal({ doc, onPublish, onUnpublish, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Document Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{doc.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={typeVariant[doc.type]}>{doc.type}</Badge>
                <Badge variant={doc.status === 'published' ? 'success' : 'warning'}>{doc.status}</Badge>
              </div>
            </div>
          </div>
          {[
            { label: 'File Name', value: doc.fileName },
            { label: 'Version',   value: doc.version  },
            { label: 'Updated',   value: doc.updated  },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20">{label}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          {doc.status === 'draft'
            ? <button onClick={onPublish} className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Publish</button>
            : <button onClick={onUnpublish} className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5"><XCircle size={14} /> Unpublish</button>
          }
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function Documents() {
  const [docs,    setDocs]    = useState(INIT_DOCS)
  const [showAdd, setShowAdd] = useState(false)
  const [viewDoc, setViewDoc] = useState(null)

  const today = new Date().toISOString().slice(0, 10)

  const handleUpload = form => {
    setDocs(ds => [...ds, {
      id: Date.now(),
      title: form.title.trim(),
      type: form.type,
      version: form.version.trim(),
      updated: today,
      status: form.status,
      fileName: form.fileName,
      content: form.content,
    }])
    setShowAdd(false)
  }

  const handleDownload = (doc) => {
    if (doc.content) {
      const a = document.createElement('a')
      a.href = doc.content
      a.download = doc.fileName
      a.click()
    } else {
      alert(`No file attached — "${doc.fileName}" would be downloaded in production.`)
    }
  }

  const setStatus = (id, status) => {
    setDocs(ds => ds.map(d => d.id === id ? { ...d, status, updated: today } : d))
    setViewDoc(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const remove = id => { setDocs(ds => ds.filter(d => d.id !== id)); setViewDoc(null) }

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Manage legal and operational documents"
        action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Upload Document</button>}
      />

      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {docs.map(d => (
            <div key={d.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{d.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={typeVariant[d.type]}>{d.type}</Badge>
                    <span className="text-xs text-gray-400">{d.version} · Updated {d.updated}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={d.status === 'published' ? 'success' : 'warning'}>{d.status}</Badge>
                <button
                  onClick={() => setViewDoc(d)}
                  title="View details"
                  className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => handleDownload(d)}
                  title="Download"
                  className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => remove(d.id)}
                  title="Delete"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && <UploadModal onSave={handleUpload} onClose={() => setShowAdd(false)} />}
      {viewDoc  && (
        <ViewModal
          doc={viewDoc}
          onClose={() => setViewDoc(null)}
          onPublish={() => setStatus(viewDoc.id, 'published')}
          onUnpublish={() => setStatus(viewDoc.id, 'draft')}
        />
      )}
    </div>
  )
}
