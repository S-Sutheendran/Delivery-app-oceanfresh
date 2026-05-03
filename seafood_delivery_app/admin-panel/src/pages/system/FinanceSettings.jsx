import { useState } from 'react'
import { Save, Plus, ChevronDown, ChevronUp, Trash2, Eye, EyeOff, X, CreditCard, Smartphone, Wallet } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const GATEWAY_PRESETS = [
  { key: 'razorpay',   label: 'Razorpay',    icon: '💳', color: '#3395FF', fields: ['Key ID', 'Key Secret', 'Webhook Secret'] },
  { key: 'paytm',      label: 'Paytm',       icon: '💙', color: '#00BAF2', fields: ['Merchant ID', 'Merchant Key', 'Website Name'] },
  { key: 'phonepe',    label: 'PhonePe',      icon: '💜', color: '#5F259F', fields: ['Merchant ID', 'Salt Key', 'Salt Index'] },
  { key: 'googlepay',  label: 'Google Pay',   icon: '🟦', color: '#4285F4', fields: ['Merchant ID', 'API Key'] },
  { key: 'stripe',     label: 'Stripe',       icon: '🔵', color: '#635BFF', fields: ['Publishable Key', 'Secret Key', 'Webhook Secret'] },
  { key: 'cashfree',   label: 'Cashfree',     icon: '🟢', color: '#00A651', fields: ['App ID', 'Secret Key'] },
  { key: 'upi',        label: 'UPI (Generic)',icon: '🔶', color: '#FF6B00', fields: ['VPA / UPI ID'] },
  { key: 'cod',        label: 'Cash on Delivery', icon: '💵', color: '#22C55E', fields: [] },
]

const INIT_GATEWAYS = [
  { id: 1, key: 'razorpay',  label: 'Razorpay',   icon: '💳', color: '#3395FF', enabled: true,  isDefault: true,  fields: { 'Key ID': 'rzp_live_••••••••••••', 'Key Secret': '', 'Webhook Secret': '' } },
  { id: 2, key: 'paytm',     label: 'Paytm',      icon: '💙', color: '#00BAF2', enabled: true,  isDefault: false, fields: { 'Merchant ID': 'OCEAN12345', 'Merchant Key': '', 'Website Name': 'WEBPROD' } },
  { id: 3, key: 'phonepe',   label: 'PhonePe',    icon: '💜', color: '#5F259F', enabled: false, isDefault: false, fields: { 'Merchant ID': '', 'Salt Key': '', 'Salt Index': '1' } },
  { id: 4, key: 'googlepay', label: 'Google Pay', icon: '🟦', color: '#4285F4', enabled: false, isDefault: false, fields: { 'Merchant ID': '', 'API Key': '' } },
  { id: 5, key: 'cod',       label: 'Cash on Delivery', icon: '💵', color: '#22C55E', enabled: true, isDefault: false, fields: {} },
]

