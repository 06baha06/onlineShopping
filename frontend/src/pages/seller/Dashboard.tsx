// frontend/src/pages/seller/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as productService from '../../services/productService';
import type { IProduct } from '../../types';
import Layout from '../../components/layout/Layout';
import Container from '../../components/common/Container';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-lg text-gray-600">Ürünleriniz yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-8">
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
          <div className="card overflow-x-auto">
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
      </Container>
    </Layout>
  );
};

export default Dashboard;