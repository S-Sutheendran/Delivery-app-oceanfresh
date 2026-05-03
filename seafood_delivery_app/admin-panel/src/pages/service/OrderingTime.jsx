import { useState } from 'react'
import { Save, Clock } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OrderingTime() {
  const [enabled, setEnabled] = useState(true)
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('22:00')
  const [selectedDays, setSelectedDays] = useState(new Set(DAYS))
  const [saved, setSaved] = useState(false)

  const toggleDay = d => setSelectedDays(ds => { const n = new Set(ds); n.has(d) ? n.delete(d) : n.add(d); return n })
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <PageHeader title="Ordering Time" subtitle="Configure when customers can place orders" />

      <div className="max-w-lg space-y-5">
        {/* Enable toggle */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                <Clock size={18} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Service Status</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Enable or disable ordering</p>
              </div>
            </div>
            <button
              onClick={() => setEnabled(e => !e)}
              className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Time range */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Operating Hours</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Opening Time</label>
              <input type="time" className="input" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <label className="label">Closing Time</label>
              <input type="time" className="input" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Customers can place orders between <span className="font-medium text-brand-600 dark:text-brand-400">{start}</span> and <span className="font-medium text-brand-600 dark:text-brand-400">{end}</span>.
          </p>
        </div>

        {/* Days */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Active Days</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedDays.has(d)
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} className="btn-primary gap-2">
          <Save size={15} />
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
