import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import logoImg from '../assets/images/logo-nav.png';
import homeIcon from '../assets/images/home-icon.png';
import cadastrarIcon from '../assets/images/cadastrar-colmeia.png';
import historicoIcon from '../assets/images/historico-analise.png';
import analisarIcon from '../assets/images/analisar.png';
import usuarioIcon from '../assets/images/usuario.png';
import logoutIcon from '../assets/images/logout.png';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para controlar se a sidebar está recolhida ou não
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle do menu
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Verificar se o usuário é admin/owner
  const userStr = localStorage.getItem('user');
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Sidebar: usuário no localStorage inválido:', e);
      localStorage.removeItem('user');
      user = null;
    }
  }

  const isAdminUser = (user) => {
    if (!user) return false;
    const accessId = user.access_id ?? user.access?.id;
    if (accessId === 4 || accessId === '4') return true;

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('account');
    localStorage.removeItem('access_id');
    navigate('/login');
  };

  // Estrutura dos links do menu
  const menuItems = [
    { path: '/home', label: 'Início', icon: homeIcon },
    { path: '/hives', label: 'Colmeias', icon: cadastrarIcon },
    { path: '/historical', label: 'Histórico', icon: historicoIcon },
    { path: '/analysis', label: 'Análise', icon: analisarIcon },
  ];

  if (isAdmin) {
    menuItems.push({ path: '/users', label: 'Usuários', icon: usuarioIcon });
  }

  return (
    <aside
      className={`h-screen bg-yellow-400 text-black flex flex-col justify-between p-4 fixed left-0 top-0 z-50 shadow-xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Botão de Toggle (Retrair / Expandir) */}
      <button
        onClick={toggleSidebar}
        title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        className="absolute -right-3 top-8 bg-black text-yellow-400 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-50 focus:outline-none"
      >
        {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>

      {/* Topo: Logo & Navegação */}
      <div className="flex flex-col gap-6">
        {/* Container da Logo */}
        <div className={`flex items-center justify-center pt-2 pb-4 border-b border-black/10 overflow-hidden`}>
          <img
            src={logoImg}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              isCollapsed ? 'h-8 w-8' : 'h-10'
            }`}
          />
        </div>

        {/* Lista de Navegação */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                  isCollapsed ? 'justify-center px-0' : 'justify-start'
                } ${
                  isActive
                    ? 'bg-white/70 text-black shadow-sm font-bold'
                    : 'hover:bg-white/50 text-black font-semibold'
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 object-contain brightness-0 shrink-0"
                />
                {!isCollapsed && (
                  <span className="text-black font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé: Botão de Logout */}
      <div className="pt-4 border-t border-black/10">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sair" : undefined}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm bg-white/40 hover:bg-red-500/20 hover:text-red-700 text-black transition-all duration-200 active:scale-95 ${
            isCollapsed ? 'justify-center px-0' : 'justify-start'
          }`}
        >
          <img
            src={logoutIcon}
            alt="Sair"
            className="w-5 h-5 object-contain brightness-0 shrink-0"
          />
          {!isCollapsed && (
            <span className="text-black font-bold text-sm whitespace-nowrap overflow-hidden">
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}