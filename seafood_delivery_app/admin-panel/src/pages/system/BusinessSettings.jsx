import { useState } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

export default function BusinessSettings() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <PageHeader title="Business Settings" subtitle="Configure business rules and operations" />
      <div className="max-w-2xl space-y-5">

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Business Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Business Name</label><input className="input" defaultValue="OceanFresh Pvt. Ltd." /></div>
            <div><label className="label">Registration Number</label><input className="input" defaultValue="CIN: U12345MH2022PTC123456" /></div>
            <div><label className="label">FSSAI License</label><input className="input" defaultValue="12345678901234" /></div>
            <div><label className="label">PAN Number</label><input className="input" defaultValue="AAAAA0000A" /></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Settings</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Max Items Per Order</label><input className="input" defaultValue="20" /></div>
            <div><label className="label">Order Prep Time (mins)</label><input className="input" defaultValue="15" /></div>
            <div><label className="label">Estimated Delivery Time (mins)</label><input className="input" defaultValue="40" /></div>
            <div><label className="label">Max Active Orders (per driver)</label><input className="input" defaultValue="3" /></div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Rating & Reviews</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Review Window (hours after delivery)</label><input className="input" defaultValue="48" /></div>
            <div><label className="label">Min Rating to Show (1–5)</label><input className="input" defaultValue="3" /></div>
          </div>
        </div>

        <button onClick={save} className="btn-primary"><Save size={15} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
