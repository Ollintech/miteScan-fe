import { useState } from 'react';
import defaultAvatar from '../../assets/images/default-avatar.png';

export default function UserCard() {
  const [nome, setNome] = useState('José Abelha');
  const [email, setEmail] = useState('jose.abelha@gmail.com');
  const [login, setLogin] = useState('jose.abelha');
  const [tipoAcesso, setTipoAcesso] = useState('Administrador');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // salvar alterações
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl p-6 w-full mx-auto text-left">
      {/* Avatar */}
      <div className="flex justify-center">
          <img src={defaultAvatar} alt="Avatar" className="w-30" />
      </div>

      {/* Informações */}
      <div className="mt-6 space-y-3 mx-20">
        {/* Nome */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Nome:</label>
          {isEditing ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{nome}</div>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{email}</div>
          )}
        </div>

        {/* Login */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Login:</label>
          {isEditing ? (
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{login}</div>
          )}
        </div>

        {/* Acesso */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Acesso:</label>
          {isEditing ? (
            <select
              value={tipoAcesso}
              onChange={(e) => setTipoAcesso(e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            >
              <option value="Administrador">Administrador</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{tipoAcesso}</div>
          )}
        </div>
      </div>

      {/* Botão */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 transition-colors px-8 py-2 font-bold rounded-lg shadow-md"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? 'SALVAR' : 'EDITAR'}
        </button>
      </div>
    </div>
  );
}
