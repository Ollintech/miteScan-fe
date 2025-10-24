// src/components/AuthForms/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  // 1. Pega o token e os dados do usuário do localStorage
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // 2. Se não houver token ou dados do usuário, não está logado. Redireciona para o login.
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 3. Converte os dados do usuário de string para objeto
    const user = JSON.parse(userString);

    // 4. A VERIFICAÇÃO PRINCIPAL:
    // Checa se o usuário existe e se o access_id dele é 1 (administrador)
    if (user && user.access_id === 1) {
      // Se for admin, renderiza a página que a rota protege (o `children`)
      return children;
    } else {
      // Se não for admin, redireciona para a home para evitar acesso indevido.
      return <Navigate to="/home" replace />;
    }
  } catch (error) {
    // Se houver um erro ao ler os dados do usuário, redireciona para o login por segurança.
    console.error("Erro ao processar dados do usuário:", error);
    return <Navigate to="/login" replace />;
  }
}

export default AdminRoute;