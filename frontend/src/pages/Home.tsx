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

  // Öne çıkan ürünleri yükle (son 8 ürün)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.success && Array.isArray(response.data)) {
        const latest = response.data.slice(0, 8);
        setFeaturedProducts(latest);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Kategoriler - Sadece isimler
  const categories = [
    'Elektronik',
    'Moda',
    'Ev & Yaşam',
    'Spor, Outdoor',
    'Kozmetik',
    'Kitap & Hobi',
    'Oyuncak',
    'Diğer'
  ];

  return (
    <Layout>
      {/* KATEGORİ ÇUBUĞU - İnce ve Minimal */}
      <div className="bg-white border-b shadow-sm">
        <Container>
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                className="flex-shrink-0 text-sm text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition"
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* HERO SECTION - Daha Kompakt */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        {/* Dekoratif elementler */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>
        
        <Container className="relative py-12 md:py-16">
          <div className="max-w-2xl">
            {/* Greeting */}
            {user && (
              <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                Merhaba, <span className="font-semibold">{user.name}</span> 👋
              </div>
            )}
            
            {/* Ana Başlık */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {user ? 'Alışverişe Devam Et' : 'Aradığın Her Şey Burada'}
            </h1>
            
            {/* Alt Başlık */}
            <p className="text-base md:text-lg mb-6 text-blue-100 leading-relaxed">
              Binlerce üründen oluşan koleksiyonumuzu keşfet. Güvenli ödeme, hızlı teslimat.
            </p>
            
            {/* CTA Butonları */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ürünleri Keşfet
              </button>
              
              {user?.role === 'seller' ? (
                <button 
                  onClick={() => navigate('/seller/dashboard')}
                  className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-blue-500/30 transition-all"
                >
                  Satıcı Paneli →
                </button>
              ) : !user && (
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
                >
                  Satıcı Ol
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ÖNE ÇIKAN ÜRÜNLER */}
      <div className="bg-gray-50 py-10 md:py-12">
        <Container>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Yeni Eklenenler</h2>
              <p className="text-gray-600 mt-1 text-sm">En son eklenen ürünlere göz at</p>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group text-sm"
            >
              Tümünü Gör 
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Ürünler yükleniyor...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-6">Henüz ürün eklenmemiş.</p>
              {user?.role === 'seller' && (
                <button 
                  onClick={() => navigate('/seller/add-product')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  İlk Ürünü Ekle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 group cursor-pointer"
                  onClick={() => navigate('/products')}
                >
                  {/* Ürün Görseli */}
                  <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                    <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">📦</div>
                    {/* Stok Badge */}
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Son {product.stock}
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Tükendi
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="p-3 md:p-4">
                    {/* Kategori Badge */}
                    <div className="mb-2">
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-medium">
                        {product.category}
                      </span>
                    </div>

                    {/* Ürün İsmi */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm md:text-base group-hover:text-blue-600 transition">
                      {product.name}
                    </h3>

                    {/* Açıklama */}
                    <p className="text-gray-600 text-xs mb-2 line-clamp-1 hidden md:block">
                      {product.description}
                    </p>

                    {/* Fiyat */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg md:text-xl font-bold text-gray-900">
                        ₺{product.price}
                      </div>
                      <div className="text-xs text-gray-500 hidden md:block">
                        {product.sellerName}
                      </div>
                    </div>

                    {/* Görüntüle Butonu */}
                    <button 
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/products');
                      }}
                    >
                      İncele
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* NEDEN BİZ? - Daha Kompakt */}
      <Container className="py-10 md:py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Hızlı Teslimat</h3>
            <p className="text-gray-600 text-sm">
              Siparişleriniz güvenle elinize ulaşıyor
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-base mb-1">Güvenli Ödeme</h3>
            <p className="text-gray-600 text-sm">
              Tüm ödemeleriniz SSL ile korunuyor
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-base mb-1">7/24 Destek</h3>
            <p className="text-gray-600 text-sm">
              Müşteri hizmetlerimiz her zaman yanınızda
            </p>
          </div>
        </div>
      </Container>

      {/* CTA - Giriş Yapmamışlar İçin */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-14">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Hemen Başla!
              </h2>
              <p className="text-base md:text-lg mb-6 text-blue-100">
                Ücretsiz hesap oluştur ve alışverişe başla.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
                >
                  Kayıt Ol
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
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