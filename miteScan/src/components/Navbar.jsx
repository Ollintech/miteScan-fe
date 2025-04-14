// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaPlus, FaHistory, FaSearch, FaUser } from 'react-icons/fa'
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
          <Link to="/historical"><FaSearch /> Analisar Colmeia</Link>
        </li>
        <li className={location.pathname === '/usuario' ? 'active' : ''}>
          <Link to="/login"><FaUser /> Usuário</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
