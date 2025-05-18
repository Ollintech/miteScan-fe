import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();  // para navegar programaticamente
  const [menuOpen, setMenuOpen] = useState(false);

  //Função para menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função para fechar o menu quando um item for clicado
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Função para logout: limpa token e redireciona
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="item">
        <img src="../../src/assets/images/logo-nav.png" alt="Logo" />
      </div>

      {/* Menu principal com links */}
      <div className={`item2 ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li className={location.pathname === '/home' ? 'active' : ''}>
            <Link to="/home" onClick={closeMenu}>
              <img src="../../src/assets/images/home-icon.png" alt="Home" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/hives' ? 'active' : ''}>
            <Link to="/hives" onClick={closeMenu}>
              <img src="../../src/assets/images/cadastrar-colmeia.png" alt="Cadastrar Colmeia" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/historical' ? 'active' : ''}>
            <Link to="/historical" onClick={closeMenu}>
              <img src="../../src/assets/images/historico-analise.png" alt="Histórico de Análise" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/analysis' ? 'active' : ''}>
            <Link to="/analysis" onClick={closeMenu}>
              <img src="../../src/assets/images/analisar.png" alt="Analisar" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/user' ? 'active' : ''}>
            <Link to="/user" onClick={closeMenu}>
              <img src="../../src/assets/images/usuario.png" alt="Usuário" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/login' ? 'active' : ''}>
            <a
              href="#logout"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <img src="../../src/assets/images/logout.png" alt="Logout" style={{ width: '50px' }} />
            </a>
          </li>
        </ul>
      </div>

      {/* Ícone do menu hamburger */}
      <div className="menu-icon" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

export default Navbar;
