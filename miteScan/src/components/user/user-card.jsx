import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/images/default-avatar.png';

export default function UserCard() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    login: '',
    access: '', // ex: "Administrador"
  });

  const [isEditing, setIsEditing] = useState(false);

  // Simula carregamento inicial
  useEffect(() => {
    // MOCK de usuário (substitua com fetch real depois)
    const mockUser = {
      name: 'José Abelha',
      email: 'jose.abelha@gmail.com',
      login: 'jose.abelha',
      access: 'Administrador',
    };

    setUserData(mockUser);

    // Quando for usar o back-end:
    /*
    fetch('/api/users/me') // ou `/api/users/${id}`
      .then((res) => res.json())
      .then((data) => {
        setUserData({
          name: data.name,
          email: data.email,
          login: data.login, // certifique-se que o campo esteja no back
          access: data.access_type || 'Funcionário',
        });
      })
      .catch((err) => console.error('Erro ao carregar usuário', err));
    */
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);

    // Salvar alterações no back (comentado por enquanto)
    /*
    fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao atualizar usuário');
        return res.json();
      })
      .then((updatedUser) => {
        setUserData(updatedUser);
      })
      .catch((err) => console.error('Erro ao salvar alterações', err));
    */
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl p-6 w-full mx-auto text-left">
      {/* Avatar */}
      <div className="flex justify-center">
        <img src={defaultAvatar} alt="Avatar" className="w-30" />
      </div>

      {/* Informações */}
      <div className="mt-6 space-y-3 mx-[4%]">
        {/* Nome */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Nome:</label>
          {isEditing ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{userData.name}</div>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={userData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{userData.email}</div>
          )}
        </div>

        {/* Login */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Login:</label>
          {isEditing ? (
            <input
              type="text"
              value={userData.login}
              onChange={(e) => handleChange('login', e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            />
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{userData.login}</div>
          )}
        </div>

        {/* Acesso */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Acesso:</label>
          {isEditing ? (
            <select
              value={userData.access}
              onChange={(e) => handleChange('access', e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            >
              <option value="Administrador">Administrador</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{userData.access}</div>
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
