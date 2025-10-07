import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      alert('Giriş başarılı!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Giriş Yap</h1>
      
      {user && (
        <div style={{ background: '#d4edda', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Hoş geldin, {user.name}!</span>
            <button 
              onClick={logout}
              style={{ 
                padding: '5px 15px', 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
          />
        </div>

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Giriş Yap
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        Hesabın yok mu?{' '}
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
};

export default Login;