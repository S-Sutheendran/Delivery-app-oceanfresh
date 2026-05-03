import { useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const INIT_CHANNELS = [
  { id: 1, type: 'Phone',    value: '+91 98765 43210', label: 'Customer Support' },
  { id: 2, type: 'WhatsApp', value: '+91 98765 43210', label: 'WhatsApp Support' },
  { id: 3, type: 'Email',    value: 'support@oceanfresh.in', label: 'General Support' },
  { id: 4, type: 'Email',    value: 'driver@oceanfresh.in',  label: 'Driver Support' },
]

export default function ContactUs() {
  const [channels, setChannels] = useState(INIT_CHANNELS)
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const remove = id => setChannels(cs => cs.filter(c => c.id !== id))
  const add = () => setChannels(cs => [...cs, { id: Date.now(), type: 'Phone', value: '', label: '' }])
  const update = (id, k, v) => setChannels(cs => cs.map(c => c.id === id ? { ...c, [k]: v } : c))

  return (
    <div>
      <PageHeader title="Contact Us" subtitle="Support contact channels shown in the app" />
      <div className="max-w-2xl space-y-5">

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Channels</h3>
            <button className="btn-secondary text-xs py-1.5 gap-1" onClick={add}><Plus size={12} /> Add</button>
          </div>
          <div className="space-y-3">
            {channels.map(ch => (
              <div key={ch.id} className="flex gap-3 items-start">
                <select className="input w-32 shrink-0" value={ch.type} onChange={e => update(ch.id, 'type', e.target.value)}>
                  <option>Phone</option><option>WhatsApp</option><option>Email</option><option>Website</option>
                </select>
                <input className="input flex-1" placeholder="Value" value={ch.value} onChange={e => update(ch.id, 'value', e.target.value)} />
                <input className="input flex-1" placeholder="Label" value={ch.label} onChange={e => update(ch.id, 'label', e.target.value)} />
                <button onClick={() => remove(ch.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-0.5 shrink-0"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Social Media</h3>
          <div className="space-y-3">
            {[
              { platform: 'Facebook', placeholder: 'https://facebook.com/oceanfresh' },
              { platform: 'Instagram', placeholder: 'https://instagram.com/oceanfresh' },
              { platform: 'Twitter / X', placeholder: 'https://twitter.com/oceanfresh' },
            ].map(s => (
              <div key={s.platform} className="grid grid-cols-[100px_1fr] gap-3 items-center">
                <label className="text-sm text-gray-600 dark:text-gray-400">{s.platform}</label>
                <input className="input" placeholder={s.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">App Store Links</h3>
          <div className="space-y-3">
            <div><label className="label">Google Play Store URL</label><input className="input" placeholder="https://play.google.com/store/apps/..." /></div>
            <div><label className="label">Apple App Store URL</label><input className="input" placeholder="https://apps.apple.com/..." /></div>
          </div>
        </div>

        <button onClick={save} className="btn-primary"><Save size={15} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
