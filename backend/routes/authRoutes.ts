import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

// 🛣️ Router oluştur
const router = express.Router();

// 📝 ROUTES

// POST /api/auth/register - Yeni kullanıcı kaydet
router.post('/register', register);

// POST /api/auth/login - Kullanıcı girişi
router.post('/login', login);

// GET /api/auth/me - Oturum açık kullanıcının bilgilerini getir
// protect middleware'i önce token kontrolü yapacak
router.get('/me', protect, getMe);

// 📤 Router'ı dışa aktar
export default router;