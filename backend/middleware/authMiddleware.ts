import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// 🔐 JWT Token'dan kullanıcı ID'sini çıkarmak için tip tanımı
interface JwtPayload {
  id: string;
}

// 🛡️ PROTECT - Token kontrolü yap
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1️⃣ Header'dan token'ı al
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // "Bearer eyJhbGci..." formatından token'ı ayır
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ Token var mı kontrol et
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Giriş yapmadınız. Lütfen giriş yapın.'
      });
      return;
    }

    // 3️⃣ Token'ı doğrula (verify)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET tanımlı değil!');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 4️⃣ Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Bu token ile ilişkili kullanıcı bulunamadı'
      });
      return;
    }

    // 5️⃣ Kullanıcıyı req.user'a ekle (sonraki middleware'ler ve controller'lar için)
    req.user = {
      id: String(user._id),
      role: user.role
    };

    // 6️⃣ Bir sonraki middleware'e geç
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({
      success: false,
      message: 'Geçersiz token. Lütfen tekrar giriş yapın.',
      error: (error as Error).message
    });
  }
};

// 👮 ADMIN CHECK - Sadece admin kullanıcılar erişebilir
export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // protect middleware'den sonra çalışmalı (req.user dolu olmalı)
  if (req.user && req.user.role === 'admin') {
    next(); // Admin ise devam et
  } else {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için yetkiniz yok (Sadece admin)'
    });
  }
};