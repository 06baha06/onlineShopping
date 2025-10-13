// frontend/src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as productService from '../services/productService';
import type { IProduct } from '../types';
import Layout from '../components/layout/Layout';
import Container from '../components/common/Container';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Öne çıkan ürünleri yükle (son 6 ürün)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.success && Array.isArray(response.data)) {
        // Son eklenen 6 ürünü al
        const latest = response.data.slice(0, 6);
        setFeaturedProducts(latest);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Kategoriler
  const categories = [
    { name: 'Elektronik', icon: '📱', color: 'bg-blue-100 text-blue-600' },
    { name: 'Giyim', icon: '👕', color: 'bg-purple-100 text-purple-600' },
    { name: 'Ev & Yaşam', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { name: 'Spor & Outdoor', icon: '⚽', color: 'bg-orange-100 text-orange-600' },
    { name: 'Kitap & Hobi', icon: '📚', color: 'bg-pink-100 text-pink-600' },
    { name: 'Kozmetik', icon: '💄', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <Layout>
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Container className="py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              {user ? `Hoş geldin, ${user.name}! 👋` : 'En İyi Ürünler Burada! 🛍️'}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Binlerce ürün arasından ihtiyacınız olanı bulun. Güvenli alışverişin adresi.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/products')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ürünlere Göz At
              </button>
              
              {user?.role === 'seller' ? (
                <button 
                  onClick={() => navigate('/seller/dashboard')}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
                >
                  Satıcı Paneline Git
                </button>
              ) : !user && (
                <button 
                  onClick={() => navigate('/register')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Satıcı Ol
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* KATEGORİLER */}
      <Container className="py-12">
        <h2 className="text-3xl font-bold mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate('/products')}
              className={`${category.color} p-6 rounded-xl hover:shadow-lg transition text-center`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-semibold">{category.name}</div>
            </button>
          ))}
        </div>
      </Container>

      {/* ÖNE ÇIKAN ÜRÜNLER */}
      <div className="bg-gray-50 py-12">
        <Container>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <button 
              onClick={() => navigate('/products')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Tümünü Gör →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Ürünler yükleniyor...</div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">Henüz ürün yok.</p>
              {user?.role === 'seller' && (
                <button 
                  onClick={() => navigate('/seller/add-product')}
                  className="btn-primary"
                >
                  İlk Ürünü Sen Ekle!
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="card hover:shadow-xl transition-shadow">
                  {/* Ürün Görseli */}
                  <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>

                  {/* Ürün Bilgileri */}
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Fiyat */}
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
                    <span className="font-semibold">{product.sellerName}</span>
                  </div>

                  {/* Buton */}
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn-primary w-full"
                  >
                    İncele
                  </button>
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* CTA (Call to Action) */}
      {!user && (
        <div className="bg-blue-600 text-white py-16">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Hemen Başla!</h2>
              <p className="text-xl mb-8 text-blue-100">
                Ücretsiz hesap oluştur ve binlerce ürüne ulaş.
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Kayıt Ol
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </Layout>
  );
};

export default Home;