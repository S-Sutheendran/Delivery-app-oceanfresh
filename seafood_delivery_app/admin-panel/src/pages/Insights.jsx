import { useState } from 'react'
import {
  ShoppingBag, Users, Truck, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle,
  Star, MapPin, Smartphone, Package, UserCheck, ThumbsUp, ThumbsDown, X,
  Activity, BarChart2, MessageSquare, Download, Upload, ArrowRight, Check,
} from 'lucide-react'
import Badge from '../components/ui/Badge'

// ── Period config ────────────────────────────────────────────────────────────
const PERIODS = ['Weekly', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly']
const PM = { Weekly: 1, Monthly: 4.3, Quarterly: 13, 'Half Yearly': 26, Yearly: 52 }
const sc  = (base, p) => Math.round(base * PM[p])
const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
const rev = (base, p) => { const v = base * PM[p]; return v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(1)}k` }

// ── Mock data pools ──────────────────────────────────────────────────────────
const ORDERS_POOL = [
  { id: '#ORD-1042', customer: 'Rahul Sharma',  total: '₹649',   status: 'delivered', driver: 'Suresh K.', zone: 'Bandra',    time: '28 min', date: '15 Jan 14:32' },
  { id: '#ORD-1041', customer: 'Priya Patel',   total: '₹820',   status: 'delivered', driver: 'Kiran M.',  zone: 'Andheri',   time: '45 min', date: '15 Jan 14:10' },
  { id: '#ORD-1040', customer: 'Amit Kumar',    total: '₹1,340', status: 'delivered', driver: 'Raj T.',    zone: 'Dadar',     time: '32 min', date: '15 Jan 13:55' },
  { id: '#ORD-1039', customer: 'Sneha Reddy',   total: '₹299',   status: 'delivered', driver: 'Raj T.',    zone: 'Kurla',     time: '22 min', date: '15 Jan 13:20' },
  { id: '#ORD-1038', customer: 'Vikas Gupta',   total: '₹975',   status: 'cancelled', driver: '—',         zone: 'Borivali',  time: '—',      date: '15 Jan 12:45' },
  { id: '#ORD-1037', customer: 'Neha Singh',    total: '₹560',   status: 'delivered', driver: 'Suresh K.', zone: 'Bandra',    time: '38 min', date: '15 Jan 12:10' },
  { id: '#ORD-1036', customer: 'Rohit Mehra',   total: '₹2,100', status: 'delivered', driver: 'Raj T.',    zone: 'Malad',     time: '52 min', date: '15 Jan 11:30' },
  { id: '#ORD-1035', customer: 'Anjali Desai',  total: '₹450',   status: 'pending',   driver: 'Pending',   zone: 'Thane',     time: '—',      date: '15 Jan 11:05' },
  { id: '#ORD-1034', customer: 'Suresh Nair',   total: '₹780',   status: 'delivered', driver: 'Kiran M.',  zone: 'Andheri',   time: '19 min', date: '15 Jan 10:40' },
  { id: '#ORD-1033', customer: 'Meena Iyer',    total: '₹1,100', status: 'delivered', driver: 'Suresh K.', zone: 'Bandra',    time: '41 min', date: '15 Jan 10:15' },
  { id: '#ORD-1032', customer: 'Dev Chopra',    total: '₹320',   status: 'cancelled', driver: '—',         zone: 'Thane',     time: '—',      date: '15 Jan 09:50' },
  { id: '#ORD-1031', customer: 'Kavita Rao',    total: '₹660',   status: 'delivered', driver: 'Raj T.',    zone: 'Kurla',     time: '35 min', date: '15 Jan 09:30' },
  { id: '#ORD-1030', customer: 'Arjun Shah',    total: '₹1,890', status: 'delivered', driver: 'Kiran M.',  zone: 'Malad',     time: '58 min', date: '15 Jan 09:00' },
  { id: '#ORD-1029', customer: 'Pooja Verma',   total: '₹430',   status: 'delivered', driver: 'Suresh K.', zone: 'Borivali',  time: '27 min', date: '14 Jan 18:45' },
  { id: '#ORD-1028', customer: 'Nikhil Joshi',  total: '₹870',   status: 'delivered', driver: 'Raj T.',    zone: 'Dadar',     time: '31 min', date: '14 Jan 18:20' },
]

const PRODUCTS_POOL = [
  { rank: 1,  name: 'Tiger Prawns (500g)',  category: 'Shellfish',  sold: 142, revenue: '₹71,000', rating: 4.8, reviews: 98 },
  { rank: 2,  name: 'Salmon Fillet (300g)', category: 'Fish',       sold: 128, revenue: '₹64,000', rating: 4.7, reviews: 84 },
  { rank: 3,  name: 'Pomfret Fresh (1kg)',  category: 'Fish',       sold: 115, revenue: '₹46,000', rating: 4.5, reviews: 72 },
  { rank: 4,  name: 'Crab Whole (800g)',    category: 'Shellfish',  sold: 98,  revenue: '₹49,000', rating: 4.6, reviews: 61 },
  { rank: 5,  name: 'Squids (500g)',        category: 'Cephalopod', sold: 87,  revenue: '₹21,750', rating: 4.3, reviews: 55 },
  { rank: 6,  name: 'Hilsa Fish (1kg)',     category: 'Fish',       sold: 76,  revenue: '₹38,000', rating: 4.4, reviews: 48 },
  { rank: 7,  name: 'Clams (500g)',         category: 'Shellfish',  sold: 45,  revenue: '₹11,250', rating: 3.9, reviews: 32 },
  { rank: 8,  name: 'Dry Fish Mix (250g)', category: 'Dried',      sold: 38,  revenue: '₹7,600',  rating: 3.7, reviews: 24 },
  { rank: 9,  name: 'Oysters (6pcs)',       category: 'Shellfish',  sold: 22,  revenue: '₹8,800',  rating: 3.5, reviews: 15 },
  { rank: 10, name: 'Sea Urchin (100g)',    category: 'Specialty',  sold: 9,   revenue: '₹3,600',  rating: 3.2, reviews: 8  },
]

const REVIEWS_POOL = [
  { order: '#ORD-1042', customer: 'Rahul Sharma', rating: 5, product: 'Tiger Prawns (500g)',  comment: 'Absolutely fresh! The prawns were amazing. Will definitely order again!',             date: '15 Jan' },
  { order: '#ORD-1039', customer: 'Sneha Reddy',  rating: 5, product: 'Pomfret Fresh (1kg)',  comment: 'Best seafood delivery in the city! Superb freshness every time.',                    date: '15 Jan' },
  { order: '#ORD-1034', customer: 'Suresh Nair',  rating: 5, product: 'Salmon Fillet (300g)', comment: 'Lightning fast delivery. Salmon was perfectly packed and so fresh.',                  date: '15 Jan' },
  { order: '#ORD-1029', customer: 'Pooja Verma',  rating: 5, product: 'Crab Whole (800g)',    comment: 'Excellent packaging and freshness. The crab was still alive!',                       date: '14 Jan' },
  { order: '#ORD-1037', customer: 'Neha Singh',   rating: 4, product: 'Squids (500g)',        comment: 'Good quality squid, arrived well packed. Will order again.',                         date: '15 Jan' },
  { order: '#ORD-1036', customer: 'Rohit Mehra',  rating: 2, product: 'Hilsa Fish (1kg)',     comment: "Delivery was very late (52 minutes). Fish didn't seem very fresh on arrival.",       date: '15 Jan' },
  { order: '#ORD-1030', customer: 'Arjun Shah',   rating: 1, product: 'Clams (500g)',         comment: 'Terrible experience. Wrong order delivered and customer support was unhelpful.',      date: '15 Jan' },
  { order: '#ORD-1031', customer: 'Kavita Rao',   rating: 2, product: 'Dry Fish Mix (250g)',  comment: 'Packaging was broken on delivery. Product smelled off. Very disappointing.',         date: '15 Jan' },
]

const DRIVERS_POOL = [
  { rank: 1, name: 'Suresh K.', orders: 38, avgTime: '29 min', rating: 4.8, zone: 'Bandra / Andheri' },
  { rank: 2, name: 'Raj T.',    orders: 34, avgTime: '32 min', rating: 4.6, zone: 'Dadar / Kurla'    },
  { rank: 3, name: 'Kiran M.',  orders: 29, avgTime: '36 min', rating: 4.5, zone: 'Malad / Borivali' },
  { rank: 4, name: 'Amol D.',   orders: 24, avgTime: '40 min', rating: 4.3, zone: 'Thane'            },
  { rank: 5, name: 'Prash B.',  orders: 18, avgTime: '44 min', rating: 4.1, zone: 'Mulund'           },
  { rank: 6, name: 'Sanjay R.', orders: 12, avgTime: '52 min', rating: 3.9, zone: 'Navi Mumbai'      },
]

const ZONES_POOL = [
  { rank: 1, zone: 'Bandra',       orders: 284, revenue: '₹1,42,000', avgTime: '31 min' },
  { rank: 2, zone: 'Andheri',      orders: 241, revenue: '₹1,20,500', avgTime: '34 min' },
  { rank: 3, zone: 'Dadar',        orders: 198, revenue: '₹99,000',   avgTime: '28 min' },
  { rank: 4, zone: 'Malad',        orders: 176, revenue: '₹88,000',   avgTime: '36 min' },
  { rank: 5, zone: 'Borivali',     orders: 154, revenue: '₹77,000',   avgTime: '42 min' },
  { rank: 6, zone: 'Kurla',        orders: 132, revenue: '₹66,000',   avgTime: '38 min' },
  { rank: 7, zone: 'Thane',        orders: 98,  revenue: '₹49,000',   avgTime: '48 min' },
  { rank: 8, zone: 'Mulund',       orders: 76,  revenue: '₹38,000',   avgTime: '52 min' },
  { rank: 9, zone: 'Navi Mumbai',  orders: 54,  revenue: '₹27,000',   avgTime: '58 min' },
]

const PAGES_POOL = [
  { page: 'Home / Product Listing', visits: 3842, unique: 1241, avgDuration: '4:12' },
  { page: 'Product Detail',         visits: 2198, unique: 984,  avgDuration: '2:48' },
  { page: 'Cart',                   visits: 1654, unique: 821,  avgDuration: '3:22' },
  { page: 'Checkout',               visits: 1102, unique: 724,  avgDuration: '5:14' },
  { page: 'Order Tracking',         visits: 984,  unique: 612,  avgDuration: '1:55' },
  { page: 'Profile',                visits: 742,  unique: 498,  avgDuration: '2:10' },
  { page: 'Order History',          visits: 621,  unique: 441,  avgDuration: '2:35' },
  { page: 'Offers / Coupons',       visits: 512,  unique: 389,  avgDuration: '3:01' },
]

const ACTIONS_POOL = [
  { action: 'Add to Cart',     count: 4821, users: 1182, trend: '+12%' },
  { action: 'Place Order',     count: 2840, users: 921,  trend: '+8%'  },
  { action: 'Search Product',  count: 2341, users: 1041, trend: '+5%'  },
  { action: 'Apply Coupon',    count: 984,  users: 641,  trend: '+21%' },
  { action: 'Track Order',     count: 921,  users: 512,  trend: '+3%'  },
  { action: 'Write Review',    count: 543,  users: 391,  trend: '+15%' },
  { action: 'Cancel Order',    count: 241,  users: 198,  trend: '-4%'  },
  { action: 'Request Refund',  count: 124,  users: 98,   trend: '-2%'  },
]

const INSTALL_POOL = [
  { user: 'Rahul Sharma',  device: 'Android 14', city: 'Mumbai', date: '15 Jan 10:22' },
  { user: 'Priya Patel',   device: 'iOS 17',     city: 'Thane',  date: '15 Jan 11:05' },
  { user: 'Anjali Desai',  device: 'Android 13', city: 'Bandra', date: '15 Jan 12:30' },
  { user: 'Meena Iyer',    device: 'iOS 16',     city: 'Andheri',date: '15 Jan 14:00' },
  { user: 'Arjun Shah',    device: 'Android 14', city: 'Dadar',  date: '14 Jan 18:30' },
  { user: 'Karan Mehta',   device: 'iOS 17',     city: 'Malad',  date: '14 Jan 16:10' },
  { user: 'Sunita Rao',    device: 'Android 12', city: 'Kurla',  date: '14 Jan 14:45' },
]

const UNINSTALL_POOL = [
  { user: 'Dev Chopra', device: 'Android 13', date: '15 Jan 09:15', reason: 'Too expensive'    },
  { user: 'Kavita Rao', device: 'iOS 16',     date: '14 Jan 16:45', reason: 'App issues'       },
  { user: 'Vivek S.',   device: 'Android 14', date: '14 Jan 13:20', reason: 'No longer needed' },
]

const DELIVERY_TIMES = [
  { id: '#ORD-1030', customer: 'Arjun Shah',   driver: 'Kiran M.',  zone: 'Malad',    time: '58 min', date: '15 Jan 09:00' },
  { id: '#ORD-1036', customer: 'Rohit Mehra',  driver: 'Raj T.',    zone: 'Malad',    time: '52 min', date: '15 Jan 11:30' },
  { id: '#ORD-1041', customer: 'Priya Patel',  driver: 'Kiran M.',  zone: 'Andheri',  time: '45 min', date: '15 Jan 14:10' },
  { id: '#ORD-1033', customer: 'Meena Iyer',   driver: 'Suresh K.', zone: 'Bandra',   time: '41 min', date: '15 Jan 10:15' },
  { id: '#ORD-1037', customer: 'Neha Singh',   driver: 'Suresh K.', zone: 'Bandra',   time: '38 min', date: '15 Jan 12:10' },
  { id: '#ORD-1031', customer: 'Kavita Rao',   driver: 'Raj T.',    zone: 'Kurla',    time: '35 min', date: '15 Jan 09:30' },
  { id: '#ORD-1040', customer: 'Amit Kumar',   driver: 'Raj T.',    zone: 'Dadar',    time: '32 min', date: '15 Jan 13:55' },
  { id: '#ORD-1028', customer: 'Nikhil Joshi', driver: 'Raj T.',    zone: 'Dadar',    time: '31 min', date: '14 Jan 18:20' },
  { id: '#ORD-1029', customer: 'Pooja Verma',  driver: 'Suresh K.', zone: 'Borivali', time: '27 min', date: '14 Jan 18:45' },
  { id: '#ORD-1042', customer: 'Rahul Sharma', driver: 'Suresh K.', zone: 'Bandra',   time: '28 min', date: '15 Jan 14:32' },
  { id: '#ORD-1034', customer: 'Suresh Nair',  driver: 'Kiran M.',  zone: 'Andheri',  time: '19 min', date: '15 Jan 10:40' },
]

// ── Reusable sub-components ──────────────────────────────────────────────────

function Stars({ n }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} className={i <= n ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      ))}
    </span>
  )
}

function ModalTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
            {cols.map(c => (
              <th key={c.key} className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              {cols.map(c => (
                <td key={c.key} className="px-3 py-2.5 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-center py-8 text-xs text-gray-400">No data available.</p>
      )}
    </div>
  )
}

function ReportModal({ report, onClose }) {
  if (!report) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '82vh' }}>
        {/* Modal header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{report.title}</h3>
            {report.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{report.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6">
          {report.content}
        </div>
      </div>
    </div>
  )
}

function ReportCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 border-transparent transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <ArrowRight size={13} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </button>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-2">
      <div className="w-5 h-5 bg-brand-100 dark:bg-brand-900/30 rounded flex items-center justify-center">
        <Icon size={12} className="text-brand-600 dark:text-brand-400" />
      </div>
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</h3>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
    </div>
  )
}

const statusBadge = (s) => {
  const map = { delivered: 'success', in_transit: 'info', confirmed: 'brand', cancelled: 'error', pending: 'warning' }
  return <Badge variant={map[s] || 'gray'}>{s.replace('_', ' ')}</Badge>
}

const trendColor = (t) => t.startsWith('+') ? 'text-green-500' : 'text-red-500'

// ── Main component ───────────────────────────────────────────────────────────
export default function Insights() {
  const [period, setPeriod] = useState('Weekly')
  const [modal,  setModal]  = useState(null)

  const open  = (title, subtitle, content) => setModal({ title, subtitle, content })
  const close = () => setModal(null)

  const totalOrders    = sc(48,  period)
  const deliveredOrds  = sc(39,  period)
  const cancelledOrds  = sc(3,   period)
  const pendingOrds    = sc(6,   period)
  const installs       = sc(7,   period)
  const uninstalls     = sc(3,   period)

  // ── Shared order table builder ──
  const orderTable = (rows) => (
    <ModalTable
      cols={[
        { key: 'id',         label: 'Order ID' },
        { key: 'customer',   label: 'Customer' },
        { key: 'total',      label: 'Total'    },
        { key: 'zone',       label: 'Zone'     },
        { key: 'driver',     label: 'Driver'   },
        { key: 'time',       label: 'Del. Time'},
        { key: 'date',       label: 'Date'     },
        { key: '_status',    label: 'Status'   },
      ]}
      rows={rows.map(o => ({ ...o, _status: statusBadge(o.status) }))}
    />
  )

  return (
    <div className="space-y-6 pb-4">

      {/* ── Page header + period tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Click any card to drill into the detail. Period: <strong className="text-brand-600 dark:text-brand-400">{period}</strong>
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 self-start sm:self-auto">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                period === p
                  ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          icon={ShoppingBag} label="Total Orders" value={fmt(totalOrders)} sub="All order types"
          color="bg-brand-600"
          onClick={() => open('All Orders', `${period} — ${totalOrders} orders total`, orderTable(ORDERS_POOL))}
        />
        <ReportCard
          icon={TrendingUp} label="Revenue" value={rev(24300, period)} sub="Net after cancellations"
          color="bg-green-600"
          onClick={() => open('Revenue Breakdown', `${period}`,
            <ModalTable
              cols={[{key:'day',label:'Day'},{key:'orders',label:'Orders'},{key:'revenue',label:'Revenue'},{key:'avgOrder',label:'Avg Order'}]}
              rows={[
                {day:'Mon',orders:sc(38,period),revenue:rev(18240,period),avgOrder:'₹480'},
                {day:'Tue',orders:sc(45,period),revenue:rev(21600,period),avgOrder:'₹480'},
                {day:'Wed',orders:sc(48,period),revenue:rev(24300,period),avgOrder:'₹506'},
                {day:'Thu',orders:sc(42,period),revenue:rev(20160,period),avgOrder:'₹480'},
                {day:'Fri',orders:sc(52,period),revenue:rev(26520,period),avgOrder:'₹510'},
                {day:'Sat',orders:sc(68,period),revenue:rev(34680,period),avgOrder:'₹510'},
                {day:'Sun',orders:sc(72,period),revenue:rev(36720,period),avgOrder:'₹510'},
              ]}
            />
          )}
        />
        <ReportCard
          icon={Users} label="Active Customers" value={fmt(sc(284, period))} sub="Placed ≥1 order"
          color="bg-purple-600"
          onClick={() => open('Active Customers', `${period}`,
            <ModalTable
              cols={[{key:'name',label:'Customer'},{key:'orders',label:'Orders'},{key:'spent',label:'Spent'},{key:'zone',label:'Zone'},{key:'last',label:'Last Order'}]}
              rows={[
                {name:'Rahul Sharma', orders:sc(8,period),  spent:rev(4200,period),  zone:'Bandra',   last:'15 Jan'},
                {name:'Suresh Nair',  orders:sc(7,period),  spent:rev(5460,period),  zone:'Andheri',  last:'15 Jan'},
                {name:'Priya Patel',  orders:sc(6,period),  spent:rev(3100,period),  zone:'Andheri',  last:'15 Jan'},
                {name:'Meena Iyer',   orders:sc(5,period),  spent:rev(5500,period),  zone:'Bandra',   last:'15 Jan'},
                {name:'Amit Kumar',   orders:sc(5,period),  spent:rev(2800,period),  zone:'Dadar',    last:'15 Jan'},
                {name:'Sneha Reddy',  orders:sc(4,period),  spent:rev(1200,period),  zone:'Kurla',    last:'15 Jan'},
                {name:'Neha Singh',   orders:sc(4,period),  spent:rev(2240,period),  zone:'Bandra',   last:'15 Jan'},
                {name:'Rohit Mehra',  orders:sc(3,period),  spent:rev(6300,period),  zone:'Malad',    last:'15 Jan'},
              ]}
            />
          )}
        />
        <ReportCard
          icon={Truck} label="Total Drivers" value={`${sc(12, period) > 99 ? 99 : sc(12, period)}`} sub="Onboarded & approved"
          color="bg-orange-500"
          onClick={() => open('Driver Overview', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Driver'},{key:'orders',label:'Orders'},{key:'avgTime',label:'Avg Time'},{key:'rating',label:'Rating'},{key:'zone',label:'Zone'}]}
              rows={DRIVERS_POOL.map(d => ({ ...d, orders: sc(d.orders, period) }))}
            />
          )}
        />
      </div>

      {/* ── Section: Order Analytics ── */}
      <SectionHeader icon={ShoppingBag} title="Order Analytics" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={CheckCircle2} label="Delivered" value={fmt(deliveredOrds)} sub="Completed successfully"
          color="bg-green-600"
          onClick={() => open('Delivered Orders', `${period} — ${deliveredOrds} delivered`,
            orderTable(ORDERS_POOL.filter(o => o.status === 'delivered'))
          )}
        />
        <ReportCard
          icon={XCircle} label="Cancelled" value={fmt(cancelledOrds)} sub="Cancelled before delivery"
          color="bg-red-500"
          onClick={() => open('Cancelled Orders', `${period}`,
            orderTable(ORDERS_POOL.filter(o => o.status === 'cancelled'))
          )}
        />
        <ReportCard
          icon={AlertCircle} label="Pending / Active" value={fmt(pendingOrds)} sub="Awaiting action"
          color="bg-amber-500"
          onClick={() => open('Pending & Active Orders', `${period}`,
            orderTable(ORDERS_POOL.filter(o => ['pending', 'confirmed', 'in_transit'].includes(o.status)))
          )}
        />
        <ReportCard
          icon={TrendingUp} label="Highest Value Order" value="₹2,100" sub="#ORD-1036 · Rohit Mehra"
          color="bg-teal-600"
          onClick={() => open('Orders Sorted by Value', `${period} — highest first`,
            orderTable([...ORDERS_POOL].sort((a, b) =>
              parseInt(b.total.replace(/[₹,]/g, '')) - parseInt(a.total.replace(/[₹,]/g, ''))
            ))
          )}
        />
      </div>

      {/* ── Section: Delivery Performance ── */}
      <SectionHeader icon={Clock} title="Delivery Performance" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={Clock} label="Max Delivery Time" value="58 min" sub="#ORD-1030 · Kiran M. · Malad"
          color="bg-red-400"
          onClick={() => open('Slowest Deliveries', `${period} — sorted by longest time`,
            <ModalTable
              cols={[{key:'id',label:'Order'},{key:'customer',label:'Customer'},{key:'driver',label:'Driver'},{key:'zone',label:'Zone'},{key:'time',label:'Time'},{key:'date',label:'Date'}]}
              rows={[...DELIVERY_TIMES].sort((a,b) => parseInt(b.time) - parseInt(a.time))}
            />
          )}
        />
        <ReportCard
          icon={Truck} label="Min Delivery Time" value="19 min" sub="#ORD-1034 · Kiran M. · Andheri"
          color="bg-green-500"
          onClick={() => open('Fastest Deliveries', `${period} — sorted by shortest time`,
            <ModalTable
              cols={[{key:'id',label:'Order'},{key:'customer',label:'Customer'},{key:'driver',label:'Driver'},{key:'zone',label:'Zone'},{key:'time',label:'Time'},{key:'date',label:'Date'}]}
              rows={[...DELIVERY_TIMES].sort((a,b) => parseInt(a.time) - parseInt(b.time))}
            />
          )}
        />
        <ReportCard
          icon={Activity} label="Avg Delivery Time" value="34 min" sub="Across all drivers"
          color="bg-brand-600"
          onClick={() => open('All Delivery Times', `${period}`,
            <ModalTable
              cols={[{key:'id',label:'Order'},{key:'customer',label:'Customer'},{key:'driver',label:'Driver'},{key:'zone',label:'Zone'},{key:'time',label:'Time'},{key:'date',label:'Date'}]}
              rows={DELIVERY_TIMES}
            />
          )}
        />
        <ReportCard
          icon={UserCheck} label="Top Driver" value="Suresh K." sub={`${sc(38, period)} orders · 4.8★`}
          color="bg-purple-600"
          onClick={() => open('Driver Performance Leaderboard', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Driver'},{key:'orders',label:'Orders'},{key:'avgTime',label:'Avg Time'},{key:'rating',label:'Rating'},{key:'zone',label:'Zone'}]}
              rows={DRIVERS_POOL.map(d => ({ ...d, orders: sc(d.orders, period) }))}
            />
          )}
        />
      </div>

      {/* ── Section: Product Performance ── */}
      <SectionHeader icon={Package} title="Product Performance" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={Package} label="Highest Sold" value="Tiger Prawns" sub={`${sc(142, period)} sold`}
          color="bg-brand-600"
          onClick={() => open('Products by Sales — High to Low', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Product'},{key:'category',label:'Category'},{key:'sold',label:'Units Sold'},{key:'revenue',label:'Revenue'}]}
              rows={[...PRODUCTS_POOL].sort((a,b) => b.sold - a.sold).map(p => ({ ...p, sold: sc(p.sold, period) }))}
            />
          )}
        />
        <ReportCard
          icon={Package} label="Lowest Sold" value="Sea Urchin" sub={`${sc(9, period)} sold`}
          color="bg-gray-500"
          onClick={() => open('Products by Sales — Low to High', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Product'},{key:'category',label:'Category'},{key:'sold',label:'Units Sold'},{key:'revenue',label:'Revenue'}]}
              rows={[...PRODUCTS_POOL].sort((a,b) => a.sold - b.sold).map(p => ({ ...p, sold: sc(p.sold, period) }))}
            />
          )}
        />
        <ReportCard
          icon={Star} label="Highest Rated Product" value="Tiger Prawns" sub="4.8★ avg rating"
          color="bg-amber-500"
          onClick={() => open('Products by Rating — High to Low', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Product'},{key:'category',label:'Category'},{key:'rating',label:'Avg Rating'},{key:'reviews',label:'Reviews'}]}
              rows={[...PRODUCTS_POOL].sort((a,b) => b.rating - a.rating).map(p => ({ ...p, reviews: sc(p.reviews, period) }))}
            />
          )}
        />
        <ReportCard
          icon={Star} label="Lowest Rated Product" value="Sea Urchin" sub="3.2★ avg rating"
          color="bg-red-400"
          onClick={() => open('Products by Rating — Low to High', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'name',label:'Product'},{key:'category',label:'Category'},{key:'rating',label:'Avg Rating'},{key:'reviews',label:'Reviews'}]}
              rows={[...PRODUCTS_POOL].sort((a,b) => a.rating - b.rating).map(p => ({ ...p, reviews: sc(p.reviews, period) }))}
            />
          )}
        />
      </div>

      {/* ── Section: Ratings & Reviews ── */}
      <SectionHeader icon={Star} title="Ratings & Reviews" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={ThumbsUp} label="5-Star Reviews" value={fmt(sc(49, period))} sub="Highest ratings"
          color="bg-green-600"
          onClick={() => open('5-Star Reviews', `${period}`,
            <div className="space-y-3">
              {REVIEWS_POOL.filter(r => r.rating >= 4).sort((a,b) => b.rating - a.rating).map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.customer}</span>
                    <Stars n={r.rating} />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{r.comment}"</p>
                  <p className="text-[11px] text-gray-400 mt-1.5">{r.order} · {r.product} · {r.date}</p>
                </div>
              ))}
            </div>
          )}
        />
        <ReportCard
          icon={ThumbsDown} label="1–2 Star Reviews" value={fmt(sc(8, period))} sub="Low ratings"
          color="bg-red-500"
          onClick={() => open('Low Ratings (1–2★)', `${period}`,
            <div className="space-y-3">
              {REVIEWS_POOL.filter(r => r.rating <= 2).sort((a,b) => a.rating - b.rating).map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.customer}</span>
                    <Stars n={r.rating} />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{r.comment}"</p>
                  <p className="text-[11px] text-gray-400 mt-1.5">{r.order} · {r.product} · {r.date}</p>
                </div>
              ))}
            </div>
          )}
        />
        <ReportCard
          icon={MessageSquare} label="Best Comments" value={fmt(sc(43, period))} sub="Positive sentiment"
          color="bg-teal-600"
          onClick={() => open('Best Customer Comments', `${period}`,
            <div className="space-y-3">
              {REVIEWS_POOL.filter(r => r.rating >= 4).sort((a,b) => b.rating - a.rating).map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-brand-700 dark:text-brand-400">
                    {r.customer[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.customer}</span>
                      <Stars n={r.rating} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{r.comment}"</p>
                    <p className="text-[11px] text-gray-400 mt-1">{r.product} · {r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        />
        <ReportCard
          icon={MessageSquare} label="Worst Comments" value={fmt(sc(8, period))} sub="Negative sentiment"
          color="bg-orange-500"
          onClick={() => open('Worst Customer Comments', `${period} — needs attention`,
            <div className="space-y-3">
              {REVIEWS_POOL.filter(r => r.rating <= 2).sort((a,b) => a.rating - b.rating).map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-red-600 dark:text-red-400">
                    {r.customer[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{r.customer}</span>
                      <Stars n={r.rating} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{r.comment}"</p>
                    <p className="text-[11px] text-gray-400 mt-1">{r.product} · {r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        />
      </div>

      {/* ── Section: Zone Analytics ── */}
      <SectionHeader icon={MapPin} title="Zone Analytics" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={MapPin} label="Highest Order Zone" value="Bandra" sub={`${sc(284, period)} orders`}
          color="bg-brand-600"
          onClick={() => open('Zones — Highest to Lowest Orders', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'zone',label:'Zone'},{key:'orders',label:'Orders'},{key:'revenue',label:'Revenue'},{key:'avgTime',label:'Avg Time'}]}
              rows={[...ZONES_POOL].sort((a,b) => b.orders - a.orders).map(z => ({ ...z, orders: sc(z.orders, period) }))}
            />
          )}
        />
        <ReportCard
          icon={MapPin} label="Lowest Order Zone" value="Navi Mumbai" sub={`${sc(54, period)} orders`}
          color="bg-gray-500"
          onClick={() => open('Zones — Lowest to Highest Orders', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'zone',label:'Zone'},{key:'orders',label:'Orders'},{key:'revenue',label:'Revenue'},{key:'avgTime',label:'Avg Time'}]}
              rows={[...ZONES_POOL].sort((a,b) => a.orders - b.orders).map(z => ({ ...z, orders: sc(z.orders, period) }))}
            />
          )}
        />
        <ReportCard
          icon={TrendingUp} label="Top Revenue Zone" value="Bandra" sub={rev(142000, period)}
          color="bg-green-600"
          onClick={() => open('Zone Revenue Ranking', `${period}`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'zone',label:'Zone'},{key:'orders',label:'Orders'},{key:'revenue',label:'Revenue'}]}
              rows={[...ZONES_POOL].sort((a,b) => b.orders - a.orders).map(z => ({ ...z, orders: sc(z.orders, period) }))}
            />
          )}
        />
        <ReportCard
          icon={Clock} label="Slowest Zone" value="Navi Mumbai" sub="58 min avg delivery"
          color="bg-red-400"
          onClick={() => open('Zones by Avg Delivery Time', `${period} — slowest first`,
            <ModalTable
              cols={[{key:'rank',label:'#'},{key:'zone',label:'Zone'},{key:'orders',label:'Orders'},{key:'avgTime',label:'Avg Delivery Time'}]}
              rows={[...ZONES_POOL].sort((a,b) => parseInt(b.avgTime) - parseInt(a.avgTime)).map(z => ({ ...z, orders: sc(z.orders, period) }))}
            />
          )}
        />
      </div>

      {/* ── Section: User Engagement ── */}
      <SectionHeader icon={Smartphone} title="User Engagement" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ReportCard
          icon={Download} label="App Installs" value={fmt(installs)} sub="New downloads"
          color="bg-green-600"
          onClick={() => open('App Installs', `${period} — ${installs} new installs`,
            <ModalTable
              cols={[{key:'user',label:'User'},{key:'device',label:'Device'},{key:'city',label:'City'},{key:'date',label:'Date'}]}
              rows={INSTALL_POOL}
            />
          )}
        />
        <ReportCard
          icon={Upload} label="App Uninstalls" value={fmt(uninstalls)} sub="Churned users"
          color="bg-red-500"
          onClick={() => open('App Uninstalls', `${period} — ${uninstalls} uninstalls`,
            <ModalTable
              cols={[{key:'user',label:'User'},{key:'device',label:'Device'},{key:'reason',label:'Reason'},{key:'date',label:'Date'}]}
              rows={UNINSTALL_POOL}
            />
          )}
        />
        <ReportCard
          icon={BarChart2} label="Most Visited Page" value="Home Listing" sub="3,842 visits"
          color="bg-purple-600"
          onClick={() => open('Most Visited Pages', `${period}`,
            <ModalTable
              cols={[{key:'page',label:'Page'},{key:'visits',label:'Total Visits'},{key:'unique',label:'Unique Users'},{key:'avgDuration',label:'Avg Duration'}]}
              rows={[...PAGES_POOL].sort((a,b) => b.visits - a.visits).map(p => ({
                ...p, visits: sc(p.visits, period), unique: sc(p.unique, period),
              }))}
            />
          )}
        />
        <ReportCard
          icon={Activity} label="Top Action" value="Add to Cart" sub="4,821 times"
          color="bg-brand-600"
          onClick={() => open('Most Performed Actions', `${period}`,
            <ModalTable
              cols={[{key:'action',label:'Action'},{key:'count',label:'Count'},{key:'users',label:'Unique Users'},{key:'_trend',label:'Trend'}]}
              rows={[...ACTIONS_POOL].sort((a,b) => b.count - a.count).map(a => ({
                ...a,
                count:  sc(a.count, period),
                users:  sc(a.users, period),
                _trend: <span className={`text-xs font-semibold ${trendColor(a.trend)}`}>{a.trend}</span>,
              }))}
            />
          )}
        />
      </div>

      {/* ── Modal ── */}
      <ReportModal report={modal} onClose={close} />
    </div>
  )
}
