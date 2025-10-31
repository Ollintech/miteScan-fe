import { useState } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); 

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const config = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };

    try {
      // --- Tentativa 1: Login como UserRoot ---
      const rootLoginUrl = `${base}/auth/login/root`;
      const response = await axios.post(rootLoginUrl, formData, config);

      const { access_token } = response.data;
      // <-- CORRIGIDO: A chave é 'user' para ambos os tipos
      const userData = response.data.user; 
      const userType = 'root';

      if (!userData || typeof userData !== 'object') {
        console.error('Login (root) retornou sem dados de usuário válidos:', response.data);
        setLoading(false);
        setErro('Erro: dados do usuário ausentes no servidor.');
        return;
      }

      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData)); // userData agora tem {id, ..., role: 'root'}
      localStorage.setItem("user_type", userType);

      setLoading(false);
      navigate('/home');

    } catch (rootError) {
      if (rootError.response && rootError.response.status === 401) {
        // Se foi 401 (Credenciais Inválidas), tentamos o login Associado
        try {
          // --- Tentativa 2: Login como UserAssociated ---
          const associatedLoginUrl = `${base}/auth/login/associated`; 
          const response = await axios.post(associatedLoginUrl, formData, config);

          const { access_token } = response.data;
           // <-- CORRIGIDO: A chave também é 'user', como corrigimos no backend
          const userData = response.data.user;
          const userType = 'associated';
          
          if (!userData || typeof userData !== 'object') {
             console.error('Login (associated) retornou sem dados de usuário válidos:', response.data);
             setLoading(false);
             setErro('Erro: dados do usuário ausentes no servidor.');
             return;
          }
          
          // Validação crucial que resolve nosso problema anterior
          if (!userData.user_root_id) {
              console.error('Login (associated) não retornou um user_root_id:', userData);
              setLoading(false);
              setErro('Erro: Falha ao obter ID de permissão do associado.');
              return;
          }

          localStorage.clear();
          localStorage.setItem("token", access_token);
          // userData agora tem {id, ..., role: 'associated', user_root_id: ...}
          localStorage.setItem("user", JSON.stringify(userData)); 
          localStorage.setItem("user_type", userType);
          
          // Esta linha é opcional pois o user_root_id já está dentro do objeto 'user',
          // mas não tem problema manter
          localStorage.setItem("user_root_id", userData.user_root_id.toString());

          setLoading(false);
          navigate('/home');

        } catch (associatedError) {
          // Se o login Associado também falhou
          setLoading(false);
          const detail = associatedError.response?.data?.detail;
          setErro(detail || "Credenciais inválidas.");
        }
      } else {
        // Se o erro do Root foi outro (ex: 500, erro de rede)
        setLoading(false);
        console.error("Erro ao fazer login (Root):", rootError);
        setErro(rootError.response?.data?.detail || "Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="w-full px-[13vw] bg-gray-100 rounded-xl p-6 shadow-lg flex flex-col items-center">
      <div className="w-30 h-30 rounded-full bg-black flex items-center justify-center -mt-24 mb-4">
        <img src={BeeIcon} alt="Ícone" className="w-30" />
      </div>
      <h2 className="text-xl text-gray-600 font-bold mb-4">Login</h2>
      
      <form onSubmit={handleLogin} className="w-full flex text-gray-600 flex-col gap-2">
        <label className="text-md">Login:</label>
        <input
          placeholder="Insira seu Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-200 rounded p-2 w-full"
          disabled={loading}
        />
        <label className="text-md">Senha:</label>
        <input
          placeholder="Insira sua senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="bg-gray-200 rounded p-2 w-full"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded-xl shadow-md mt-6 mx-auto w-1/2 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </form>
      {erro && <p className="text-red-600 mt-2 font-semibold">{erro}</p>}
      <p className="text-md text-gray-600 mt-4">
        Não possui conta? <a href="/registration" className="font-bold">Cadastre-se!</a>
      </p>
    </div>
  );
}