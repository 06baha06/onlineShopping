import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      alert('Kayıt başarılı!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Kayıt Ol</h1>
      
      {user && (
        <div style={{ background: '#d4edda', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          Hoş geldin, {user.name}! Kayıt başarılı.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>İsim:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
          />
        </div>

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
            minLength={6}
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
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;