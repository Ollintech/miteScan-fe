// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'

import Login from '../src/pages/Login/Login'
import Home from '../src/pages/Home/Home' 
import Registration from '../src/pages/Registration/Registration'
import Hives from '../src/pages/Hives/Hives'
import Historical from '../src/pages/Historical/Historical'

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

      <Route element={<DefaultLayout />}>
          <Route path="/historical" element={<Historical />} />
        </Route>
      </Routes>
      
     
    </Router>
  )
}

export default App
