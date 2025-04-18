// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaPlus, FaHistory, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="item">
      <img src="../../src/assets/images/logo-nav.png" alt="" />
      </div>
     <div className="item2">
      <ul>
        <li className={location.pathname === '/home' ? 'active' : ''}>
          <Link to="/home"> <img src="../../src/assets/images/home-icon.png" alt="" style={{width: '50px'}}/></Link>
        </li>
        <li className={location.pathname === '/hives' ? 'active' : ''}>
          <Link to="/hives"><img src="../../src/assets/images/cadastrar-colmeia.png" alt="" style={{width: '50px'}}/> </Link>
        </li>
        <li className={location.pathname === '/historical' ? 'active' : ''}>
          <Link to="/historical"><img src="../../src/assets/images/historico-analise.png" alt="" style={{width: '50px'}}/> </Link>
        </li>
        <li className={location.pathname === '/analysis' ? 'active' : ''}>
          <Link to="/analysis"><img src="../../src/assets/images/analisar.png" alt="" style={{width: '50px'}}/></Link>
        </li>
        <li className={location.pathname === '/user' ? 'active' : ''}>
          <Link to="/user"><img src="../../src/assets/images/usuario.png" alt="" style={{width: '50px'}}/></Link>
        </li>
        <li className={location.pathname === '/login' ? 'active' : ''}>
          <Link to="/login"><img src="../../src/assets/images/logout.png" alt="" style={{width: '50px'}}/></Link>
        </li>
      </ul>
     </div>
      
    </nav>
  )
}

export default Navbar
