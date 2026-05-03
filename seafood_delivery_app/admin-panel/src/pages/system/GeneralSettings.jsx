import { useState } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

export default function GeneralSettings() {
  const [form, setForm] = useState({
    appName: 'OceanFresh', tagline: 'Fresh Seafood Delivered', supportEmail: 'support@oceanfresh.in',
    supportPhone: '+91 98765 43210', address: '12, Marine Drive, Mumbai - 400001',
    currency: 'INR', timezone: 'Asia/Kolkata', language: 'en',
    minOrderAmount: '100', maxDeliveryRadius: '15', freeDeliveryThreshold: '500', deliveryFee: '49',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const Field = ({ label, id, type = 'text', prefix }) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>}
        <input type={type} className={`input ${prefix ? 'pl-7' : ''}`} value={form[id]} onChange={set(id)} />
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="General Settings" subtitle="Basic app configuration" />
      <div className="max-w-2xl space-y-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">App Identity</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="App Name" id="appName" />
            <Field label="Tagline" id="tagline" />
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Support Email" id="supportEmail" type="email" />
            <Field label="Support Phone" id="supportPhone" />
            <div className="sm:col-span-2">
              <label className="label">Address</label>
              <textarea className="input resize-none h-20" value={form.address} onChange={set('address')} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Regional Settings</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Currency</label>
              <select className="input" value={form.currency} onChange={set('currency')}>
                <option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="label">Timezone</label>
              <select className="input" value={form.timezone} onChange={set('timezone')}>
                <option>Asia/Kolkata</option><option>Asia/Mumbai</option><option>UTC</option>
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={form.language} onChange={set('language')}>
                <option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Delivery Settings</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Min Order Amount (₹)" id="minOrderAmount" prefix="₹" />
            <Field label="Max Delivery Radius (km)" id="maxDeliveryRadius" />
            <Field label="Free Delivery Threshold (₹)" id="freeDeliveryThreshold" prefix="₹" />
            <Field label="Default Delivery Fee (₹)" id="deliveryFee" prefix="₹" />
          </div>
        </div>

        <button onClick={save} className="btn-primary"><Save size={15} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
