import mongoose, { Document, Schema } from 'mongoose';

// 📌 TypeScript için Product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
  seller: mongoose.Types.ObjectId;  // 🔥 Satıcı referansı (User)
  sellerName: string;               // 🔥 Satıcı adı (hızlı erişim)
  createdAt: Date;
  updatedAt: Date;
}

// 📋 MongoDB şeması
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
      maxlength: [100, 'Ürün adı en fazla 100 karakter olabilir']
    },
    description: {
      type: String,
      required: [true, 'Ürün açıklaması zorunludur'],
      maxlength: [2000, 'Açıklama en fazla 2000 karakter olabilir']
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat 0\'dan küçük olamaz']
    },
    category: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      enum: [
        'Elektronik',
        'Giyim',
        'Ev & Yaşam',
        'Kitap & Hobi',
        'Spor & Outdoor',
        'Oyuncak',
        'Kozmetik',
        'Diğer'
      ]
    },
    stock: {
      type: Number,
      required: [true, 'Stok adedi zorunludur'],
      min: [0, 'Stok 0\'dan küçük olamaz'],
      default: 0
    },
    image: {
      type: String,
      default: 'default-product.png'
    },
    isActive: {
      type: Boolean,
      default: true  // Varsayılan olarak aktif
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // User modelini referans al
      required: [true, 'Satıcı bilgisi zorunludur']
    },
    sellerName: {
      type: String,
      required: [true, 'Satıcı adı zorunludur']
    }
  },
  {
    timestamps: true  // createdAt ve updatedAt otomatik oluştur
  }
);

// 📊 INDEX: Hızlı arama için
productSchema.index({ name: 'text', description: 'text' });  // Metin araması
productSchema.index({ seller: 1 });  // Satıcıya göre hızlı listeleme
productSchema.index({ category: 1 });  // Kategoriye göre filtreleme

// 📤 Model'i dışa aktar
const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;