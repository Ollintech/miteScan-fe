import { useState } from 'react';
import defaultAvatar from '../../assets/images/default-avatar.png';

export default function UserCard() {
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
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-2xl p-10 w-full">
      <div className="w-37 mx-auto">
        <img src={defaultAvatar} alt="Avatar" className="avatar-img" />
      </div>

      <div className='justify-items-start mt-5 mb-8'>
        <div className="space-x-10 p-2">
          <strong>Nome:</strong>
          {isEditing ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          ) : (
            <span className='bg-gray-200 px-6 py-1 shadow'>{nome}</span>
          )}
        </div>

        <div className="space-x-10 p-2">

          <strong>Email:</strong>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <span className='bg-gray-200 px-1 py-1 shadow'>{email}</span>
          )}
        </div>

        <div className="space-x-10 p-2">
          <strong>Login:</strong>
          {isEditing ? (
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          ) : (
            <span className='bg-gray-200 px-10 py-1 shadow'>{login}</span>
          )}
        </div>

        <div className="space-x-7 p-2">
          <strong>Acesso:</strong>
          {isEditing ? (
            <select value={tipoAcesso} onChange={(e) => setTipoAcesso(e.target.value)}>
              <option value="Administrador">Administrador</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          ) : (
            <span className='bg-gray-200 px-7.5 py-1 shadow'>{tipoAcesso}</span>
          )}
        </div>
      </div>

      <button
        className="bg-yellow-400 py-2 px-7 font-bold shadow-md rounded-xl"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? 'SALVAR' : 'EDITAR'}
      </button>
    </div>
  )
}