import { Request, Response } from 'express';
import Product from '../models/Product';

// 📋 GET ALL PRODUCTS - Tüm ürünleri listele (herkes görebilir)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Sadece aktif ürünleri getir
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });  // En yeni ürünler önce
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get All Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilirken hata oluştu',
      error: (error as Error).message
    });
  }
};

// 🔍 GET PRODUCT BY ID - Tek ürün detayı (herkes görebilir)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün getirilirken hata oluştu',
      error: (error as Error).message
    });
  }
};

// ➕ CREATE PRODUCT - Yeni ürün ekle (sadece seller)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    
    // Gerekli alanlar kontrolü
    if (!name || !description || !price || !category) {
      res.status(400).json({
        success: false,
        message: 'Lütfen tüm zorunlu alanları doldurun'
      });
      return;
    }
    
    // req.user middleware'den geliyor (protect + seller kontrolü)
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: image || 'default-product.png',
      seller: (req as any).user.id,        // 🔥 Token'dan gelen user ID
      sellerName: (req as any).user.name   // 🔥 Satıcı adı (hızlı erişim için)
    });
    
    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      data: product
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün eklenirken hata oluştu',
      error: (error as Error).message
    });
  }
};

// ✏️ UPDATE PRODUCT - Ürün güncelle (sadece kendi ürünü)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
      return;
    }
    
    // 🛡️ GÜVENLİK: Sadece kendi ürününü güncelleyebilir
    if (product.seller.toString() !== (req as any).user.id) {
      res.status(403).json({
        success: false,
        message: 'Bu ürünü güncelleme yetkiniz yok'
      });
      return;
    }
    
    // Güncelle
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu',
      error: (error as Error).message
    });
  }
};

// 🗑️ DELETE PRODUCT - Ürün sil (sadece kendi ürünü)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
      return;
    }
    
    // 🛡️ GÜVENLİK: Sadece kendi ürününü silebilir
    if (product.seller.toString() !== (req as any).user.id) {
      res.status(403).json({
        success: false,
        message: 'Bu ürünü silme yetkiniz yok'
      });
      return;
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu',
      error: (error as Error).message
    });
  }
};

// 🏪 GET MY PRODUCTS - Kendi ürünlerimi listele (seller)
export const getMyProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Sadece bu satıcının ürünleri (aktif + pasif hepsi)
    const products = await Product.find({ 
      seller: (req as any).user.id 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get My Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilirken hata oluştu',
      error: (error as Error).message
    });
  }
};