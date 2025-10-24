import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserCard() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    access_id: '',
  });
  const [accessLevels, setAccessLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMEUyRTciLz48cGF0aCBkPSJNMjAgMjJDMjMuMzI4NCAyMiAyNiAxOS4zMjg0IDI2IDE2QzI2IDEyLjY3MTYgMjMuMzI4NCAxMCAyMCAxMEMxNi42NzE2IDEwIDE0IDEyLjY3MTYgMTQgMTZDMTQgMTkuMzI4NCAxNi42NzE2IDIyIDIwIDIyWk0yMCAyNUMxNC40NzcyIDI1IDEwIDI5LjQ3NzIgMTAgMzVDMTAgMzUuNTUyMyAxMC40NDc3IDM2IDExIDM2SDI5QzI5LjU1MjMgMzYgMzAgMzUuNTUyMyAzMCAzNUMzMCAyOS40NzcyIDI1LjUyMjggMjUgMjAgMjVaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==";


  useEffect(() => {
    const fetchAccessLevels = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Sessão inválida. Faça login novamente.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/accesses/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setAccessLevels(response.data);

      } catch (err) {
        console.error("Erro ao carregar níveis de acesso:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
        } else {
          setError('Não foi possível carregar os níveis de acesso.');
        }
      }
    };

    fetchAccessLevels();
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sessão inválida. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!form.name || !form.email || !form.password || !form.access_id || form.access_id === "0") {
      setError('Preencha todos os campos, incluindo o nível de acesso.');
      return;
    }

    const userRootString = localStorage.getItem('user'); 

    if (!userRootString) {
      setError('Sessão inválida. Faça login novamente.');
      return;
    }

    const userRoot = JSON.parse(userRootString);
    const userRootId = userRoot?.id;
    const isAdmin = userRoot?.access_id === 1;

    if (!userRootId || isNaN(userRootId)) {
      setError('Erro: ID do usuário raiz inválido. Faça login novamente.');
      return;
    }

    if (!isAdmin) {
      setError('Você não tem permissão para cadastrar usuários associados. Faça login como administrador.');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      access_id: Number(form.access_id),
      user_id: Number(userRootId),
    };

    try {
      setLoading(true);
      await axios.post(
        `/api/${userRootId}/users_associated/register`, 
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      setLoading(false);
      alert('Usuário associado cadastrado com sucesso!');
      setForm({ name: '', email: '', password: '', access_id: '' }); 
      navigate('/home');
      
    } catch (err) {
      setLoading(false);
      console.error("❌ Erro ao cadastrar usuário:", err);
      console.error("❌ Detalhes do erro:", err.response);

      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = 'Sua sessão expirou ou você não tem permissão.';
        } else if (err.response.status === 400) {
            errorMessage = err.response.data.detail || 'O email informado já está em uso.';
        } else if (err.response.status === 422) {
          errorMessage = 'Dados inválidos. Verifique se todos os campos estão corretos.';
        }
        
        if (err.response.data?.detail && typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl p-6 w-full mx-auto text-left">
      <div className="flex items-center gap-3 mb-4">
        <img src={defaultAvatar} alt="Avatar" className="w-10 h-10" />
        <span className="text-gray-700 text-sm">PREENCHA AS INFORMAÇÕES DO NOVO USUÁRIO</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Nome:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder="Maria Marques"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder="maria@gmail.com"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Senha:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder="**********"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Nível:</label>
          <select
            value={form.access_id}
            onChange={(e) => handleChange('access_id', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
          >
            <option value="">Selecione um nível</option>
            {accessLevels.map((level) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-600 mt-3 font-semibold">{error}</div>}

      <div className="flex justify-center mt-6">
        <button
          className={`bg-yellow-400 hover:bg-yellow-300 transition-colors px-8 py-2 font-bold rounded-lg shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'ENVIANDO...' : 'CONFIRMAR'}
        </button>
      </div>
    </div>
  );
}

