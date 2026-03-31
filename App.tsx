import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Splash = lazy(() => import('./pages/Splash'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const CountrySelect = lazy(() => import('./pages/CountrySelect'));
const Feed = lazy(() => import('./pages/Feed'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutConfirm = lazy(() => import('./pages/CheckoutConfirm'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Help = lazy(() => import('./pages/Help'));
const BookStylist = lazy(() => import('./pages/BookStylist'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Products = lazy(() => import('./pages/admin/Products'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const Bookings = lazy(() => import('./pages/admin/Bookings'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
    Loading...
  </div>
);

const wrap = (element: React.ReactNode) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreLayout>{wrap(<Splash />)}</StoreLayout>} />
        <Route path="/onboarding" element={<StoreLayout>{wrap(<Onboarding />)}</StoreLayout>} />
        <Route path="/country-select" element={<StoreLayout>{wrap(<CountrySelect />)}</StoreLayout>} />
        <Route path="/feed" element={<StoreLayout>{wrap(<Feed />)}</StoreLayout>} />
        <Route path="/about" element={<StoreLayout>{wrap(<About />)}</StoreLayout>} />
        <Route path="/privacy" element={<StoreLayout>{wrap(<Privacy />)}</StoreLayout>} />
        <Route path="/terms" element={<StoreLayout>{wrap(<Terms />)}</StoreLayout>} />
        <Route path="/help" element={<StoreLayout>{wrap(<Help />)}</StoreLayout>} />
        <Route path="/book-stylist" element={<StoreLayout>{wrap(<BookStylist />)}</StoreLayout>} />
        <Route path="/products/:category" element={<StoreLayout>{wrap(<ProductListing />)}</StoreLayout>} />
        <Route path="/product/:id" element={<StoreLayout>{wrap(<ProductDetail />)}</StoreLayout>} />
        <Route path="/cart" element={<StoreLayout>{wrap(<Cart />)}</StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout>{wrap(<ProtectedRoute><Checkout /></ProtectedRoute>)}</StoreLayout>} />
        <Route path="/checkout/confirm" element={<StoreLayout>{wrap(<ProtectedRoute><CheckoutConfirm /></ProtectedRoute>)}</StoreLayout>} />

        <Route path="/login" element={<StoreLayout>{wrap(<Login />)}</StoreLayout>} />
        <Route path="/signup" element={<StoreLayout>{wrap(<Signup />)}</StoreLayout>} />
        <Route path="/forgot-password" element={<StoreLayout>{wrap(<ForgotPassword />)}</StoreLayout>} />

        <Route path="/admin/login" element={<AdminLayout>{wrap(<AdminLogin />)}</AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Orders /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Bookings /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Customers /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Products /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/products/new" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><AddProduct /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Analytics /></ProtectedRoute>)}</AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout>{wrap(<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>)}</AdminLayout>} />

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
