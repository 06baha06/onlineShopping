import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Basit Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🛍️ E-Commerce</h1>
          
          <div className="flex items-center gap-4">
            <span>Hoş geldin, {user?.name}</span>
            <span className="text-sm text-gray-500">({user?.role})</span>
            <button onClick={handleLogout} className="btn-danger">
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Ana Sayfa</h2>
        
        {/* Buyer için */}
        {user?.role === 'buyer' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">🛒 Alıcı Paneli</h3>
            <p className="mb-4">Ürünlere göz atabilirsin.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Ürünlere Git
            </button>
          </div>
        )}

        {/* Seller için */}
        {user?.role === 'seller' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">🏪 Satıcı Paneli</h3>
            <p className="mb-4">Ürünlerini yönetebilirsin.</p>
            <button 
              onClick={() => navigate('/seller/dashboard')}
              className="btn-primary"
            >
              Satıcı Paneline Git
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;