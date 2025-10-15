// frontend/src/pages/Products.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';
import type { IProduct } from '../types';
import Layout from '../components/layout/Layout';
import Container from '../components/common/Container';

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Yeni: Sıralama
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedCategory = searchParams.get('category') 
    ? decodeURIComponent(searchParams.get('category')!)
    : null;

  // Kategoriler
  const categories = [
    { name: 'Tümü', icon: '🏪' },
    { name: 'Elektronik', icon: '📱' },
    { name: 'Giyim', icon: '👕' },
    { name: 'Ev & Yaşam', icon: '🏠' },
    { name: 'Spor & Outdoor', icon: '⚽' },
    { name: 'Kitap & Hobi', icon: '📚' },
    { name: 'Kozmetik', icon: '💄' },
    { name: 'Oyuncak', icon: '🧸' },
    { name: 'Diğer', icon: '📦' }
  ];

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setError(response.message || 'Ürünler yüklenemedi');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filtreleme ve Sıralama
  useEffect(() => {
    let filtered = products;

    // Kategori filtresi
    if (selectedCategory && selectedCategory !== 'Tümü') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sellerName.toLowerCase().includes(query)
      );
    }

    // Sıralama
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // newest (default)
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products, sortBy]);

  // Kategori değiştir
  const handleCategoryChange = (category: string) => {
    if (category === 'Tümü') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  // Arama temizle
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Ürünler yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <Container className="py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tüm Ürünler
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
            {selectedCategory && selectedCategory !== 'Tümü' && (
              <span className="font-semibold"> - {selectedCategory}</span>
            )}
          </p>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SOL TARAF - Filtreler (Sidebar) */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {/* Arama */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ara
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Kategoriler */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Kategoriler
                </label>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-3 ${
                        (selectedCategory === category.name || (!selectedCategory && category.name === 'Tümü'))
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                      {(selectedCategory === category.name || (!selectedCategory && category.name === 'Tümü')) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sırala
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition font-medium"
                >
                  <option value="newest">Yeni Eklenenler</option>
                  <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                  <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                  <option value="name">İsme Göre (A-Z)</option>
                </select>
              </div>

              {/* Aktif Filtreler */}
              {(searchQuery || (selectedCategory && selectedCategory !== 'Tümü')) && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Aktif Filtreler
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        navigate('/products');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Temizle
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchQuery && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                        <span>"{searchQuery}"</span>
                        <button
                          onClick={handleClearSearch}
                          className="ml-auto hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {selectedCategory && selectedCategory !== 'Tümü' && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                        <span>{selectedCategory}</span>
                        <button
                          onClick={() => navigate('/products')}
                          className="ml-auto hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* SAĞ TARAF - Ürün Grid */}
          <main className="flex-1">
            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Ürünler */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ürün Bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `"${searchQuery}" için sonuç bulunamadı.` 
                    : selectedCategory 
                      ? `"${selectedCategory}" kategorisinde ürün yok.`
                      : 'Henüz ürün eklenmemiş.'}
                </p>
                {(searchQuery || selectedCategory) && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      navigate('/products');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Tüm Ürünlere Dön
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 group"
                  >
                    {/* Ürün Görseli */}
                    <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                      <div className="text-8xl group-hover:scale-110 transition-transform">
                        📦
                      </div>
                      
                      {/* Stok Durumu Badge */}
                      {product.stock === 0 ? (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                          Tükendi
                        </div>
                      ) : product.stock < 10 && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                          Son {product.stock} Ürün
                        </div>
                      )}

                      {/* Kategori Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                        {product.category}
                      </div>
                    </div>

                    {/* Ürün Bilgileri */}
                    <div className="p-5">
                      {/* Ürün İsmi */}
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition min-h-[3.5rem]">
                        {product.name}
                      </h3>

                      {/* Açıklama */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>

                      {/* Satıcı */}
                      <div className="flex items-center gap-2 mb-4 text-sm">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">{product.sellerName}</span>
                        </span>
                      </div>

                      {/* Alt Kısım - Fiyat ve Buton */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ₺{product.price.toLocaleString('tr-TR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            Stok: {product.stock}
                          </div>
                        </div>
                        
                        <button 
                          disabled={product.stock === 0}
                          className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                            product.stock === 0
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {product.stock === 0 ? 'Tükendi' : 'İncele'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>
    </Layout>
  );
};

export default Products;