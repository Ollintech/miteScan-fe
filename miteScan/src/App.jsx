// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'

import Login from '../src/pages/Login/Login'
import Home from '../src/pages/Home/Home' 
import Registration from '../src/pages/Registration/Registration'
import Hives from '../src/pages/Hives/Hives'
import Historical from '../src/pages/Historical/Historical'
import Analysis from '../src/pages/Analysis/Analysis'
import User from '../src/pages/User/User'

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

        <Route element={<DefaultLayout />}>
          <Route path="/analysis" element={<Analysis />} />
        </Route>

        <Route element={<DefaultLayout />}>
          <Route path="/user" element={<User />} />
        </Route>
      </Routes>
      
     
    </Router>
  )
}

export default App
