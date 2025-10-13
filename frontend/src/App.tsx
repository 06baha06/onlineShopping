// frontend/src/App.tsx

import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContextProvider';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/seller/Dashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🌍 PUBLIC ROUTES - Herkes erişebilir */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 PROTECTED ROUTES - Giriş gerekli */}
          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <PrivateRoute requiredRole="seller">
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/seller/add-product"
            element={
              <PrivateRoute requiredRole="seller">
                <AddProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="/seller/edit-product/:id"
            element={
              <PrivateRoute requiredRole="seller">
                <EditProduct />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2">404</h1>
                  <p>Sayfa bulunamadı</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;