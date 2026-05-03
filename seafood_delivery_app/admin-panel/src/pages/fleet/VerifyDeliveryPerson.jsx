import { useState } from 'react'
import { CheckCircle, XCircle, Eye, FileText, X, Phone, MapPin, Truck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const INIT_PENDING = [
  { id: 'AP001', name: 'Ramesh Pillai',  phone: '+91 90001 11111', vehicle: 'Bike',    zone: 'Thane',   submitted: '2024-01-14', docs: { govt_id: true, license: true,  rc: true  } },
  { id: 'AP002', name: 'Deepak Joshi',   phone: '+91 80002 22222', vehicle: 'Scooter', zone: 'Kurla',   submitted: '2024-01-13', docs: { govt_id: true, license: true,  rc: false } },
  { id: 'AP003', name: 'Sanjay Rao',     phone: '+91 70003 33333', vehicle: 'Bike',    zone: 'Andheri', submitted: '2024-01-12', docs: { govt_id: true, license: false, rc: false } },
  { id: 'AP004', name: 'Pradeep Nair',   phone: '+91 60004 44444', vehicle: 'Van',     zone: 'Dadar',   submitted: '2024-01-11', docs: { govt_id: true, license: true,  rc: true  } },
]

const REJECT_REASONS = [
  'Incomplete documentation',
  'Invalid documents submitted',
  'Background check failed',
  'Vehicle not eligible',
  'Zone not available',
  'Other',
]

function ApplicantDetailModal({ applicant, onClose }) {
  const allDocs = Object.values(applicant.docs).every(Boolean)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Applicant Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-lg">
              {applicant.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{applicant.name}</p>
              <p className="text-xs text-gray-400">Applied: {applicant.submitted}</p>
            </div>
          </div>
          {[
            { icon: Phone, label: 'Phone',   value: applicant.phone   },
            { icon: Truck, label: 'Vehicle', value: applicant.vehicle },
            { icon: MapPin,label: 'Zone',    value: applicant.zone    },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-14">{label}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</span>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Documents</p>
            <div className="flex gap-3">
              {[['govt_id', 'Govt ID'], ['license', 'License'], ['rc', 'RC Book']].map(([k, l]) => (
                <div key={k} className={`flex-1 rounded-xl p-2.5 text-center ${applicant.docs[k] ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <FileText size={16} className={`mx-auto mb-1 ${applicant.docs[k] ? 'text-green-600' : 'text-red-400'}`} />
                  <p className="text-[10px] font-medium text-gray-500">{l}</p>
                  <p className={`text-[10px] font-semibold ${applicant.docs[k] ? 'text-green-600' : 'text-red-500'}`}>
                    {applicant.docs[k] ? 'Verified' : 'Missing'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {!allDocs && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-300">
              Some documents are missing. Approval requires all documents.
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="btn-secondary w-full justify-center">Close</button>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ applicant, onConfirm, onClose }) {
  const [selected, setSelected]   = useState('')
  const [otherText, setOtherText] = useState('')
  const finalReason = selected === 'Other' ? otherText.trim() : selected
  const canConfirm  = selected && (selected !== 'Other' || otherText.trim().length > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Reject Application</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select a reason for rejecting {applicant.name}.</p>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-2">
          {REJECT_REASONS.map(r => (
            <button key={r} onClick={() => setSelected(r)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all flex items-center gap-3 ${
                selected === r
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 bg-white dark:bg-gray-700/40'
              }`}>
              <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selected === r ? 'border-red-400 bg-red-400' : 'border-gray-300 dark:border-gray-500'}`}>
                {selected === r && <span className="w-2 h-2 bg-white rounded-full" />}
              </span>
              {r}
            </button>
          ))}
          {selected === 'Other' && (
            <textarea autoFocus value={otherText} onChange={e => setOtherText(e.target.value)}
              placeholder="Describe the rejection reason..." className="input resize-none h-20 mt-1" maxLength={200} />
          )}
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => canConfirm && onConfirm(finalReason)} disabled={!canConfirm}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm">
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyDeliveryPerson() {
  const [applications, setApplications] = useState(INIT_PENDING)
  const [viewApp,    setViewApp]    = useState(null)
  const [rejectApp,  setRejectApp]  = useState(null)

  const allDocs = d => Object.values(d.docs).every(Boolean)

  const handleApprove = id => setApplications(as => as.filter(a => a.id !== id))
  const handleReject  = (reason) => {
    setApplications(as => as.filter(a => a.id !== rejectApp.id))
    setRejectApp(null)
  }

  return (
    <div>
      <PageHeader title="Verify Delivery Person" subtitle={`${applications.length} application${applications.length !== 1 ? 's' : ''} pending review`} />

      {applications.length === 0 && (
        <div className="card p-10 text-center text-gray-400 dark:text-gray-500">
          <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
          <p className="text-sm font-medium">All applications reviewed</p>
        </div>
      )}

      <div className="space-y-4">
        {applications.map(a => (
          <div key={a.id} className="card p-5">
            <div className="flex flex-wrap items-start gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-sm">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.phone} · {a.vehicle} · {a.zone}</p>
                  <p className="text-xs text-gray-400">Applied: {a.submitted}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  {[['govt_id', 'Govt ID'], ['license', 'License'], ['rc', 'RC']].map(([k, l]) => (
                    <div key={k} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.docs[k] ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-400'}`}>
                        <FileText size={14} />
                      </div>
                      <span className="text-[10px] text-gray-400">{l}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {allDocs(a) ? (
                    <>
                      <button onClick={() => handleApprove(a.id)} className="btn-primary py-1.5 px-3 text-xs gap-1">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => setRejectApp(a)} className="btn-danger py-1.5 px-3 text-xs gap-1">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  ) : (
                    <Badge variant="warning">Docs Incomplete</Badge>
                  )}
                  <button onClick={() => setViewApp(a)} className="btn-secondary py-1.5 px-3 text-xs gap-1">
                    <Eye size={13} /> View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewApp   && <ApplicantDetailModal applicant={viewApp}   onClose={() => setViewApp(null)} />}
      {rejectApp && <RejectModal applicant={rejectApp} onConfirm={handleReject} onClose={() => setRejectApp(null)} />}
    </div>
  )
}
