import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as productService from '../services/productService';
import type { IProduct } from '../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Ürünler yüklenemedi');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Ürünler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🛍️ E-Commerce</h1>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-600">
              Ana Sayfa
            </button>
            <button onClick={() => navigate('/products')} className="text-blue-600 font-semibold">
              Ürünler
            </button>
            
            {user?.role === 'seller' && (
              <button onClick={() => navigate('/seller/dashboard')} className="text-gray-700 hover:text-blue-600">
                Satıcı Paneli
              </button>
            )}
            
            {user && (
              <>
                <span className="text-sm">{user.name}</span>
                <button onClick={handleLogout} className="btn-danger text-sm">
                  Çıkış
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Tüm Ürünler</h2>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Ürün Listesi */}
        {products.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600">Henüz ürün yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card hover:shadow-xl transition-shadow">
                {/* Ürün Görseli */}
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>

                {/* Ürün Bilgileri */}
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Kategori */}
                <div className="mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                {/* Fiyat ve Stok */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ₺{product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stok: {product.stock}
                  </span>
                </div>

                {/* Satıcı */}
                <div className="text-sm text-gray-500 mb-4">
                  Satıcı: <span className="font-semibold">{product.sellerName}</span>
                </div>

                {/* Butonlar */}
                <button className="btn-primary w-full">
                  Sepete Ekle (Yakında)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;