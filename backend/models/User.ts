import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 📌 TypeScript için User interface (tip tanımı)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin'; 
  avatar?: string;
  addresses?: Array<{
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  
  // 🔒 Metodlar (TypeScript tip tanımı)
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// 📋 MongoDB şeması (veritabanı yapısı)
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'İsim zorunludur'],
      trim: true,
      maxlength: [50, 'İsim en fazla 50 karakter olabilir']
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Geçerli bir email adresi giriniz'
      ]
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false // 🔒 Şifreyi otomatik getirme (güvenlik)
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],  
      default: 'buyer'  
    },
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    addresses: [
      {
        street: String,
        city: String,
        postalCode: String,
        country: String
      }
    ]
  },
  {
    timestamps: true // createdAt ve updatedAt otomatik oluştur
  }
);

// 🔐 MIDDLEWARE: Şifreyi kaydetmeden önce hashle
userSchema.pre('save', async function (next) {
  // Şifre değişmediyse hashlemeden devam et
  if (!this.isModified('password')) {
    return next();
  }

  // Şifreyi hashle (şifrele)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔍 METHOD: Girilen şifreyi kontrol et
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 📤 Model'i dışa aktar (TypeScript generic ile)
const User = mongoose.model<IUser>('User', userSchema);
export default User;