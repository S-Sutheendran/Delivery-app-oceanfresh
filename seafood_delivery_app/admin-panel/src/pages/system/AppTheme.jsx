import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const PRESETS = [
  { id: 'ocean',  name: 'Ocean Teal',   primary: '#00838F', secondary: '#FF6B35', preview: ['#00838F', '#006064', '#FF6B35'] },
  { id: 'navy',   name: 'Navy Blue',    primary: '#1565C0', secondary: '#FF7043', preview: ['#1565C0', '#0D47A1', '#FF7043'] },
  { id: 'forest', name: 'Forest Green', primary: '#2E7D32', secondary: '#FFC107', preview: ['#2E7D32', '#1B5E20', '#FFC107'] },
  { id: 'royal',  name: 'Royal Purple', primary: '#6A1B9A', secondary: '#FF9800', preview: ['#6A1B9A', '#4A148C', '#FF9800'] },
]

export default function AppTheme() {
  const [selected, setSelected] = useState('ocean')
  const [primary, setPrimary] = useState('#00838F')
  const [secondary, setSecondary] = useState('#FF6B35')
  const [fontScale, setFontScale] = useState('medium')
  const [borderRadius, setBorderRadius] = useState('rounded')
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const applyPreset = (preset) => {
    setSelected(preset.id)
    setPrimary(preset.primary)
    setSecondary(preset.secondary)
  }

  return (
    <div>
      <PageHeader title="App Theme" subtitle="Customize the look and feel of the customer app" />
      <div className="max-w-2xl space-y-5">

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Theme Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border-2 transition-colors ${selected === p.id ? 'border-brand-600 dark:border-brand-400' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <div className="flex gap-1 mb-2">
                  {p.preview.map((c, i) => <div key={i} className="h-5 flex-1 rounded" style={{ backgroundColor: c }} />)}
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{p.name}</p>
                {selected === p.id && <div className="flex justify-center mt-1"><Check size={12} className="text-brand-600 dark:text-brand-400" /></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Custom Colours</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Primary Colour</label>
              <div className="flex gap-3 items-center">
                <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-1" />
                <input className="input flex-1 font-mono text-sm" value={primary} onChange={e => setPrimary(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Accent Colour</label>
              <div className="flex gap-3 items-center">
                <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer p-1" />
                <input className="input flex-1 font-mono text-sm" value={secondary} onChange={e => setSecondary(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Typography & Shape</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Font Scale</label>
              <select className="input" value={fontScale} onChange={e => setFontScale(e.target.value)}>
                <option value="small">Small</option><option value="medium">Medium (Default)</option><option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="label">Border Radius</label>
              <select className="input" value={borderRadius} onChange={e => setBorderRadius(e.target.value)}>
                <option value="none">None (Sharp)</option><option value="small">Small</option><option value="rounded">Rounded (Default)</option><option value="pill">Pill</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={save} className="btn-primary"><Save size={15} />{saved ? '✓ Saved!' : 'Save & Apply'}</button>
      </div>
    </div>
  )
}
