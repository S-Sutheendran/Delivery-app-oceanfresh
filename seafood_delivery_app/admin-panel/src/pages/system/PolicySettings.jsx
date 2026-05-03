import { useState } from 'react'
import { Save, FileText, ShieldCheck, XCircle, Truck, RefreshCcw } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const TABS = [
  { key: 'terms',    label: 'Terms & Conditions', icon: FileText    },
  { key: 'privacy',  label: 'Privacy Policy',     icon: ShieldCheck },
  { key: 'cancel',   label: 'Cancellation',       icon: XCircle     },
  { key: 'delivery', label: 'Delivery',            icon: Truck       },
  { key: 'returns',  label: 'Returns',             icon: RefreshCcw  },
]

const DEFAULT_TC = `1. Acceptance of Terms
By placing an order through OceanFresh, you agree to these Terms and Conditions.

2. Product Quality
All seafood products are sourced fresh and delivered within the guaranteed time window. We do not guarantee availability of all products at all times.

3. Ordering
Orders are confirmed only after payment is successfully processed. OceanFresh reserves the right to cancel orders due to unavailability or pricing errors.

4. Delivery
Delivery timelines are estimates. Delays due to weather, traffic, or other unforeseen events are not grounds for cancellation post-dispatch.

5. Payments
All prices are inclusive of applicable taxes. We accept UPI, credit/debit cards, and cash on delivery.

6. Modifications
OceanFresh reserves the right to modify these terms at any time. Continued use of the app constitutes acceptance.`

const DEFAULT_PRIVACY = `1. Information We Collect
We collect your name, phone number, email address, delivery address, and order history to provide our services.

2. How We Use Your Information
Your data is used to process orders, communicate delivery updates, and improve our services. We do not sell your data to third parties.

3. Data Storage
All personal data is stored on secure servers with industry-standard encryption. Payment details are processed by our payment gateway partners and are not stored on our servers.

4. Cookies
We use cookies to improve your browsing experience and analyse app usage. You can disable cookies in your device settings.

5. Third-Party Services
We may share order data with delivery partners and payment gateways solely to fulfil your order.

6. Your Rights
You may request deletion of your account and associated data by contacting us at privacy@oceanfresh.in.

7. Updates
This policy was last updated on January 1, 2024. We will notify users of significant changes via the app.`

const today = new Date().toISOString().slice(0, 10)

const INIT_DOCS = {
  terms: {
    content: DEFAULT_TC,
    version: 'v2.1',
    updated: '2024-01-01',
    status: 'published',
  },
  privacy: {
    content: DEFAULT_PRIVACY,
    version: 'v1.8',
    updated: '2024-01-01',
    status: 'published',
  },
}

const INIT_CANCEL  = { window: '10', fee: '0', refund: 'Full refund within 24 hours' }
const INIT_DELIVERY= { maxAttempts: '2', undelivered: 'Return to hub' }
const INIT_RETURNS = { window: '2', reasons: 'Wrong item delivered\nDamaged packaging\nExpired product\nQuality not as expected' }

