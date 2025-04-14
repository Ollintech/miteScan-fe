// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaPlus, FaHistory, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <ul>
        <li className={location.pathname === '/home' ? 'active' : ''}>
          <Link to="/home"><FaHome /> Home</Link>
        </li>
        <li className={location.pathname === '/cadastrar-colmeia' ? 'active' : ''}>
          <Link to="/hives"><FaPlus /> Cadastrar Colmeia</Link>
        </li>
        <li className={location.pathname === '/historico' ? 'active' : ''}>
          <Link to="/historical"><FaHistory /> Histórico</Link>
        </li>
        <li className={location.pathname === '/analisar' ? 'active' : ''}>
          <Link to="/analysis"><FaSearch /> Analisar Colmeia</Link>
        </li>
        <li className={location.pathname === '/usuario' ? 'active' : ''}>
          <Link to="/user"><FaUser /> Usuário</Link>
        </li>
        <li className={location.pathname === '/usuario' ? 'active' : ''}>
          <Link to="/login"><FaSignOutAlt /> Sair</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
