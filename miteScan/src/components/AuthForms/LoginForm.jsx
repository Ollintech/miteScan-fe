import { useState } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false); // Adicionado estado de loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros antigos

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    // Prepara os dados do formulário
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const config = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };

    try {
      // --- Tentativa 1: Login como UserRoot ---
      const rootLoginUrl = `${base}/users_root/login`;
      const response = await axios.post(rootLoginUrl, formData, config);

      // Se chegou aqui, o login Root funcionou
      const { access_token } = response.data;
      const userData = response.data['user_root']; // Chave específica do Root
      const userType = 'root';

      // Salva os dados no localStorage
      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user_type", userType);
      if (userData.access_id) {
        localStorage.setItem("access_id", userData.access_id.toString());
      }

      setLoading(false);
      navigate('/home');

    } catch (rootError) {
      // Se o login Root falhou, verificamos o motivo
      if (rootError.response && rootError.response.status === 401) {
        // Se foi 401 (Credenciais Inválidas), tentamos o login Associado
        try {
          // --- Tentativa 2: Login como UserAssociated ---
          // IMPORTANTE: Este é o seu novo endpoint!
          const associatedLoginUrl = `${base}/users_associated/login`; 
          const response = await axios.post(associatedLoginUrl, formData, config);

          // Se chegou aqui, o login Associado funcionou
          const { access_token } = response.data;
          // A chave de resposta aqui é 'user_associated'
          const userData = response.data['user_associated']; 
          const userType = 'associated';

          localStorage.clear();
          localStorage.setItem("token", access_token);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("user_type", userType);
          if (userData.access_id) {
            localStorage.setItem("access_id", userData.access_id.toString());
          }
          
          // Precisamos salvar o user_root_id que vem no payload do associado
          if (userData.user_root_id) {
             localStorage.setItem("user_root_id", userData.user_root_id.toString());
          }

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
          onChange={(e) => setSenha(e.targe.value)}
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