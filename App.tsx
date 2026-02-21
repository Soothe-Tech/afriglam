import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { AdminLayout } from './components/AdminLayout';

// Store Pages
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import CountrySelect from './pages/CountrySelect';
import Feed from './pages/Feed';
import ProductDetail from './pages/ProductDetail';
import ProductListing from './pages/ProductListing';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutConfirm from './pages/CheckoutConfirm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import BookStylist from './pages/BookStylist';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Store Routes */}
        <Route path="/" element={<StoreLayout><Splash /></StoreLayout>} />
        <Route path="/onboarding" element={<StoreLayout><Onboarding /></StoreLayout>} />
        <Route path="/country-select" element={<StoreLayout><CountrySelect /></StoreLayout>} />
        <Route path="/feed" element={<StoreLayout><Feed /></StoreLayout>} />
        <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
        <Route path="/privacy" element={<StoreLayout><Privacy /></StoreLayout>} />
        <Route path="/terms" element={<StoreLayout><Terms /></StoreLayout>} />
        <Route path="/help" element={<StoreLayout><Help /></StoreLayout>} />
        <Route path="/book-stylist" element={<StoreLayout><BookStylist /></StoreLayout>} />
        <Route path="/products/:category" element={<StoreLayout><ProductListing /></StoreLayout>} />
        <Route path="/product/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout><ProtectedRoute><Checkout /></ProtectedRoute></StoreLayout>} />
        <Route path="/checkout/confirm" element={<StoreLayout><ProtectedRoute><CheckoutConfirm /></ProtectedRoute></StoreLayout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
        <Route path="/signup" element={<StoreLayout><Signup /></StoreLayout>} />
        <Route path="/forgot-password" element={<StoreLayout><ForgotPassword /></StoreLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout><ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><ProtectedRoute requireAdmin><Orders /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><ProtectedRoute requireAdmin><Bookings /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><ProtectedRoute requireAdmin><Customers /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><ProtectedRoute requireAdmin><Products /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/products/new" element={<AdminLayout><ProtectedRoute requireAdmin><AddProduct /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><ProtectedRoute requireAdmin><Analytics /></ProtectedRoute></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><ProtectedRoute requireAdmin><Settings /></ProtectedRoute></AdminLayout>} />
        
        {/* Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;