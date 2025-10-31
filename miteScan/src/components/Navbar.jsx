import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

import logoImg from '../assets/images/logo-nav.png';
import homeIcon from '../assets/images/home-icon.png';
import cadastrarIcon from '../assets/images/cadastrar-colmeia.png';
import historicoIcon from '../assets/images/historico-analise.png';
import analisarIcon from '../assets/images/analisar.png';
import usuarioIcon from '../assets/images/usuario.png';
import logoutIcon from '../assets/images/logout.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();  // para navegar programaticamente
  const [menuOpen, setMenuOpen] = useState(false);

  // Verificar se o usuário é admin/owner
  const userStr = localStorage.getItem('user');
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Navbar: usuário no localStorage inválido, removendo chave:', e);
      localStorage.removeItem('user');
      user = null;
    }
  }
  
  // Função para verificar se é admin (mesma lógica do AdminRoute)
  const isAdminUser = (user) => {
    if (!user) return false;

    // normalize values safely
    const accessId = user.access_id ?? user.access?.id;
    if (accessId === 1 || accessId === '1') return true;

    const nivel = typeof user.nivel === 'string' ? user.nivel.toLowerCase() : null;
    if (nivel === 'administrador' || nivel === 'owner') return true;

    const accessName = typeof user.access?.name === 'string' ? user.access.name.toLowerCase() : null;
    if (accessName === 'owner' || accessName === 'administrador') return true;

    const accessNameAlt = typeof user.access_name === 'string' ? user.access_name.toLowerCase() : null;
    if (accessNameAlt === 'owner' || accessNameAlt === 'administrador') return true;

    const role = typeof user.role === 'string' ? user.role.toLowerCase() : null;
    if (role === 'owner' || role === 'administrador') return true;

    return false;
  };
  
  const isAdmin = isAdminUser(user);

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
    // Remove session-related keys
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_root_id');
    localStorage.removeItem('access_id');
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="item">
        <img src={logoImg} alt="Logo" />
      </div>

      {/* Menu principal com links */}
      <div className={`item2 ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li className={location.pathname === '/home' ? 'active' : ''}>
            <Link to="/home" onClick={closeMenu}>
              <img src={homeIcon} alt="Home" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/hives' ? 'active' : ''}>
            <Link to="/hives" onClick={closeMenu}>
              <img src={cadastrarIcon} alt="Cadastrar Colmeia" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/historical' ? 'active' : ''}>
            <Link to="/historical" onClick={closeMenu}>
              <img src={historicoIcon} alt="Histórico de Análise" style={{ width: '50px' }} />
            </Link>
          </li>
          <li className={location.pathname === '/analysis' ? 'active' : ''}>
            <Link to="/analysis" onClick={closeMenu}>
              <img src={analisarIcon} alt="Analisar" style={{ width: '50px' }} />
            </Link>
          </li>
          {isAdmin && (
            <li className={location.pathname === '/users' ? 'active' : ''}>
              <Link to="/users" onClick={closeMenu}>
                <img src={usuarioIcon} alt="Usuário" style={{ width: '50px' }} />
              </Link>
            </li>
          )}
          <li className={location.pathname === '/login' ? 'active' : ''}>
            <a
              href="#logout"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
                <img src={logoutIcon} alt="Logout" style={{ width: '50px' }} />
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
