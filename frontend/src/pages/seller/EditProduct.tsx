import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as productService from '../../services/productService';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Elektronik',
    stock: '',
    image: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Ürün bilgilerini yükle
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !token) return;

      setLoading(true);
      const response = await productService.getProductById(id);

      if (response.success && response.data && !Array.isArray(response.data)) {
        const product = response.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
          image: product.image,
          isActive: product.isActive
        });
      } else {
        setError('Ürün bulunamadı');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!id || !token) {
      setError('Oturum süreniz dolmuş.');
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

    setSaving(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      image: formData.image,
      isActive: formData.isActive
    };

    const response = await productService.updateProduct(id, productData, token);

    if (response.success) {
      alert('Ürün başarıyla güncellendi!');
      navigate('/seller/dashboard');
    } else {
      setError(response.message || 'Ürün güncellenemedi');
    }

    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Ürün yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">✏️ Ürün Düzenle</h1>
          
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

            {/* Görsel URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Aktif/Pasif */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Ürün aktif (Müşteriler görebilir)
              </label>
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
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
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

export default EditProduct;