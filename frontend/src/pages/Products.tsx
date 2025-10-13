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
  const [searchQuery, setSearchQuery] = useState('');  // 👈 YENİ: Arama sorgusu
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedCategory = searchParams.get('category') 
    ? decodeURIComponent(searchParams.get('category')!)
    : null;

  // Kategoriler
  const categories = [
    'Tümü',
    'Elektronik',
    'Giyim',
    'Ev & Yaşam',
    'Spor & Outdoor',
    'Kitap & Hobi',
    'Kozmetik',
    'Oyuncak',
    'Diğer'
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

  // 👇 YENİ: Kategori VE Arama ile filtrele
  useEffect(() => {
    let filtered = products;

    // 1️⃣ Kategori filtresi
    if (selectedCategory && selectedCategory !== 'Tümü') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // 2️⃣ Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sellerName.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  // Kategori değiştir fonksiyonu
  const handleCategoryChange = (category: string) => {
    if (category === 'Tümü') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  // 👇 YENİ: Arama temizle
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-lg text-gray-600">Ürünler yükleniyor...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Tüm Ürünler</h2>
          
          {/* 👇 YENİ: Sonuç sayısı */}
          <div className="text-gray-600">
            <span className="font-semibold">{filteredProducts.length}</span> ürün bulundu
          </div>
        </div>

        {/* 👇 YENİ: Arama Kutusu */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ara... (isim, açıklama, satıcı)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
            />
            {/* Arama ikonu */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {/* Temizle butonu */}
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Kategori Filtreleri */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                (selectedCategory === category || (!selectedCategory && category === 'Tümü'))
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 👇 YENİ: Arama sonucu mesajı */}
        {searchQuery && (
          <div className="mb-4 text-gray-600">
            <span className="font-semibold">"{searchQuery}"</span> için sonuçlar
            {selectedCategory && selectedCategory !== 'Tümü' && (
              <span> - <span className="font-semibold">{selectedCategory}</span> kategorisinde</span>
            )}
          </div>
        )}

        {/* Ürün Listesi */}
        {filteredProducts.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-600 text-lg">
              {searchQuery 
                ? `"${searchQuery}" için sonuç bulunamadı.` 
                : selectedCategory 
                  ? `"${selectedCategory}" kategorisinde ürün bulunamadı.`
                  : 'Henüz ürün yok.'}
            </p>
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="btn-primary mt-4"
              >
                Aramayı Temizle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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
      </Container>
    </Layout>
  );
};

export default Products;