// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'
import SplashScreen from '../src/pages/SplashScreen/SplashScreen'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen';
import './styles/globals.css'

import Login from '../src/pages/Login/Login'
import Home from './pages/Home/Home' 
import Registration from '../src/pages/Registration/Registration'
import Hives from '../src/pages/Hives/Hives'
import Historical from '../src/pages/Historical/Historical'
import Analysis from '../src/pages/Analysis/Analysis'
import User from '../src/pages/User/User'
import CreateHive from '../src/pages/CreateHive/CreateHive'
import MapSelect from '../src/pages/MapSelect/MapSelect'
import ConnectCamera from '../src/pages/ConnectCamera/ConnectCamera'
import EditHive from './pages/EditHive/EditHive';
import DeleteHive from './pages/DeleteHive/DeleteHive';

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000) // 3 segundos

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route element={<DefaultLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/hives" element={<Hives />} />
          <Route path="/historical" element={<Historical />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/user" element={<User />} />
          <Route path="/create-hive" element={<CreateHive />} />
          <Route path="/select-location" element={<MapSelect />} />
          <Route path="/connect-camera" element={<ConnectCamera />} />
          <Route path="/edit-hive" element={<EditHive/>}/>
          <Route path="/delete-hive" element={<DeleteHive/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
