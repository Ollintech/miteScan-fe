import { useState } from 'react';
import './User.css'; // Estilos personalizados
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/images/default-avatar.png'; // Imagem padrão do avatar
import UserCard from '../../components/user/user-card';
import { FaArrowLeft } from 'react-icons/fa';

function User() {
  const navigate = useNavigate()

  {/*
  // Dados do usuário (podem ser vindo de um API ou estado global)
  const [nome, setNome] = useState('João da Silva');
  const [email, setEmail] = useState('joao@abelhas.com');
  const [login, setLogin] = useState('joao.silva');
  const [tipoAcesso, setTipoAcesso] = useState('Funcionário');
  const [isEditing, setIsEditing] = useState(false); // Controla se está em modo de edição

  // Função para salvar as alterações
  const handleSave = () => {
    setIsEditing(false);
    // Aqui você pode salvar os dados no backend ou no estado global
  };*/}

  return (
    <div className="container-all">
      <div className='w-2/5'>
        <div className='flex items-center gap-4 text-2xl font-bold mb-6'>
          <button className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
            onClick={() => navigate('/home')}>
            <FaArrowLeft size={25} />
          </button>
          MEUS DADOS
        </div>
        <UserCard />
      </div>

      {/*
      <div className="user-card">
        <div className="avatar">
          <img src={defaultAvatar} alt="Avatar" className="avatar-img" />
        </div>

        <h2>Meus Dados</h2>

        <div className="user-info">
          <div className="info-field">
            <strong>Nome:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
              />
            ) : (
              <span>{nome}</span>
            )}
          </div>

          <div className="info-field">
            <strong>Email:</strong> 
            {isEditing ? (
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            ) : (
              <span>{email}</span>
            )}
          </div>

          <div className="info-field">
            <strong>Login:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                value={login} 
                onChange={(e) => setLogin(e.target.value)} 
              />
            ) : (
              <span>{login}</span>
            )}
          </div>

          <div className="info-field">
            <strong>Acesso:</strong> 
            {isEditing ? (
              <select value={tipoAcesso} onChange={(e) => setTipoAcesso(e.target.value)}>
                <option value="Administrador">Administrador</option>
                <option value="Funcionário">Funcionário</option>
              </select>
            ) : (
              <span>{tipoAcesso}</span>
            )}
          </div>
        </div>

        <button
          className="btn-editar"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
      </div>*/}
    </div>
  );
}

export default User;
