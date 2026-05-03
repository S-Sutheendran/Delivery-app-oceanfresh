import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, ShoppingBag,
  TrendingUp, TrendingDown, XCircle, Star, Package, Clock,
  Award, AlertCircle, ChevronUp, ChevronDown,
} from 'lucide-react'
import Badge from '../components/ui/Badge'

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_MAP   = { delivered: 'success', in_transit: 'info', confirmed: 'brand', cancelled: 'error', pending: 'warning' }
const STATUS_LABEL = { delivered: 'Delivered', in_transit: 'In Transit', confirmed: 'Confirmed', cancelled: 'Cancelled', pending: 'Pending' }

function Stars({ n, size = 12 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(n) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
      ))}
    </span>
  )
}

// ── Customer detail data ──────────────────────────────────────────────────────
const CUSTOMER_DETAILS = {
  C001: {
    id: 'C001', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@email.com',
    joined: '15 Jan 2023', zone: 'Bandra', address: '14B Sea View Apt, Bandra West, Mumbai 400050',
    status: 'active', totalOrders: 24, completedOrders: 20, cancelledOrders: 2, pendingOrders: 2,
    totalSpent: 12450, avgOrderValue: 535,
    highestOrder: { id: '#ORD-1036', amount: 2100, items: 'Salmon Fillet × 3, Tiger Prawns × 2, Hilsa Fish × 1', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-1039', amount: 299,  items: 'Pomfret Fresh (1kg) × 1',                             date: '15 Jan 2024' },
    frequentProducts: [
      { name: 'Tiger Prawns (500g)',  count: 8, pct: 33 },
      { name: 'Salmon Fillet (300g)', count: 6, pct: 25 },
      { name: 'Pomfret Fresh (1kg)',  count: 5, pct: 21 },
      { name: 'Crab Whole (800g)',    count: 3, pct: 13 },
      { name: 'Squids (500g)',        count: 2, pct: 8  },
    ],
    orders: [
      { id: '#ORD-1042', date: '15 Jan 2024 14:32', status: 'delivered', amount: 649,   items: 2 },
      { id: '#ORD-1033', date: '12 Jan 2024 10:15', status: 'delivered', amount: 1100,  items: 2 },
      { id: '#ORD-1028', date: '08 Jan 2024 18:20', status: 'delivered', amount: 870,   items: 1 },
      { id: '#ORD-1020', date: '03 Jan 2024 12:40', status: 'cancelled', amount: 450,   items: 1 },
      { id: '#ORD-1015', date: '28 Dec 2023 19:15', status: 'delivered', amount: 780,   items: 2 },
      { id: '#ORD-0998', date: '22 Dec 2023 11:30', status: 'delivered', amount: 1340,  items: 4 },
      { id: '#ORD-0985', date: '15 Dec 2023 14:00', status: 'delivered', amount: 660,   items: 2 },
      { id: '#ORD-0970', date: '08 Dec 2023 09:45', status: 'cancelled', amount: 975,   items: 3 },
      { id: '#ORD-0952', date: '01 Dec 2023 20:10', status: 'delivered', amount: 540,   items: 1 },
      { id: '#ORD-0938', date: '24 Nov 2023 17:00', status: 'delivered', amount: 2100,  items: 6 },
    ],
    hourPattern: [0,0,0,0,0,0,0,1,2,3,2,3,2,2,1,1,2,2,3,4,3,2,1,0],
    dayPattern:  [2, 3, 3, 4, 5, 6, 4],
    avgRating: 4.5,
    reviews: [
      { orderId: '#ORD-1042', rating: 5, comment: 'Absolutely fresh! The prawns were amazing. Will definitely order again!',     date: '15 Jan 2024', product: 'Tiger Prawns (500g)' },
      { orderId: '#ORD-1033', rating: 5, comment: 'Lightning fast delivery. Salmon was perfectly packed.',                       date: '12 Jan 2024', product: 'Salmon Fillet (300g)' },
      { orderId: '#ORD-1015', rating: 4, comment: 'Good quality, will order again. Slight delay but fresh product.',             date: '28 Dec 2023', product: 'Crab Whole (800g)' },
      { orderId: '#ORD-0998', rating: 4, comment: 'Fresh and well-packed. Happy with the order.',                                date: '22 Dec 2023', product: 'Tiger Prawns (500g)' },
    ],
  },
  C002: {
    id: 'C002', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@email.com',
    joined: '10 Mar 2023', zone: 'Andheri', address: '5 Ocean Villa, Andheri East, Mumbai 400069',
    status: 'active', totalOrders: 18, completedOrders: 16, cancelledOrders: 1, pendingOrders: 1,
    totalSpent: 9200, avgOrderValue: 511,
    highestOrder: { id: '#ORD-1041', amount: 820, items: 'Salmon Fillet (300g) × 2', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0901', amount: 180, items: 'Dry Fish Mix (250g) × 1', date: '10 Nov 2023' },
    frequentProducts: [
      { name: 'Salmon Fillet (300g)', count: 7, pct: 39 },
      { name: 'Tiger Prawns (500g)',  count: 5, pct: 28 },
      { name: 'Pomfret Fresh (1kg)',  count: 4, pct: 22 },
      { name: 'Crab Whole (800g)',    count: 2, pct: 11 },
    ],
    orders: [
      { id: '#ORD-1041', date: '15 Jan 2024 14:10', status: 'in_transit', amount: 820,  items: 2 },
      { id: '#ORD-1022', date: '05 Jan 2024 13:00', status: 'delivered',  amount: 560,  items: 2 },
      { id: '#ORD-1010', date: '28 Dec 2023 18:30', status: 'delivered',  amount: 780,  items: 3 },
      { id: '#ORD-0990', date: '20 Dec 2023 11:00', status: 'delivered',  amount: 420,  items: 1 },
      { id: '#ORD-0975', date: '12 Dec 2023 14:45', status: 'cancelled',  amount: 350,  items: 1 },
    ],
    hourPattern: [0,0,0,0,0,0,0,0,1,2,3,3,4,3,2,2,2,3,4,3,2,1,0,0],
    dayPattern:  [3, 4, 3, 3, 4, 5, 3],
    avgRating: 4.2, reviews: [
      { orderId: '#ORD-1022', rating: 4, comment: 'Very fresh catch. Delivery was on time.',         date: '05 Jan 2024', product: 'Salmon Fillet (300g)' },
      { orderId: '#ORD-1010', rating: 5, comment: 'Outstanding quality! Best prawns I have had.',   date: '28 Dec 2023', product: 'Tiger Prawns (500g)' },
      { orderId: '#ORD-0990', rating: 3, comment: 'Packaging could be better. Product was okay.',   date: '20 Dec 2023', product: 'Pomfret Fresh (1kg)' },
    ],
  },
  C003: {
    id: 'C003', name: 'Amit Kumar', phone: '+91 76543 21098', email: 'amit@email.com',
    joined: '02 Nov 2022', zone: 'Dadar', address: '22 Gandhi Nagar, Dadar West, Mumbai 400028',
    status: 'active', totalOrders: 32, completedOrders: 29, cancelledOrders: 2, pendingOrders: 1,
    totalSpent: 18700, avgOrderValue: 584,
    highestOrder: { id: '#ORD-1040', amount: 1340, items: 'Tiger Prawns × 1, Crab × 2, Squids × 1, Hilsa × 1', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0850', amount: 200, items: 'Squids (500g) × 1', date: '05 Oct 2023' },
    frequentProducts: [
      { name: 'Tiger Prawns (500g)',  count: 12, pct: 37 },
      { name: 'Crab Whole (800g)',    count: 8,  pct: 25 },
      { name: 'Hilsa Fish (1kg)',     count: 6,  pct: 19 },
      { name: 'Salmon Fillet (300g)', count: 4,  pct: 13 },
      { name: 'Squids (500g)',        count: 2,  pct: 6  },
    ],
    orders: [
      { id: '#ORD-1040', date: '15 Jan 2024 13:55', status: 'confirmed', amount: 1340, items: 5 },
      { id: '#ORD-1018', date: '04 Jan 2024 12:30', status: 'delivered', amount: 980,  items: 3 },
      { id: '#ORD-1005', date: '27 Dec 2023 19:00', status: 'delivered', amount: 1200, items: 4 },
      { id: '#ORD-0988', date: '19 Dec 2023 10:15', status: 'delivered', amount: 740,  items: 2 },
      { id: '#ORD-0965', date: '11 Dec 2023 16:40', status: 'cancelled', amount: 450,  items: 1 },
    ],
    hourPattern: [0,0,0,0,0,0,1,1,2,3,4,4,5,4,3,2,2,3,4,5,4,3,2,1],
    dayPattern:  [4, 5, 6, 5, 6, 7, 5],
    avgRating: 4.7, reviews: [
      { orderId: '#ORD-1018', rating: 5, comment: 'Best seafood I have ever tasted! Super fresh.',     date: '04 Jan 2024', product: 'Tiger Prawns (500g)' },
      { orderId: '#ORD-1005', rating: 5, comment: 'Crab was fantastic. Delivery in under 30 minutes.', date: '27 Dec 2023', product: 'Crab Whole (800g)' },
      { orderId: '#ORD-0988', rating: 4, comment: 'Good quality fish, well packed.',                   date: '19 Dec 2023', product: 'Hilsa Fish (1kg)' },
    ],
  },
  C004: {
    id: 'C004', name: 'Sneha Reddy', phone: '+91 65432 10987', email: 'sneha@email.com',
    joined: '05 Dec 2023', zone: 'Kurla', address: '8 LBS Marg, Kurla West, Mumbai 400070',
    status: 'active', totalOrders: 5, completedOrders: 4, cancelledOrders: 0, pendingOrders: 1,
    totalSpent: 2100, avgOrderValue: 420,
    highestOrder: { id: '#ORD-1039', amount: 299, items: 'Pomfret Fresh (1kg) × 1', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0910', amount: 220, items: 'Squids (500g) × 1', date: '12 Dec 2023' },
    frequentProducts: [
      { name: 'Pomfret Fresh (1kg)',  count: 3, pct: 60 },
      { name: 'Squids (500g)',        count: 2, pct: 40 },
    ],
    orders: [
      { id: '#ORD-1039', date: '15 Jan 2024 13:20', status: 'delivered', amount: 299, items: 1 },
      { id: '#ORD-1021', date: '05 Jan 2024 17:00', status: 'delivered', amount: 540, items: 2 },
      { id: '#ORD-1003', date: '27 Dec 2023 12:00', status: 'delivered', amount: 420, items: 1 },
      { id: '#ORD-0980', date: '18 Dec 2023 19:30', status: 'delivered', amount: 621, items: 2 },
      { id: '#ORD-0910', date: '12 Dec 2023 11:00', status: 'pending',   amount: 220, items: 1 },
    ],
    hourPattern: [0,0,0,0,0,0,0,0,0,1,1,1,2,1,1,1,1,2,2,2,1,1,0,0],
    dayPattern:  [1, 1, 1, 2, 2, 2, 1],
    avgRating: 4.8, reviews: [
      { orderId: '#ORD-1039', rating: 5, comment: 'So fresh and delivered quickly!',         date: '15 Jan 2024', product: 'Pomfret Fresh (1kg)' },
      { orderId: '#ORD-1021', rating: 5, comment: 'Love this app. Always fresh products.',   date: '05 Jan 2024', product: 'Pomfret Fresh (1kg)' },
    ],
  },
  C005: {
    id: 'C005', name: 'Vikas Gupta', phone: '+91 54321 09876', email: 'vikas@email.com',
    joined: '10 Jan 2024', zone: 'Borivali', address: '31 SV Road, Borivali West, Mumbai 400092',
    status: 'inactive', totalOrders: 2, completedOrders: 1, cancelledOrders: 1, pendingOrders: 0,
    totalSpent: 850, avgOrderValue: 425,
    highestOrder: { id: '#ORD-0875', amount: 500, items: 'Tiger Prawns (500g) × 2', date: '20 Jan 2024' },
    lowestOrder:  { id: '#ORD-1038', amount: 350, items: 'Salmon Fillet (300g) × 1', date: '15 Jan 2024' },
    frequentProducts: [
      { name: 'Tiger Prawns (500g)',  count: 1, pct: 50 },
      { name: 'Salmon Fillet (300g)', count: 1, pct: 50 },
    ],
    orders: [
      { id: '#ORD-1038', date: '15 Jan 2024 12:45', status: 'cancelled', amount: 975, items: 3 },
      { id: '#ORD-0875', date: '12 Jan 2024 14:00', status: 'delivered', amount: 850, items: 2 },
    ],
    hourPattern: [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
    dayPattern:  [0, 1, 0, 1, 0, 0, 0],
    avgRating: 3.0, reviews: [
      { orderId: '#ORD-0875', rating: 3, comment: 'Delivery was late. Product was okay.',  date: '12 Jan 2024', product: 'Tiger Prawns (500g)' },
    ],
  },
  C006: {
    id: 'C006', name: 'Neha Singh', phone: '+91 43210 98765', email: 'neha@email.com',
    joined: '20 Aug 2022', zone: 'Bandra', address: '7 Turner Rd, Bandra East, Mumbai 400051',
    status: 'active', totalOrders: 47, completedOrders: 43, cancelledOrders: 3, pendingOrders: 1,
    totalSpent: 28300, avgOrderValue: 602,
    highestOrder: { id: '#ORD-1037', amount: 2800, items: 'Tiger Prawns × 4, Salmon × 3, Crab × 2', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0802', amount: 199, items: 'Dry Fish Mix (250g) × 1', date: '30 Sep 2022' },
    frequentProducts: [
      { name: 'Tiger Prawns (500g)',  count: 18, pct: 38 },
      { name: 'Salmon Fillet (300g)', count: 12, pct: 26 },
      { name: 'Crab Whole (800g)',    count: 9,  pct: 19 },
      { name: 'Pomfret Fresh (1kg)',  count: 5,  pct: 11 },
      { name: 'Hilsa Fish (1kg)',     count: 3,  pct: 6  },
    ],
    orders: [
      { id: '#ORD-1037', date: '15 Jan 2024 12:10', status: 'delivered', amount: 560,  items: 2 },
      { id: '#ORD-1025', date: '06 Jan 2024 11:00', status: 'delivered', amount: 1450, items: 5 },
      { id: '#ORD-1012', date: '29 Dec 2023 16:30', status: 'delivered', amount: 980,  items: 3 },
      { id: '#ORD-0993', date: '21 Dec 2023 09:15', status: 'cancelled', amount: 720,  items: 2 },
      { id: '#ORD-0978', date: '13 Dec 2023 14:00', status: 'delivered', amount: 1240, items: 4 },
    ],
    hourPattern: [0,0,0,0,0,0,0,1,3,4,5,6,5,4,3,2,3,4,5,6,5,3,2,1],
    dayPattern:  [5, 7, 6, 8, 9, 10, 7],
    avgRating: 4.6, reviews: [
      { orderId: '#ORD-1037', rating: 5, comment: 'As always, fresh and fast delivery!',          date: '15 Jan 2024', product: 'Tiger Prawns (500g)' },
      { orderId: '#ORD-1025', rating: 4, comment: 'Consistent quality. Love shopping here.',      date: '06 Jan 2024', product: 'Salmon Fillet (300g)' },
      { orderId: '#ORD-1012', rating: 5, comment: 'Best crab in the city, hands down!',           date: '29 Dec 2023', product: 'Crab Whole (800g)' },
    ],
  },
  C007: {
    id: 'C007', name: 'Rohit Mehra', phone: '+91 32109 87654', email: 'rohit@email.com',
    joined: '14 Jun 2023', zone: 'Malad', address: '15 Malad Link Rd, Malad West, Mumbai 400064',
    status: 'blocked', totalOrders: 11, completedOrders: 7, cancelledOrders: 3, pendingOrders: 1,
    totalSpent: 6400, avgOrderValue: 582,
    highestOrder: { id: '#ORD-1036', amount: 2100, items: 'Salmon Fillet × 3, Tiger Prawns × 2', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0921', amount: 299, items: 'Pomfret Fresh (1kg) × 1', date: '15 Jul 2023' },
    frequentProducts: [
      { name: 'Salmon Fillet (300g)', count: 5, pct: 46 },
      { name: 'Tiger Prawns (500g)',  count: 4, pct: 36 },
      { name: 'Hilsa Fish (1kg)',     count: 2, pct: 18 },
    ],
    orders: [
      { id: '#ORD-1036', date: '15 Jan 2024 11:30', status: 'delivered', amount: 2100, items: 6 },
      { id: '#ORD-1014', date: '02 Jan 2024 19:00', status: 'cancelled', amount: 660,  items: 2 },
      { id: '#ORD-0996', date: '19 Dec 2023 13:45', status: 'delivered', amount: 1100, items: 3 },
      { id: '#ORD-0960', date: '10 Dec 2023 10:20', status: 'cancelled', amount: 540,  items: 2 },
      { id: '#ORD-0945', date: '02 Dec 2023 16:00', status: 'cancelled', amount: 820,  items: 2 },
    ],
    hourPattern: [0,0,0,0,0,0,0,0,0,1,1,2,2,2,1,1,1,2,3,3,2,1,0,0],
    dayPattern:  [1, 2, 1, 2, 2, 2, 1],
    avgRating: 2.3, reviews: [
      { orderId: '#ORD-1036', rating: 2, comment: 'Delivery was very late. Fish smelled off.',        date: '15 Jan 2024', product: 'Salmon Fillet (300g)' },
      { orderId: '#ORD-0996', rating: 3, comment: 'Okay product, could be fresher.',                 date: '19 Dec 2023', product: 'Tiger Prawns (500g)' },
    ],
  },
  C008: {
    id: 'C008', name: 'Anjali Desai', phone: '+91 21098 76543', email: 'anjali@email.com',
    joined: '18 Sep 2023', zone: 'Thane', address: '3 Vartak Nagar, Thane West, Mumbai 400606',
    status: 'active', totalOrders: 8, completedOrders: 6, cancelledOrders: 1, pendingOrders: 1,
    totalSpent: 4200, avgOrderValue: 525,
    highestOrder: { id: '#ORD-1035', amount: 900, items: 'Tiger Prawns × 2, Crab × 1', date: '15 Jan 2024' },
    lowestOrder:  { id: '#ORD-0948', amount: 220, items: 'Squids (500g) × 1', date: '25 Sep 2023' },
    frequentProducts: [
      { name: 'Pomfret Fresh (1kg)',  count: 4, pct: 50 },
      { name: 'Tiger Prawns (500g)',  count: 2, pct: 25 },
      { name: 'Crab Whole (800g)',    count: 1, pct: 13 },
      { name: 'Squids (500g)',        count: 1, pct: 12 },
    ],
    orders: [
      { id: '#ORD-1035', date: '15 Jan 2024 11:05', status: 'pending',   amount: 450,  items: 1 },
      { id: '#ORD-1019', date: '05 Jan 2024 14:20', status: 'delivered', amount: 780,  items: 2 },
      { id: '#ORD-1004', date: '27 Dec 2023 11:30', status: 'delivered', amount: 630,  items: 2 },
      { id: '#ORD-0982', date: '18 Dec 2023 09:00', status: 'cancelled', amount: 420,  items: 1 },
      { id: '#ORD-0948', date: '25 Sep 2023 14:00', status: 'delivered', amount: 220,  items: 1 },
    ],
    hourPattern: [0,0,0,0,0,0,0,0,1,2,2,2,1,1,1,1,1,1,1,1,1,0,0,0],
    dayPattern:  [1, 2, 2, 2, 2, 2, 1],
    avgRating: 4.3, reviews: [
      { orderId: '#ORD-1019', rating: 4, comment: 'Great quality, will order again!',        date: '05 Jan 2024', product: 'Pomfret Fresh (1kg)' },
      { orderId: '#ORD-1004', rating: 5, comment: 'Tiger prawns were amazingly fresh.',      date: '27 Dec 2023', product: 'Tiger Prawns (500g)' },
    ],
  },
}

const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS  = [6, 8, 10, 12, 14, 16, 18, 20, 22]

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={17} className="text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{children}</h3>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CustomerDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const c          = CUSTOMER_DETAILS[id]

  if (!c) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={40} className="text-gray-300" />
        <p className="text-gray-400">Customer not found.</p>
        <button onClick={() => navigate('/customers')} className="btn-secondary">← Back to Customers</button>
      </div>
    )
  }

  const statusVariant = { active: 'success', inactive: 'gray', blocked: 'error' }
  const maxHour = Math.max(...c.hourPattern, 1)
  const maxDay  = Math.max(...c.dayPattern,  1)

  return (
    <div className="space-y-6 pb-8">

      {/* ── Back + page title ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{c.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer since {c.joined}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
        </div>
      </div>

      {/* ── Profile card ── */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-bold text-brand-700 dark:text-brand-400">
            {c.name[0]}
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{c.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{c.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{c.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Joined {c.joined} · Zone: {c.zone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag}   label="Total Orders"   value={c.totalOrders}                                            color="bg-brand-600"  sub={`${c.completedOrders} completed`} />
        <StatCard icon={TrendingUp}    label="Total Spent"    value={`₹${c.totalSpent.toLocaleString('en-IN')}`}              color="bg-green-600"  sub={`Avg ₹${c.avgOrderValue}/order`} />
        <StatCard icon={XCircle}       label="Cancelled"      value={c.cancelledOrders}                                        color="bg-red-500"    sub={`${Math.round((c.cancelledOrders/c.totalOrders)*100)}% cancel rate`} />
        <StatCard icon={Package}       label="Items Ordered"  value={c.orders.reduce((s, o) => s + o.items, 0)}               color="bg-purple-600" sub="Total line items" />
      </div>

      {/* ── Order value highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={14} className="text-amber-500" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Highest Order</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{c.highestOrder.amount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-mono mt-0.5">{c.highestOrder.id}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{c.highestOrder.items}</p>
          <p className="text-[11px] text-gray-400 mt-1">{c.highestOrder.date}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <ChevronDown size={14} className="text-gray-400" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lowest Order</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{c.lowestOrder.amount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-mono mt-0.5">{c.lowestOrder.id}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{c.lowestOrder.items}</p>
          <p className="text-[11px] text-gray-400 mt-1">{c.lowestOrder.date}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating Summary</p>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.avgRating.toFixed(1)}</p>
            <Stars n={c.avgRating} size={14} />
          </div>
          <p className="text-xs text-gray-400">{c.reviews.length} reviews left</p>
          <div className="mt-2 space-y-1">
            {[5,4,3,2,1].map(star => {
              const cnt = c.reviews.filter(r => r.rating === star).length
              const pct = c.reviews.length > 0 ? (cnt / c.reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-4">{star}★</span>
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 w-3 text-right">{cnt}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Frequent products ── */}
      <div className="card p-5">
        <SectionTitle>Frequently Ordered Products</SectionTitle>
        <div className="space-y-3">
          {c.frequentProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-lg flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">{p.count}× ordered</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Order timeline ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <SectionTitle>Order Timeline</SectionTitle>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {c.orders.map((o, i) => (
            <div key={o.id} className="flex items-center gap-3 px-5 py-3">
              {/* Timeline dot */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  o.status === 'delivered' ? 'bg-green-500' :
                  o.status === 'cancelled' ? 'bg-red-400' :
                  o.status === 'pending'   ? 'bg-amber-400' : 'bg-brand-500'
                }`} />
                {i < c.orders.length - 1 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-1" />}
              </div>
              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">{o.id}</span>
                  <Badge variant={STATUS_MAP[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{o.date} · {o.items} item{o.items !== 1 ? 's' : ''}</p>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">
                ₹{o.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Order time patterns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hour of day */}
        <div className="card p-5">
          <SectionTitle>Orders by Hour of Day</SectionTitle>
          <div className="flex items-end gap-1 h-20">
            {c.hourPattern.map((v, h) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`w-full rounded-t transition-all ${v > 0 ? 'bg-brand-500 dark:bg-brand-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                  style={{ height: `${v > 0 ? Math.max((v / maxHour) * 100, 10) : 4}%` }}
                />
                {h % 3 === 0 && (
                  <span className="text-[9px] text-gray-400">{h}h</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Peak hour: <strong className="text-gray-600 dark:text-gray-300">{c.hourPattern.indexOf(Math.max(...c.hourPattern))}:00</strong>
          </p>
        </div>

        {/* Day of week */}
        <div className="card p-5">
          <SectionTitle>Orders by Day of Week</SectionTitle>
          <div className="flex items-end gap-2 h-20">
            {c.dayPattern.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${v > 0 ? 'bg-teal-500 dark:bg-teal-600' : 'bg-gray-100 dark:bg-gray-700'}`}
                  style={{ height: `${v > 0 ? Math.max((v / maxDay) * 100, 10) : 4}%` }}
                />
                <span className="text-[10px] text-gray-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Busiest day: <strong className="text-gray-600 dark:text-gray-300">{DAYS[c.dayPattern.indexOf(Math.max(...c.dayPattern))]}</strong>
          </p>
        </div>
      </div>

      {/* ── Reviews & Feedback ── */}
      {c.reviews.length > 0 && (
        <div className="card p-5">
          <SectionTitle>Reviews & Feedback</SectionTitle>
          <div className="space-y-4">
            {c.reviews.sort((a, b) => b.rating - a.rating).map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                r.rating >= 4
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800'
                  : r.rating <= 2
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'
                  : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <Stars n={r.rating} size={13} />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{r.product}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400">{r.orderId}</p>
                    <p className="text-[11px] text-gray-400">{r.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
