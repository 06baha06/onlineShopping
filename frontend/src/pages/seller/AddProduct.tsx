import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as productService from '../../services/productService';

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Elektronik',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Elektronik',
    'Giyim',
    'Ev & Yaşam',
    'Spor & Outdoor',
    'Kitap & Hobi',
    'Kozmetik',
    'Oyuncak',
    'Diğer'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      return;
    }

    // Validasyon
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Fiyat 0\'dan büyük olmalı.');
      return;
    }

    if (Number(formData.stock) < 0) {
      setError('Stok negatif olamaz.');
      return;
    }

    setLoading(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      image: formData.image || 'default-product.png'
    };

    const response = await productService.createProduct(productData, token);

    if (response.success) {
      alert('Ürün başarıyla eklendi!');
      navigate('/seller/dashboard');
    } else {
      setError(response.message || 'Ürün eklenemedi');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">➕ Yeni Ürün Ekle</h1>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/seller/dashboard')} className="text-gray-700 hover:text-blue-600">
              ← Panele Dön
            </button>
            <button onClick={handleLogout} className="btn-danger text-sm">
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="max-w-3xl mx-auto p-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Ürün Bilgileri</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ürün Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="iPhone 15 Pro Max"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Ürün açıklaması..."
                required
              />
            </div>

            {/* Fiyat ve Stok */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Görsel URL (Opsiyonel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL (Opsiyonel)
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/product.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Boş bırakırsanız varsayılan görsel kullanılır
              </p>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Butonlar */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Ekleniyor...' : '✅ Ürünü Ekle'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;