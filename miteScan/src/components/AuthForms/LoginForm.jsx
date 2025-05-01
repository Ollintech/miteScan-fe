import { useState } from "react";
import axios from "axios";
import BeeIcon from '../../assets/images/bee-icon.png'
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // Validação simples
    if (email === '' || senha === '') {
      setErro('Preencha todos os campos.')
      return
    }

    // Simulação de login
    if (email === 'abelha@teste.com' && senha === '123456') {
      setErro('')
      navigate('/home') // redireciona
    } else {
      setErro('Credenciais inválidas.')
    }
  }


  // conexão com o back
  {/*
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/host?", { email, senha });
      console.log("Login bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
    }
  }; */}

  return (
    <div className="w-full px-20 bg-gray-100 rounded-xl p-6 shadow-lg flex flex-col items-center">
      <div className="w-35 h-35 rounded-full bg-black flex items-center justify-center -mt-24 mb-4">
        <img src={BeeIcon} alt="Ícone" className="w-35" />
      </div>
      <h2 className="text-xl text-gray-600 font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="w-full flex  text-gray-600 flex-col gap-2">
        <label className="text-md">Login:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-200 rounded p-2"
        />
        <label className="textmd">Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="bg-gray-200 rounded p-2"
        />
        <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded-xl shadow-md mt-6 mx-auto w-1/2">
          ENTRAR
        </button>
      </form>
      <p className="text-md text-gray-600 mt-4">
        Não possui conta? <a href="/registration" className="font-bold">Cadastre-se!</a>
      </p>
    </div>
  );
}
