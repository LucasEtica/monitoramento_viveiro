// frontend/src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const usuario = localStorage.getItem('usuario'); // Aqui ele pega o usuario logado
  return usuario ? children : <Navigate to="/login" />;
}
