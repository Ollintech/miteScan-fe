import { useState, useEffect } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import axios from "axios";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    acesso: "",
    company_id: 1,  // Ajuste conforme a lógica do seu sistema
  });

  const [accessLevels, setAccessLevels] = useState([]);

  useEffect(() => {
    // Função para buscar os níveis de acesso do backend
    const fetchAccessLevels = async () => {
      try {
        const response = await axios.get("http://host.docker.internal:8000/access/all");
        setAccessLevels(response.data);
      } catch (error) {
        console.error("Erro ao carregar os níveis de acesso:", error.response?.data || error.message);
      }
    };
    
    
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Altere a URL para a sua API
      const response = await axios.post("http://host.docker.internal:8000/users/register", {
        name: form.nome,
        email: form.email,
        password: form.senha,
        access_id: form.acesso,
        company_id: form.company_id,
      });
      console.log("Cadastro realizado:", response.data);
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
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="bg-gray-200 rounded p-2"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="bg-gray-200 rounded p-2"
        />
        <input
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="bg-gray-200 p-2"
        />

          <select
            name="acesso"
            value={form.acesso}
            onChange={handleChange}
            className="bg-gray-200 rounded p-2"
          >
            <option value="">Selecione o Acesso</option>
            {accessLevels.length > 0 ? (
              accessLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))
            ) : (
              <option value="" disabled>Carregando níveis de acesso...</option>
            )}
          </select>

          
        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold py-2 rounded shadow-md mx-auto w-2/3 mt-2"
        >
          CADASTRAR
        </button>
      </form>
      <p className="text-sm mt-4">
        Já possui conta? <a href="/" className="font-bold">Voltar ao login!</a>
      </p>
    </div>
  );
}
