// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'
import Login from './pages/Login'
import Home from './pages/Home' 
import Registration from './pages/Registration'
import Hives from '../src/pages/Hives'

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas sem navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Páginas com navbar */}
        <Route element={<DefaultLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
        
        <Route element={<DefaultLayout />}>
          <Route path="/hives" element={<Hives />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
