import { useEffect, useState } from 'react';
import defaultAvatar from '../../assets/images/default-avatar.png';
import axios from 'axios';

export default function UserCard() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    login: '',
    access: '',  // Exemplo: 'Ativo' ou 'Inativo'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const [error, setError] = useState(null);      // Estado para erros

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user) {
      setError('Você precisa estar logado.');
      setLoading(false);
      return;
    }

    setUserData({
      name: user.name,
      email: user.email,
      login: user.email,  // Exemplo, você pode usar outro campo se necessário
      access: user.status ? 'Ativo' : 'Inativo',  // Ou outro campo que represente o status
    });

    setLoading(false);
  }, []);  // Executa apenas uma vez após o componente ser montado

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
  setLoading(true);
  setError(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    setError('Você precisa estar logado.');
    setLoading(false);
    return;
  }

  const userId = user.id; // Garantir que o ID do usuário seja um número válido

  // Aqui estamos garantindo que o status seja passado como true, caso não tenha sido modificado
  const formData = {
    name: userData.name, // nome do usuário
    email: userData.email, // email do usuário
    password: userData.password, // nova senha (se houver alteração)
    status: userData.status !== undefined ? userData.status : true, // Garantindo que status seja true se não enviado
    access_id: Number(userData.access_id), // access_id deve ser um número inteiro
    company_id: Number(userData.company_id), // company_id deve ser um número inteiro
  };

  try {
    const response = await axios.put(
      `http://localhost:8000/users/${userId}`, // Endpoint para atualizar o usuário
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Atualizar localStorage com os novos dados
    localStorage.setItem('user', JSON.stringify(response.data));

    // Atualiza o estado local (pode ser o estado do seu componente)
    setUserData({
      name: response.data.name,
      email: response.data.email,
      login: response.data.login,
      access: response.data.access,
      status: response.data.status, // Atualiza o status também
    });

    setLoading(false);
    alert('Usuário atualizado com sucesso!');
  } catch (error) {
    setLoading(false);
    console.error("Erro ao salvar os dados:", error.response ? error.response.data : error);
    setError(error.response ? error.response.data.detail : 'Erro ao salvar os dados.');
  }
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

        {/* Acesso */}
        <div className="flex items-center space-x-2">
          <label className="w-20 font-medium">Acesso:</label>
          {isEditing ? (
            <select
              value={userData.access}
              onChange={(e) => handleChange('access', e.target.value)}
              className="flex-1 px-3 py-1 rounded-md bg-white shadow-inner"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          ) : (
            <div className="flex-1 px-3 py-1 rounded-md bg-gray-200 shadow-inner">{userData.access}</div>
          )}
        </div>
      </div>

      {/* Erro e Loading */}
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500 mt-3">{error}</div>}

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
