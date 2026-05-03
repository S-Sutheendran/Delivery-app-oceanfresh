import { useState } from 'react'
import { Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 ${value ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function AppSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false, guestOrdering: false, pushNotifications: true,
    emailNotifications: true, smsOtp: true, whatsappOtp: true,
    liveTracking: true, proximityAlert: true, reviewReminder: true,
    orderRating: true, referralProgram: false, loyaltyPoints: false,
  })
  const set = k => v => setSettings(s => ({ ...s, [k]: v }))
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const sections = [
    { title: 'App Mode', items: [
      { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Show maintenance screen to all users' },
      { key: 'guestOrdering',  label: 'Guest Ordering',   description: 'Allow ordering without login' },
    ]},
    { title: 'Notifications', items: [
      { key: 'pushNotifications',  label: 'Push Notifications',  description: 'FCM push notifications to customers and drivers' },
      { key: 'emailNotifications', label: 'Email Notifications', description: 'Order confirmation and status emails' },
      { key: 'smsOtp',             label: 'SMS OTP',             description: 'Send OTP via SMS (Twilio)' },
      { key: 'whatsappOtp',        label: 'WhatsApp OTP',        description: 'Send OTP via WhatsApp (preferred)' },
    ]},
    { title: 'Tracking', items: [
      { key: 'liveTracking',    label: 'Live Driver Tracking', description: 'Show real-time driver location to customer' },
      { key: 'proximityAlert',  label: '1km Proximity Alert',  description: 'Alert customer when driver is within 1km' },
    ]},
    { title: 'Engagement', items: [
      { key: 'reviewReminder',  label: 'Review Reminders', description: 'Prompt customer to review after delivery' },
      { key: 'orderRating',     label: 'Order Rating',     description: 'Enable star rating for orders' },
      { key: 'referralProgram', label: 'Referral Program', description: 'Customer referral rewards system' },
      { key: 'loyaltyPoints',   label: 'Loyalty Points',   description: 'Earn points on every order' },
    ]},
  ]

  return (
    <div>
      <PageHeader title="App Settings" subtitle="Feature flags and app behaviour" />
      <div className="max-w-2xl space-y-5">
        {sections.map(s => (
          <div key={s.title} className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{s.title}</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {s.items.map(item => (
                <Toggle key={item.key} label={item.label} description={item.description} value={settings[item.key]} onChange={set(item.key)} />
              ))}
            </div>
          </div>
        ))}
        <button onClick={save} className="btn-primary"><Save size={15} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>
    </div>
  )
}