function DocEditor({ doc, onChange, onSave, saved }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant={doc.status === 'published' ? 'success' : 'warning'}>{doc.status}</Badge>
        <span className="text-xs text-gray-500 dark:text-gray-400">Version {doc.version}</span>
        <span className="text-xs text-gray-400">Last updated: {doc.updated}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Version</label>
          <input
            className="input"
            value={doc.version}
            onChange={e => onChange('version', e.target.value)}
            placeholder="v1.0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
          <select className="input" value={doc.status} onChange={e => onChange('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Content</label>
        <textarea
          className="input resize-none font-mono text-xs leading-relaxed"
          style={{ minHeight: '340px' }}
          value={doc.content}
          onChange={e => onChange('content', e.target.value)}
          spellCheck={false}
        />
        <p className="text-xs text-gray-400 mt-1">{doc.content.length} characters</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={onSave} className="btn-primary gap-2">
          <Save size={14} />
          {saved ? '✓ Saved!' : 'Save & Publish'}
        </button>
        {doc.status === 'published' && (
          <button
            type="button"
            onClick={() => onChange('status', 'draft')}
            className="btn-secondary gap-1.5 text-xs"
          >
            Revert to Draft
          </button>
        )}
      </div>
    </div>
  )
}

export default function PolicySettings() {
  const [activeTab, setActiveTab] = useState('terms')
  const [docs, setDocs]           = useState(INIT_DOCS)
  const [cancel, setCancel]       = useState(INIT_CANCEL)
  const [delivery, setDelivery]   = useState(INIT_DELIVERY)
  const [returns, setReturns]     = useState(INIT_RETURNS)

  const [saved, setSaved] = useState({})
  const markSaved = key => {
    setSaved(s => ({ ...s, [key]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000)
  }

  const updateDoc = (key, field, value) => {
    setDocs(ds => ({
      ...ds,
      [key]: { ...ds[key], [field]: value },
    }))
  }

  const saveDoc = key => {
    setDocs(ds => ({ ...ds, [key]: { ...ds[key], updated: today } }))
    markSaved(key)
  }

  return (
    <div>
      <PageHeader title="Policy Settings" subtitle="Manage app policies, legal documents and cancellation rules" />

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">

        {/* Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Terms & Conditions</h3>
            </div>
            <DocEditor
              doc={docs.terms}
              onChange={(field, value) => updateDoc('terms', field, value)}
              onSave={() => saveDoc('terms')}
              saved={saved.terms}
            />
          </div>
        )}

        {/* Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Privacy Policy</h3>
            </div>
            <DocEditor
              doc={docs.privacy}
              onChange={(field, value) => updateDoc('privacy', field, value)}
              onSave={() => saveDoc('privacy')}
              saved={saved.privacy}
            />
          </div>
        )}

        {/* Cancellation Policy */}
        {activeTab === 'cancel' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={16} className="text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Order Cancellation</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Cancellation Window (minutes after placing)</label>
                  <input className="input" value={cancel.window} onChange={e => setCancel(c => ({ ...c, window: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Cancellation Fee (%)</label>
                  <input className="input" value={cancel.fee} onChange={e => setCancel(c => ({ ...c, fee: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Refund Policy</label>
                  <select className="input" value={cancel.refund} onChange={e => setCancel(c => ({ ...c, refund: e.target.value }))}>
                    <option>Full refund within 24 hours</option>
                    <option>Refund within 3–5 business days</option>
                    <option>Store credit only</option>
                    <option>No refund</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => markSaved('cancel')} className="btn-primary gap-2">
              <Save size={15} />{saved.cancel ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Delivery Policy */}
        {activeTab === 'delivery' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={16} className="text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Delivery Policy</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Max Delivery Attempts</label>
                  <input className="input" value={delivery.maxAttempts} onChange={e => setDelivery(d => ({ ...d, maxAttempts: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Undelivered Order Action</label>
                  <select className="input" value={delivery.undelivered} onChange={e => setDelivery(d => ({ ...d, undelivered: e.target.value }))}>
                    <option>Return to hub</option>
                    <option>Cancel order</option>
                    <option>Contact customer</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => markSaved('delivery')} className="btn-primary gap-2">
              <Save size={15} />{saved.delivery ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Returns Policy */}
        {activeTab === 'returns' && (
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCcw size={16} className="text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Returns & Replacements</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Return Window (hours)</label>
                  <input className="input" value={returns.window} onChange={e => setReturns(r => ({ ...r, window: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Accepted Return Reasons</label>
                  <textarea
                    className="input h-28 resize-none"
                    value={returns.reasons}
                    onChange={e => setReturns(r => ({ ...r, reasons: e.target.value }))}
                  />
                  <p className="text-xs text-gray-400 mt-1">One reason per line</p>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => markSaved('returns')} className="btn-primary gap-2">
              <Save size={15} />{saved.returns ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
