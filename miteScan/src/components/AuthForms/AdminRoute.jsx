import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const userType = localStorage.getItem('user_type'); // Pega o tipo de usuário

  if (!token || !userString || !userType) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    // Verificação dupla: precisa ter access_id 1 E ser do tipo 'root'
    if (user && user.access_id === 1 && userType === 'root') {
      return children;
    } else {
      return <Navigate to="/home" replace />;
    }
  } catch (error) {
    console.error("Erro ao processar dados do usuário:", error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}

export default AdminRoute;