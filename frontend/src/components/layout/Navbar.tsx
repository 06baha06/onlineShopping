// frontend/src/components/layout/Navbar.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Container from '../common/Container';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <Container>
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            E-Commerce
          </Link>

          {/* Desktop Menü */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Ortak Linkler */}
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Ürünler
            </Link>

            {/* Giriş YAPMADIYSA */}
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Giriş Yap
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <>
                {/* Giriş YAPTIYSA */}
                
                {/* Seller ise Dashboard Linki */}
                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Satıcı Paneli
                  </Link>
                )}

                {/* Kullanıcı Bilgileri */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.role === 'seller' ? '🏪 Satıcı' : '🛒 Alıcı'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Çıkış
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menü */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menü (Açılır) */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              to="/products" 
              className="block py-2 text-gray-700 hover:text-blue-600 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ürünler
            </Link>

            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <>
                {user.role === 'seller' && (
                  <Link 
                    to="/seller/dashboard" 
                    className="block py-2 text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Satıcı Paneli
                  </Link>
                )}
                <div className="py-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {user.role === 'seller' ? '🏪 Satıcı' : '🛒 Alıcı'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;