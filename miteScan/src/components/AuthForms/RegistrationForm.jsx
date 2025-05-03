import { useState } from "react";
import axios from "axios";
import BeeIcon from '../../assets/images/bee-icon.png'

export default function RegistrationForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    login: "",
    senha: "",
    acesso: "Administrador",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/cadastrar", form);
      console.log("Cadastro realizado:", response.data);
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full px-[13vw] bg-gray-100 text-gray-600 rounded-xl p-6 shadow-lg flex flex-col items-center">
      <div className="w-30 h-30 rounded-full bg-black flex items-center justify-center -mt-24 mb-4">
        <img src={BeeIcon} alt="Ícone" className="w-35" />
      </div>
      <h2 className="text-xl font-bold mb-4">Cadastrar-se</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="bg-gray-200 rounded p-2" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="bg-gray-200 rounded p-2" />
        <input name="login" placeholder="Login" value={form.login} onChange={handleChange} className="bg-gray-200 rounded p-2" />
        <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} className="bg-gray-200 p-2" />
        <select name="acesso" value={form.acesso} onChange={handleChange} className="bg-gray-200 rounded p-2">
          <option>Administrador</option>
          <option>Usuário</option>
        </select>
        <button type="submit" className="bg-yellow-400 text-black font-bold py-2 rounded shadow-md mx-auto w-2/3 mt-2">
          CADASTRAR
        </button>
      </form>
      <p className="text-sm mt-4">
        Já possui conta? <a href="/" className="font-bold">Voltar ao login!</a>
      </p>
    </div>
  );
}
