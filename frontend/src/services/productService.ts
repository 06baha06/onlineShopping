import type { ProductResponse } from '../types';

const API_URL = 'http://localhost:5000/api/products';

// 📋 TÜM ÜRÜNLERİ GETİR (Public - herkes görebilir)
export const getAllProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get All Products Error:', error);
    return {
      success: false,
      message: 'Ürünler yüklenirken hata oluştu'
    };
  }
};

// 🔍 TEK ÜRÜN GETİR (Public)
export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Product Error:', error);
    return {
      success: false,
      message: 'Ürün yüklenirken hata oluştu'
    };
  }
};

// 🏪 KENDİ ÜRÜNLERİMİ GETİR (Seller only)
export const getMyProducts = async (token: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/my/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get My Products Error:', error);
    return {
      success: false,
      message: 'Ürünleriniz yüklenirken hata oluştu'
    };
  }
};

// ➕ YENİ ÜRÜN EKLE (Seller only)
export const createProduct = async (
  productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
  },
  token: string
): Promise<ProductResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create Product Error:', error);
    return {
      success: false,
      message: 'Ürün eklenirken hata oluştu'
    };
  }
};

// ✏️ ÜRÜN GÜNCELLE (Seller only - kendi ürünü)
export const updateProduct = async (
  id: string,
  productData: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    isActive: boolean;
  }>,
  token: string
): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update Product Error:', error);
    return {
      success: false,
      message: 'Ürün güncellenirken hata oluştu'
    };
  }
};

// 🗑️ ÜRÜN SİL (Seller only - kendi ürünü)
export const deleteProduct = async (
  id: string,
  token: string
): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete Product Error:', error);
    return {
      success: false,
      message: 'Ürün silinirken hata oluştu'
    };
  }
};