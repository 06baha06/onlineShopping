import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// JWT Token Oluştur
const generateToken = (id: string): string => {
  // JWT_SECRET kontrolü
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET .env dosyasında tanımlı değil!');
  }
  
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  
  return jwt.sign(
    { id }, 
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

// 📝 REGISTER - Yeni kullanıcı kaydet
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body; 

    // 1️⃣ Alanların dolu olup olmadığını kontrol et
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Lütfen tüm alanları doldurun'
      });
      return;
    }

    // 2️⃣ Email zaten kayıtlı mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı'
      });
      return;
    }

    // 3️⃣ Role kontrolü (güvenlik)
    const allowedRoles = ['buyer', 'seller', 'admin'];
    const userRole = role && allowedRoles.includes(role) ? role : 'buyer';

    // 4️⃣ Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password, // Şifre otomatik hashlenecek
      role: userRole  // 🔥 YENİ: role eklendi
    });

    // 5️⃣ Token oluştur
    const token = generateToken(String(user._id));

    // 6️⃣ Başarılı yanıt döndür
    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,  
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: (error as Error).message
    });
  }
};

// 🔑 LOGIN - Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Email ve şifre girilmiş mi?
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
      return;
    }

    // 2️⃣ Kullanıcıyı bul (şifreyi de getir - select('+password'))
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
      return;
    }

    // 3️⃣ Şifre doğru mu kontrol et
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
      return;
    }

    // 4️⃣ Token oluştur
    const token = generateToken(String(user._id));

    // 5️⃣ Başarılı yanıt döndür
    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: (error as Error).message
    });
  }
};

// 👤 GET ME - Oturum açık kullanıcının bilgilerini getir
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user middleware'den gelecek (authMiddleware.ts'den)
    const user = await User.findById((req as any).user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          addresses: user.addresses
        }
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: (error as Error).message
    });
  }
};