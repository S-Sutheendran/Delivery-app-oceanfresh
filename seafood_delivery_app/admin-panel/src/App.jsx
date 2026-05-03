import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Insights from './pages/Insights'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import DeliveryManagement from './pages/DeliveryManagement'
import ZoneManagement from './pages/ZoneManagement'
import DeliveryPerson from './pages/fleet/DeliveryPerson'
import VerifyDeliveryPerson from './pages/fleet/VerifyDeliveryPerson'
import DriverReasons from './pages/fleet/DriverReasons'
import CancellationReasons from './pages/fleet/CancellationReasons'
import Foods from './pages/menu/Foods'
import ItemTags from './pages/menu/ItemTags'
import Categories from './pages/menu/Categories'
import OrderingTime from './pages/service/OrderingTime'
import PayoutRequest from './pages/service/PayoutRequest'
import Banner from './pages/service/Banner'
import Documents from './pages/service/Documents'
import CouponOffers from './pages/service/CouponOffers'
import Testimonials from './pages/service/Testimonials'
import FinanceSettings from './pages/system/FinanceSettings'
import PolicySettings from './pages/system/PolicySettings'
import GeneralSettings from './pages/system/GeneralSettings'
import BusinessSettings from './pages/system/BusinessSettings'
import AppSettings from './pages/system/AppSettings'
import AppTheme from './pages/system/AppTheme'
import ContactUs from './pages/system/ContactUs'
import CustomerDetail from './pages/CustomerDetail'
import { useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/insights" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/insights" replace />} />
        <Route path="insights" element={<Insights />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="delivery" element={<DeliveryManagement />} />
        <Route path="zones" element={<ZoneManagement />} />
        <Route path="fleet/drivers" element={<DeliveryPerson />} />
        <Route path="fleet/verify" element={<VerifyDeliveryPerson />} />
        <Route path="fleet/driver-reasons" element={<DriverReasons />} />
        <Route path="fleet/cancellation" element={<CancellationReasons />} />
        <Route path="menu/foods" element={<Foods />} />
        <Route path="menu/tags" element={<ItemTags />} />
        <Route path="menu/categories" element={<Categories />} />
        <Route path="service/ordering-time" element={<OrderingTime />} />
        <Route path="service/payouts" element={<PayoutRequest />} />
        <Route path="service/banners" element={<Banner />} />
        <Route path="service/documents" element={<Documents />} />
        <Route path="service/coupons" element={<CouponOffers />} />
        <Route path="service/testimonials" element={<Testimonials />} />
        <Route path="system/finance" element={<FinanceSettings />} />
        <Route path="system/policy" element={<PolicySettings />} />
        <Route path="system/general" element={<GeneralSettings />} />
        <Route path="system/business" element={<BusinessSettings />} />
        <Route path="system/app-settings" element={<AppSettings />} />
        <Route path="system/app-theme" element={<AppTheme />} />
        <Route path="system/contact" element={<ContactUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/insights" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
