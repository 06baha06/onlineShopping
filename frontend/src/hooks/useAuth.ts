import { useContext } from 'react';
import type { AuthContextType } from '../types';
import { AuthContext } from '../context/AuthContext';

// Hook - Context kullanımı için
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};