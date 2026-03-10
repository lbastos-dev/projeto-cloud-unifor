// frontend/src/services/api.js
import axios from 'axios';
import { auth } from '../firebase'; 

const api = axios.create({
  // Puxa a URL do Render que está no seu .env.local
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor: Antes de qualquer requisição sair, ele injeta o Token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;