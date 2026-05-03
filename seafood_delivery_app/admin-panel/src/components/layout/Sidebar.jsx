import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  BarChart2, ShoppingBag, Users, Truck, MapPin, Car, UtensilsCrossed,
  Settings, Cog, ChevronDown, ChevronRight, Fish, Clock, BadgePercent,
  FileText, Image, MessageSquare, CreditCard, Shield, Sliders, Palette,
  Phone, UserCheck, AlertCircle, XCircle, Tag, LayoutGrid, X
} from 'lucide-react'

const menu = [
  { id: 'insights',  label: 'Insights',             icon: BarChart2,       path: '/insights' },
  { id: 'orders',    label: 'Orders',                icon: ShoppingBag,     path: '/orders' },
  { id: 'customers', label: 'Customers',             icon: Users,           path: '/customers' },
  { id: 'delivery',  label: 'Delivery Management',   icon: Truck,           path: '/delivery' },
  { id: 'zones',     label: 'Zone Management',       icon: MapPin,          path: '/zones' },
  {
    id: 'fleet', label: 'Fleet Management', icon: Car,
    children: [
      { id: 'drivers',         label: 'Delivery Person',        icon: Users,       path: '/fleet/drivers' },
      { id: 'verify',          label: 'Verify Delivery Person', icon: UserCheck,   path: '/fleet/verify' },
      { id: 'driver-reasons',  label: 'Driver Reasons',         icon: AlertCircle, path: '/fleet/driver-reasons' },
      { id: 'cancellation',    label: 'Cancellation Reasons',   icon: XCircle,     path: '/fleet/cancellation' },
    ],
  },
  {
    id: 'menu', label: 'Menu Management', icon: UtensilsCrossed,
    children: [
      { id: 'foods',       label: 'Foods',                  icon: Fish,       path: '/menu/foods' },
      { id: 'tags',        label: 'Item Tags',              icon: Tag,        path: '/menu/tags' },
      { id: 'categories',  label: 'Categories',             icon: LayoutGrid, path: '/menu/categories' },
    ],
  },
  {
    id: 'service', label: 'Service Management', icon: Settings,
    children: [
      { id: 'ordering-time',  label: 'Ordering Time',          icon: Clock,          path: '/service/ordering-time' },
      { id: 'payouts',        label: 'Payout Request',         icon: CreditCard,     path: '/service/payouts' },
      { id: 'banners',        label: 'Banner',                 icon: Image,          path: '/service/banners' },
      { id: 'documents',      label: 'Documents',              icon: FileText,       path: '/service/documents' },
      { id: 'coupons',        label: 'Coupon Offers',          icon: BadgePercent,   path: '/service/coupons' },
      { id: 'testimonials',   label: 'Testimonials',           icon: MessageSquare,  path: '/service/testimonials' },
    ],
  },
  {
    id: 'system', label: 'System Management', icon: Cog,
    children: [
      { id: 'finance',      label: 'Finance Settings',   icon: CreditCard,  path: '/system/finance' },
      { id: 'policy',       label: 'Policy Settings',    icon: Shield,      path: '/system/policy' },
      { id: 'general',      label: 'General Settings',   icon: Sliders,     path: '/system/general' },
      { id: 'business',     label: 'Business Settings',  icon: Settings,    path: '/system/business' },
      { id: 'app-settings', label: 'App Settings',       icon: Cog,         path: '/system/app-settings' },
      { id: 'app-theme',    label: 'App Theme',          icon: Palette,     path: '/system/app-theme' },
      { id: 'contact',      label: 'Contact Us',         icon: Phone,       path: '/system/contact' },
    ],
  },
]

function NavItem({ item, depth = 0 }) {
  const location = useLocation()
  const isActiveChild = item.children?.some(c => location.pathname.startsWith(c.path))
  const [open, setOpen] = useState(isActiveChild)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActiveChild
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <item.icon size={16} className="shrink-0" />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="ml-3 mt-0.5 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
            {item.children.map(child => (
              <NavLink
                key={child.id}
                to={child.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
                <child.icon size={14} className="shrink-0" />
                <span className="truncate">{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <item.icon size={16} className="shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-lg">
              🐟
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">OceanFresh</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {menu.map(item => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-600">v1.0.0 © OceanFresh</p>
        </div>
      </aside>
    </>
  )
}
