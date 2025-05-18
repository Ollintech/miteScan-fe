import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import SplashScreen from '../src/pages/SplashScreen/SplashScreen';
import LoadingScreen from './pages/LoadingScreen/LoadingScreen';
import LoadingAnalysis from './components/analysis/LoadingAnalysis';
import './styles/globals.css';

import Login from '../src/pages/Login/Login';
import Home from './pages/Home/Home';
import Registration from '../src/pages/Registration/Registration';
import Hives from '../src/pages/Hives/Hives';
import Historical from '../src/pages/Historical/Historical';
import Analysis from '../src/pages/Analysis/Analysis';
import User from '../src/pages/User/User';
import CreateHive from '../src/pages/CreateHive/CreateHive';
import MapSelect from '../src/pages/MapSelect/MapSelect';
import ConnectCamera from '../src/pages/ConnectCamera/ConnectCamera';
import EditHive from './pages/EditHive/EditHive';
import DeleteHive from './pages/DeleteHive/DeleteHive';
import ResultAnalysis from './pages/ResultAnalysis/ResultAnalysis';

import PrivateRoute from '../src/components/AuthForms/PrivateRoute.jsx';

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
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas (acessíveis só se não estiver logado) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />

        {/* Rotas protegidas SEM layout */}
        <Route path="/loading" element={<PrivateRoute><LoadingScreen /></PrivateRoute>} />
        <Route path="/loading-analysis" element={<PrivateRoute><LoadingAnalysis /></PrivateRoute>} />

        {/* Rotas protegidas COM layout padrão */}
        <Route element={<DefaultLayout />}>
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/hives" element={<PrivateRoute><Hives /></PrivateRoute>} />
          <Route path="/historical" element={<PrivateRoute><Historical /></PrivateRoute>} />
          <Route path="/analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
          <Route path="/result-analysis" element={<PrivateRoute><ResultAnalysis /></PrivateRoute>} />
          <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
          <Route path="/create-hive" element={<PrivateRoute><CreateHive /></PrivateRoute>} />
          <Route path="/select-location" element={<PrivateRoute><MapSelect /></PrivateRoute>} />
          <Route path="/connect-camera" element={<PrivateRoute><ConnectCamera /></PrivateRoute>} />
          <Route path="/edit-hive/:id" element={<PrivateRoute><EditHive /></PrivateRoute>} />
          <Route path="/delete-hive/:id" element={<PrivateRoute><DeleteHive /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
