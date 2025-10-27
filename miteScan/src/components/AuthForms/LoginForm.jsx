import { useState } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [userType, setUserType] = useState('root'); // 'root' ou 'associated'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", senha);

      let loginUrl = '';
      let responseKey = '';

      if (userType === 'root') {
  loginUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/users_root/login`;
        responseKey = 'user_root';
      } else {
        loginUrl = "http://localhost:8000/UsersAssociated/login"; // Esta rota pode estar quebrada no backend
        responseKey = 'user_associated';
      }

      const response = await axios.post(loginUrl, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const { access_token } = response.data;
      const userData = response.data[responseKey];

      if (!userData) {
        throw new Error("Resposta do servidor não continha dados do usuário.");
      }

      // Limpa dados antigos e salva os novos
      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user_type", userType); // Salva o tipo de usuário

      if (userData.access_id) {
        localStorage.setItem("access_id", userData.access_id.toString());
      }

      setErro('');
      navigate('/home');

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response) {
        setErro(error.response.data.detail || "Credenciais inválidas.");
      } else {
        setErro("Erro de conexão com o servidor.");
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
        
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <label>
            <input 
              type="radio" 
              name="userType" 
              value="root" 
              checked={userType === 'root'} 
              onChange={() => setUserType('root')} 
            /> Administrador
          </label>
          <label>
            <input 
              type="radio" 
              name="userType" 
              value="associated" 
              checked={userType === 'associated'} 
              onChange={() => setUserType('associated')} 
            /> Funcionário
          </label>
        </div>

        <label className="text-md">Login:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-200 rounded p-2 w-full"
        />
        <label className="text-md">Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="bg-gray-200 rounded p-2 w-full"
        />
        <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded-xl shadow-md mt-6 mx-auto w-1/2">
          ENTRAR
        </button>
      </form>
      {erro && <p className="text-red-600 mt-2 font-semibold">{erro}</p>}
      <p className="text-md text-gray-600 mt-4">
        Não possui conta? <a href="/registration" className="font-bold">Cadastre-se!</a>
      </p>
    </div>
  );
}