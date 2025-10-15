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
  const [view, setView] = useState<'grid' | 'list'>('grid'); // Görünüm modu
  const { token, user } = useAuth();
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
      setProducts(products.filter(p => p._id !== id));
      // Başarı bildirimi (toast kullanabilirsin)
    } else {
      alert(response.message || 'Ürün silinemedi');
    }
  };

  // İstatistikler
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    lowStock: products.filter(p => p.stock < 10 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Container className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Satıcı Paneliniz
              </h1>
              <p className="text-blue-100">
                Hoş geldiniz, <span className="font-semibold">{user?.name}</span>
              </p>
            </div>
            <button 
              onClick={() => navigate('/seller/add-product')}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
            >
              <span className="text-xl">+</span>
              Yeni Ürün Ekle
            </button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Toplam Ürün */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Toplam Ürün</span>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.active} aktif, {stats.inactive} pasif
            </div>
          </div>

          {/* Toplam Stok */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Toplam Stok</span>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalStock}</div>
            <div className="text-xs text-gray-500 mt-1">
              Tüm ürünlerdeki toplam
            </div>
          </div>

          {/* Düşük Stok */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Düşük Stok</span>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.lowStock}</div>
            <div className="text-xs text-gray-500 mt-1">
              10'dan az stoklu ürün
            </div>
          </div>

          {/* Tükenen */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Stok Bitti</span>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🚫</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.outOfStock}</div>
            <div className="text-xs text-gray-500 mt-1">
              Yeniden stoklama gerekli
            </div>
          </div>
        </div>

        {/* Ürünler Bölümü */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Başlık ve Görünüm Seçici */}
          <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ürünlerim</h2>
              <p className="text-gray-600 text-sm mt-1">
                Tüm ürünlerinizi buradan yönetin
              </p>
            </div>
            
            {/* Görünüm Modu */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  view === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">◫</span>
                Kart
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  view === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">☰</span>
                Liste
              </button>
            </div>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="mx-6 mt-6 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Ürün Listesi/Grid */}
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz Ürün Eklemediniz
              </h3>
              <p className="text-gray-600 mb-6">
                İlk ürününüzü ekleyerek satışa başlayın
              </p>
              <button 
                onClick={() => navigate('/seller/add-product')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                İlk Ürünü Ekle
              </button>
            </div>
          ) : view === 'grid' ? (
            /* GRID GÖRÜNÜMÜ */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Görsel */}
                  <div className="relative bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                    
                    {/* Durum Badge */}
                    <div className="absolute top-3 right-3">
                      {product.isActive ? (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                          Pasif
                        </span>
                      )}
                    </div>

                    {/* Stok Uyarısı */}
                    {product.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        Tükendi
                      </div>
                    )}
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        Az Stok
                      </div>
                    )}
                  </div>

                  {/* Bilgiler */}
                  <div className="p-4">
                    {/* Kategori */}
                    <div className="mb-2">
                      <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                        {product.category}
                      </span>
                    </div>

                    {/* İsim */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>

                    {/* Fiyat ve Stok */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ₺{product.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        Stok: <span className="font-semibold">{product.stock}</span>
                      </div>
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LİSTE GÖRÜNÜMÜ */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Ürün</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Kategori</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Fiyat</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Stok</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Durum</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                      {/* Ürün */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">📦</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-6">
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Fiyat */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900">₺{product.price}</span>
                      </td>

                      {/* Stok */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{product.stock}</span>
                          {product.stock === 0 && (
                            <span className="text-red-500 text-xs">●</span>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="text-orange-500 text-xs">●</span>
                          )}
                        </div>
                      </td>

                      {/* Durum */}
                      <td className="py-4 px-6">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                            Pasif
                          </span>
                        )}
                      </td>

                      {/* İşlemler */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition text-sm"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition text-sm"
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
      </Container>
    </Layout>
  );
};

export default Dashboard;