// 👤 Kullanıcı tipi
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';  
  avatar?: string;
}

// 🔐 Auth Context tipi (global state)
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 📦 Backend'den gelen cevap tipleri
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  data?: {
    user: User;
  };
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  seller: string;          // User ID
  sellerName: string;      // Satıcının adı
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backend'den gelen product response
export interface ProductResponse {
  success: boolean;
  message?: string;
  data?: IProduct | IProduct[];
  count?: number;
}