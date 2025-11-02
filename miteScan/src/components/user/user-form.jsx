import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserForm({ mode = 'create', userId = null }) {
  // mode: 'create' | 'edit' | 'delete'
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', access_id: '', status: '' });
  const [accessLevels, setAccessLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`${base}/accesses/all`, { headers: { Authorization: `Bearer ${token}` } });
        setAccessLevels(res.data || []);
      } catch (err) {
        console.error('Erro ao carregar níveis de acesso', err);
      }
    };
    fetchAccess();
  }, [base, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (mode === 'create') return;

      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      if (!token || !userString) {
        setError('Sessão inválida. Faça login novamente.');
        navigate('/login');
        return;
      }

      let account;
      try {
        const u = JSON.parse(userString);
        account = u?.account || localStorage.getItem('account');
      } catch (e) {
        console.error('Erro ao parsear user do localStorage', e);
      }
      if (!account) {
        setError('Account não encontrado.');
        navigate('/login');
        return;
      }

      if (!userId) {
        setError('ID do usuário não informado.');
        return;
      }

      try {
        setLoading(true);

        const url = `${base}/${account}/users_associated/${userId}`;
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data || {};
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          access_id: data.access_id ? String(data.access_id) : '',
          status: typeof data.status === 'boolean' ? String(data.status) : (data.status ?? ''),
        });
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [mode, userId, base, navigate]);

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  /**
   * Tenta formatar a mensagem de erro de validação 422 do FastAPI.
   * O 'detail' é geralmente um array de objetos.
   * ex: [{ loc: ["body", "password"], msg: "field required", type: "value_error" }]
   */
  const formatFastApiError = (detail) => {
    if (Array.isArray(detail)) {
      try {
        const msg = detail
          .map((d) => {
            // d.loc é um array, ex: ["body", "password"]
            // Pegamos o último item (nome do campo)
            const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : d.loc;
            // d.msg é a mensagem de erro, ex: "must have at least 8 characters"
            return `${field}: ${d.msg}`;
          })
          .join(' | '); // Junta várias mensagens
        return msg;
      } catch (e) {
        console.error('Erro ao formatar "detail" do FastAPI:', e, detail);
        return JSON.stringify(detail); // Fallback
      }
    } else if (typeof detail === 'string') {
      return detail; // Erro simples de string (ex: email já existe)
    }
    // Fallback para outros tipos de erro
    return 'Erro desconhecido ao processar resposta da API.';
  };


  const handleSubmit = async () => {
    setError('');
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (!token || !userString) {
      setError('Sessão inválida. Faça login novamente.');
      navigate('/login');
      return;
    }
    let account;
    try {
      const u = JSON.parse(userString);
      account = u?.account || localStorage.getItem('account');
    } catch {}
    if (!account) {
      setError('Account não encontrado.');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'create') {
        if (!form.name || !form.email || !form.password || !form.access_id) {
          setError('Preencha todos os campos.');
          setLoading(false);
          return;
        }
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          access_id: Number(form.access_id),
          account: account,
        };
        const url = `${base}/${account}/users_associated/register`;
        await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuário associado cadastrado com sucesso!');
        navigate('/home');
      } else if (mode === 'edit') {
        if (!userId) {
          setError('ID do usuário não informado.');
          setLoading(false);
          return;
        }
        const payload = {
          name: form.name,
          email: form.email,
          access_id: Number(form.access_id),
        };
        if (form.status !== '') payload.status = (String(form.status) === 'true');
        if (form.password) payload.password = form.password;
        const url = `${base}/${account}/users_associated/${userId}`;
        await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuário atualizado com sucesso!');
        navigate('/users');
      } else if (mode === 'delete') {
        if (!userId) {
          setError('ID do usuário não informado.');
          setLoading(false);
          return;
        }
        // Perform backend deletion
        const url = `${base}/${account}/users_associated/${userId}?confirm=true`;
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        alert('Usuário excluído com sucesso!');
        navigate('/users');
      }

    } catch (err) {
      console.error('Erro na operação de usuário:', err);
      
      const resp = err.response?.data;
      if (resp && resp.detail) {
        setError(formatFastApiError(resp.detail));
      } else {
        setError(resp?.message || err.message || 'Erro ao processar requisição.');
      }

    } finally {
      setLoading(false);
    }
  };

  const readonly = mode === 'delete';
  const submitLabel = mode === 'create' ? 'CADASTRAR' : mode === 'edit' ? 'EDITAR' : 'EXCLUIR';
  const submitClass = mode === 'delete' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-yellow-400 hover:bg-yellow-300';

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl p-6 w-full mx-auto text-left">
      <div className="flex items-center justify-center gap-3 mb-7">
        <img src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFMEUyRTciLz48cGF0aCBkPSJNMjAgMjJDMjMuMzI4NCAyMiAyNiAxOS4zMjg0IDI2IDE2QzI2IDEyLjY3MTYgMjMuMzI4NCAxMCAyMCAxMEMxNi42NzE2IDEwIDE0IDEyLjY3MTYgMTQgMTZDMTQgMTkuMzI4NCAxNi42NzE2IDIyIDIwIDIyWk0yMCAyNUMxNC40NzcyIDI1IDEwIDI5LjQ3NzIgMTAgMzVDMTAgMzUuNTUyMyAxMC40NDc3IDM2IDExIDM2SDI5QzI5LjU1MmEgMzYgMzAgMzUuNTUyMyAzMCAzNUMzMCAyOS40NzcyIDI1LjUyMjggMjUgMjAgMjVaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=="} alt="Avatar" className="w-10 h-10" />
        <span className="text-gray-700 text-md font-bold">{mode === 'create' ? 'PREENCHA AS INFORMAÇÕES DO NOVO USUÁRIO' : mode === 'edit' ? 'EDITAR USUÁRIO' : 'Deseja mesmo excluir este usuário?'}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Nome:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder="nome"
            readOnly={readonly}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder="nome@email.com"
            readOnly={readonly}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Senha:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            placeholder={mode === 'edit' ? 'Deixe em branco para manter a senha' : 'Senha do usuário'}
            readOnly={readonly}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Nível:</label>
          <select
            value={form.access_id}
            onChange={(e) => handleChange('access_id', e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
            disabled={readonly}
          >
            <option value="">Selecione um nível</option>
            {accessLevels.map((level) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>

        {mode !== 'create' && (
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-800 font-semibold text-sm">Status:</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
              disabled={readonly}
            >
              <option value="">Selecione o status</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        )}
      </div>

      {error && <div className="text-red-600 mt-3 font-semibold">{error}</div>}

      <div className="flex justify-center mt-6">
        <button
          className={`${submitClass} transition-colors font-bold shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${mode === 'delete' ? 'px-6 py-2 rounded-full' : 'px-8 py-2 rounded-lg'}`}
          onClick={handleSubmit}
          disabled={loading}
          aria-label={mode === 'delete' ? 'Excluir usuário' : undefined}
          title={mode === 'delete' ? 'Excluir usuário' : undefined}
        >
          {loading ? (mode === 'delete' ? 'EXCLUINDO...' : 'ENVIANDO...') : submitLabel}
        </button>
      </div>
    </div>
  );
}


