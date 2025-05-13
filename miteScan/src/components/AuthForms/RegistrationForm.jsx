import { useState, useEffect } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Função de cadastro
export default function RegistrationForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    access_id: "",
    company_id: 1,
  });

  const [accessLevels, setAccessLevels] = useState([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Função para buscar os níveis de acesso do backend
    const fetchAccessLevels = async () => {
      try {
        const response = await axios.get("http://localhost:8000/accesses/all");
        console.log("Níveis de acesso recebidos:", response.data);
        setAccessLevels(response.data);
      } catch (error) {
        console.error("Erro ao carregar os níveis de acesso:", error.response?.data || error.message);
      }
    };

    fetchAccessLevels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "access_id" || name === "company_id" ? parseInt(value) : value,
    });
  };

  const validateForm = () => {
    const { nome, email, senha, access_id } = form;
    if (!nome || !email || !senha || !access_id) {
      setErro("Preencha todos os campos.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Por favor, insira um email válido.");
      return false;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: form.nome,
      email: form.email,
      password: form.senha,
      access_id: form.access_id,
      company_id: form.company_id,
    };

    console.log("Dados enviados para cadastro:", payload);

    try {
      const response = await axios.post("http://localhost:8000/users/register", payload);
      console.log("Cadastro realizado:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      if (error.response) {
        setErro(error.response.data.detail || "Erro ao cadastrar usuário.");
      } else {
        setErro("Erro de conexão com o servidor.");
      }
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
          name="access_id"
          value={form.access_id}
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

        {erro && <p className="text-red-600 mt-2 font-semibold">{erro}</p>}

        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold py-2 rounded shadow-md mx-auto w-2/3 mt-2"
        >
          CADASTRAR
        </button>
      </form>
      <p className="text-sm mt-4">
        Já possui conta? <a href="/login" className="font-bold">Voltar ao login!</a>
      </p>
    </div>
  );
}