function SecretInput({ value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        className="input pr-9"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter value…"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

function GatewayCard({ gw, onToggle, onSetDefault, onDelete, onFieldChange }) {
  const [expanded, setExpanded] = useState(false)
  const hasFields = Object.keys(gw.fields).length > 0

  return (
    <div className={`card overflow-hidden border-2 transition-colors ${gw.enabled ? 'border-transparent' : 'border-gray-100 dark:border-gray-700/50 opacity-60'}`}>
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="text-2xl shrink-0">{gw.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{gw.label}</p>
            {gw.isDefault && <Badge variant="success">Default</Badge>}
            <Badge variant={gw.enabled ? 'brand' : 'gray'}>{gw.enabled ? 'Enabled' : 'Disabled'}</Badge>
          </div>
          {gw.isDefault && <p className="text-xs text-gray-400 mt-0.5">Primary payment method shown to customers</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!gw.isDefault && gw.enabled && (
            <button
              type="button"
              onClick={() => onSetDefault(gw.id)}
              className="text-xs px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 transition-colors font-medium"
            >
              Set Default
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggle(gw.id)}
            className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${gw.enabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${gw.enabled ? 'left-5' : 'left-0.5'}`} />
          </button>
          {hasFields && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(gw.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && hasFields && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-800/60">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">API Configuration</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(gw.fields).map(([fieldName, fieldValue]) => (
              <div key={fieldName}>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{fieldName}</label>
                <SecretInput value={fieldValue} onChange={val => onFieldChange(gw.id, fieldName, val)} />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Keys are stored securely and never exposed in client-side code.
          </p>
        </div>
      )}
    </div>
  )
}

function AddGatewayModal({ existing, onAdd, onClose }) {
  const [selected, setSelected] = useState(null)
  const available = GATEWAY_PRESETS.filter(p => !existing.includes(p.key))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Add Payment Gateway</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select a gateway to configure</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {available.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">All available gateways have been added.</p>
          )}
          {available.map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelected(p.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                selected === p.key
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{p.label}</p>
                <p className="text-xs text-gray-400">{p.fields.length > 0 ? `${p.fields.length} credentials required` : 'No credentials needed'}</p>
              </div>
              {selected === p.key && (
                <span className="w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            type="button"
            onClick={() => selected && onAdd(GATEWAY_PRESETS.find(p => p.key === selected))}
            disabled={!selected}
            className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Add Gateway
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FinanceSettings() {
  const [gateways, setGateways] = useState(INIT_GATEWAYS)
  const [showAdd,  setShowAdd]  = useState(false)
  const [saved,    setSaved]    = useState(false)

  const [tax,    setTax]    = useState({ gstRate: '5', gstNumber: '27AAAAA0000A1Z5' })
  const [payout, setPayout] = useState({ perDelivery: '100', cycle: 'Bi-weekly', minThreshold: '500', commission: '15' })

  const toggle     = id => setGateways(gs => gs.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g))
  const setDefault = id => setGateways(gs => gs.map(g => ({ ...g, isDefault: g.id === id })))
  const deleteGw   = id => setGateways(gs => gs.filter(g => g.id !== id))
  const fieldChange = (id, field, val) => setGateways(gs => gs.map(g => g.id === id ? { ...g, fields: { ...g.fields, [field]: val } } : g))

  const handleAdd = preset => {
    const fields = {}
    preset.fields.forEach(f => { fields[f] = '' })
    setGateways(gs => [...gs, {
      id: Date.now(),
      key: preset.key,
      label: preset.label,
      icon: preset.icon,
      color: preset.color,
      enabled: false,
      isDefault: false,
      fields,
    }])
    setShowAdd(false)
  }

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <PageHeader title="Finance Settings" subtitle="Configure payment gateways, tax, and driver payout" />
      <div className="max-w-2xl space-y-6">

        {/* Payment Gateways */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Gateways</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{gateways.filter(g => g.enabled).length} enabled · expand a gateway to configure API keys</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="btn-secondary text-xs gap-1.5"
            >
              <Plus size={13} /> Add Gateway
            </button>
          </div>
          <div className="space-y-3">
            {gateways.map(gw => (
              <GatewayCard
                key={gw.id}
                gw={gw}
                onToggle={toggle}
                onSetDefault={setDefault}
                onDelete={deleteGw}
                onFieldChange={fieldChange}
              />
            ))}
          </div>
        </div>

        {/* Tax */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tax Configuration</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">GST Rate (%)</label>
              <input className="input" value={tax.gstRate} onChange={e => setTax(t => ({ ...t, gstRate: e.target.value }))} />
            </div>
            <div>
              <label className="label">GST Number</label>
              <input className="input" value={tax.gstNumber} onChange={e => setTax(t => ({ ...t, gstNumber: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Driver Payout */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={16} className="text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Driver Payout</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Per Delivery (₹)</label>
              <input className="input" value={payout.perDelivery} onChange={e => setPayout(p => ({ ...p, perDelivery: e.target.value }))} />
            </div>
            <div>
              <label className="label">Payout Cycle</label>
              <select className="input" value={payout.cycle} onChange={e => setPayout(p => ({ ...p, cycle: e.target.value }))}>
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="label">Min Payout Threshold (₹)</label>
              <input className="input" value={payout.minThreshold} onChange={e => setPayout(p => ({ ...p, minThreshold: e.target.value }))} />
            </div>
            <div>
              <label className="label">Platform Commission (%)</label>
              <input className="input" value={payout.commission} onChange={e => setPayout(p => ({ ...p, commission: e.target.value }))} />
            </div>
          </div>
        </div>

        <button type="button" onClick={save} className="btn-primary gap-2">
          <Save size={15} />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {showAdd && (
        <AddGatewayModal
          existing={gateways.map(g => g.key)}
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
