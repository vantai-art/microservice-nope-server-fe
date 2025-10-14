// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './contexts/AppContext';

// Import Components
import Header from './components/Header';
import StaffPage from './pages/staff/StaffPage';

// Import User Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';

// Import Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useAppContext();
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
}

// Admin Routes Wrapper
function AdminRoutes() {
  const { setIsAdminAuthenticated } = useAppContext();
  const [currentAdminPage, setCurrentAdminPage] = React.useState('dashboard');

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
  };

  const renderAdminPage = () => {
    switch (currentAdminPage) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'categories': return <AdminCategories />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'blog': return <AdminBlog />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentAdminPage}
      setCurrentPage={setCurrentAdminPage}
      onLogout={handleLogout}
    >
      {renderAdminPage()}
    </AdminLayout>
  );
}

function App() {
  const { isAdminAuthenticated } = useAppContext();

  return (
    <div className="App">
      <Routes>
        {/* User Routes - Có Header */}
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
          </>
        } />

        <Route path="/menu" element={
          <>
            <Header />
            <MenuPage />
          </>
        } />

        <Route path="/services" element={
          <>
            <Header />
            <ServicesPage />
          </>
        } />

        <Route path="/blog" element={
          <>
            <Header />
            <BlogPage />
          </>
        } />

        <Route path="/about" element={
          <>
            <Header />
            <AboutPage />
          </>
        } />

        <Route path="/shop" element={
          <>
            <Header />
            <ShopPage />
          </>
        } />

        <Route path="/contact" element={
          <>
            <Header />
            <ContactPage />
          </>
        } />

        {/* Staff Route - KHÔNG có Header */}
        <Route path="/staff" element={<StaffPage />} />

        {/* Admin Routes - KHÔNG có Header */}
        <Route path="/admin/login" element={
          isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <>
            <Header />
            <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">Trang không tồn tại</p>
                <a href="/" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded">
                  Về Trang Chủ
                </a>
              </div>
            </div>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;