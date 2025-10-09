import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as productService from '../../services/productService';
import type { IProduct } from '../../types';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Kendi ürünlerini yükle
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!token) return;
      
      setLoading(true);
      const response = await productService.getMyProducts(token);
      
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Ürünler yüklenemedi');
      }
      setLoading(false);
    };

    fetchMyProducts();
  }, [token]);

  // Ürün sil
  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    
    const confirm = window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`);
    if (!confirm) return;

    const response = await productService.deleteProduct(id, token);
    
    if (response.success) {
      alert('Ürün silindi!');
      setProducts(products.filter(p => p._id !== id));
    } else {
      alert(response.message || 'Ürün silinemedi');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Ürünleriniz yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏪 Satıcı Paneli</h1>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-600">
              Ana Sayfa
            </button>
            <button onClick={() => navigate('/products')} className="text-gray-700 hover:text-blue-600">
              Ürünler
            </button>
            <button onClick={() => navigate('/seller/dashboard')} className="text-blue-600 font-semibold">
              Panelim
            </button>
            
            <span className="text-sm">{user?.name}</span>
            <button onClick={handleLogout} className="btn-danger text-sm">
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Başlık ve Ürün Ekle Butonu */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Ürünlerim</h2>
          <button 
            onClick={() => navigate('/seller/add-product')}
            className="btn-primary"
          >
            ➕ Yeni Ürün Ekle
          </button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-700">Toplam Ürün</h3>
            <p className="text-4xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="card bg-green-50 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-gray-700">Aktif Ürün</h3>
            <p className="text-4xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="card bg-orange-50 border-2 border-orange-200">
            <h3 className="text-lg font-semibold text-gray-700">Toplam Stok</h3>
            <p className="text-4xl font-bold text-orange-600">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Ürün Listesi */}
        {products.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600 mb-4">Henüz ürün eklemediniz.</p>
            <button 
              onClick={() => navigate('/seller/add-product')}
              className="btn-primary"
            >
              İlk Ürününüzü Ekleyin
            </button>
          </div>
        ) : (
          <div className="card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Ürün</th>
                  <th className="text-left py-3 px-4">Kategori</th>
                  <th className="text-left py-3 px-4">Fiyat</th>
                  <th className="text-left py-3 px-4">Stok</th>
                  <th className="text-left py-3 px-4">Durum</th>
                  <th className="text-left py-3 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {product.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">₺{product.price}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      {product.isActive ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id, product.name)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;