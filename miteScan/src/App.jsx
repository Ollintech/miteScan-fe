import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import SplashScreen from './pages/SplashScreen/SplashScreen';
import LoadingScreen from './pages/LoadingScreen/LoadingScreen';
import LoadingAnalysis from './components/analysis/LoadingAnalysis';
import './styles/globals.css';

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Registration from './pages/admin/Registration/Registration';
import Hives from './pages/Hives/Hives';
import Historical from './pages/Historical/Historical';
import Analysis from './pages/Analysis/Analysis';
import NewUser from './pages/admin/NewUser/NewUser';
import AdminRoute from './components/AuthForms/AdminRoute.jsx';
import CreateHive from './pages/CreateHive/CreateHive';
import MapSelect from './pages/MapSelect/MapSelect';
import ConnectCamera from './pages/ConnectCamera/ConnectCamera';
import EditHive from './pages/EditHive/EditHive';
import DeleteHive from './pages/DeleteHive/DeleteHive';
import ResultAnalysis from './pages/ResultAnalysis/ResultAnalysis';
import Users from './pages/admin/Users/Users';
import EditUserPage from './pages/admin/EditUser/EditUser';
import DeleteUserPage from './pages/admin/DeleteUser/DeleteUser';

import PrivateRoute from './components/AuthForms/PrivateRoute.jsx';

// Rota pública: redireciona para /home se o usuário já estiver logado
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : children;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Rotas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />

        {/* Rotas sem layout */}
        <Route path="/loading" element={<PublicRoute><LoadingScreen /></PublicRoute>} />
        <Route path="/loading-analysis" element={<LoadingAnalysis />} />

        {/* Rotas protegidas com layout */}
        <Route element={<DefaultLayout />}>
          {/* Usuário comum */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/hives" element={<PrivateRoute><Hives /></PrivateRoute>} />
          <Route path="/historical" element={<PrivateRoute><Historical /></PrivateRoute>} />
          <Route path="/analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
          <Route path="/result-analysis" element={<PrivateRoute><ResultAnalysis /></PrivateRoute>} />
          <Route path="/create-hive" element={<PrivateRoute><CreateHive /></PrivateRoute>} />
          <Route path="/select-location" element={<PrivateRoute><MapSelect /></PrivateRoute>} />
          <Route path="/connect-camera" element={<PrivateRoute><ConnectCamera /></PrivateRoute>} />
          <Route path="/edit-hive/:id" element={<PrivateRoute><EditHive /></PrivateRoute>} />
          <Route path="/delete-hive/:id" element={<PrivateRoute><DeleteHive /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/new-user" element={<AdminRoute><NewUser /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/edit-user/:id" element={<AdminRoute><EditUserPage /></AdminRoute>} />
          <Route path="/delete-user/:id" element={<AdminRoute><DeleteUserPage /></AdminRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
