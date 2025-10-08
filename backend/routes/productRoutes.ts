import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} from '../controllers/productController';
import { protect, seller } from '../middleware/authMiddleware';

// 🛣️ Router oluştur
const router = express.Router();

// 📝 ROUTES

// 📍 PUBLIC ROUTES - Herkes erişebilir (token gerekmez)
router.get('/', getAllProducts);           // Tüm ürünleri listele
router.get('/:id', getProductById);        // Tek ürün detayı

// 🏪 SELLER ROUTES - Token + Seller rolü gerekli
router.post('/', protect, seller, createProduct);        // Yeni ürün ekle
router.put('/:id', protect, seller, updateProduct);      // Ürün güncelle
router.delete('/:id', protect, seller, deleteProduct);   // Ürün sil
router.get('/my/products', protect, seller, getMyProducts);  // Kendi ürünlerini listele

// 📤 Router'ı dışa aktar
export default router;