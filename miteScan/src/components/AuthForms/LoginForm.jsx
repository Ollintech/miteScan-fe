import { useState } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // OAuth2 padrão
      formData.append("password", senha);

      const response =  await axios.post("http://host.docker.internal:8000/users/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setErro('');
      navigate('/home');

    } catch (error) {
      if (error.response) {
        setErro(error.response.data.detail || "Erro ao fazer login.");
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
