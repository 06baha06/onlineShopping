import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// 🔗 Routes import
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';  // 🔥 YENİ

// .env dosyasını yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

// Express uygulaması oluştur
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: '🚀 E-commerce API çalışıyor!',
    version: '1.0.0',
    typescript: true
  });
});

// 🛣️ API ROUTES
app.use('/api/auth', authRoutes);          // Auth routes
app.use('/api/products', productRoutes);   // 🔥 Product routes

// 404 - Route bulunamadı
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Route bulunamadı' 
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor (TypeScript)`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔐 Auth Routes: http://localhost:${PORT}/api/auth`);
  console.log(`📦 Product Routes: http://localhost:${PORT}/api/products`);  // 🔥 YENİ
});