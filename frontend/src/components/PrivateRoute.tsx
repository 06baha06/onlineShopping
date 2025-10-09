import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'buyer' | 'seller' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // 1️⃣ Loading durumu - Henüz auth kontrolü yapılıyor
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Yükleniyor...</div>
      </div>
    );
  }

  // 2️⃣ Giriş yapmamış - Login'e yönlendir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Role kontrolü (opsiyonel)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2>🚫 Yetkiniz Yok</h2>
          <p>Bu sayfaya erişim için {requiredRole} rolü gerekiyor.</p>
          <p>Sizin rolünüz: {user.role}</p>
        </div>
      </div>
    );
  }

  // 4️⃣ Her şey OK - İçeriği göster
  return <>{children}</>;
};

export default PrivateRoute;