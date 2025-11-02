import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const userType = localStorage.getItem('user_type');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    if (user && Number(user.access_id) === 4) {
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