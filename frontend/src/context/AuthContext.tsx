import { createContext } from 'react';
import type { AuthContextType } from '../types';

// Context oluştur ve export et
export const AuthContext = createContext<AuthContextType | undefined>(undefined);