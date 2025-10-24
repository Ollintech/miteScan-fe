import { useState, useEffect } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Função para buscar os níveis de acesso do backend
    const fetchAccessLevels = async () => {
      try {
        setLoadingAccess(true);
        const response = await axios.get("http://localhost:8000/accesses/all");
        console.log("Níveis de acesso recebidos:", response.data);
        setAccessLevels(response.data);
      } catch (error) {
        console.error("Erro ao carregar os níveis de acesso:", error.response?.data || error.message);
        setErro("Erro ao carregar níveis de acesso. Tente novamente.");
      } finally {
        setLoadingAccess(false);
      }
    };

    fetchAccessLevels();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setErro(''); // Resetar erros

    if (!validateForm()) {
      return; // Se a validação falhar, não envia os dados
    }

    try {
      setLoading(true);
      
      // Enviar os dados de cadastro para a API
      const response = await axios.post("http://localhost:8000/users_root/register", {
        name: form.nome,
        email: form.email,
        password: form.senha,
        access_id: parseInt(form.access_id), // Garantir que seja um número
        company_id: form.company_id,
      });

      console.log("Cadastro realizado:", response.data);

      // Mostrar mensagem de sucesso
      alert("Usuário cadastrado com sucesso!");
      
      // Redireciona para a tela de login após cadastro bem-sucedido
      navigate("/login");

    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      
      if (error.response) {
        // Tratar diferentes tipos de erro do backend
        const errorData = error.response.data;
        if (errorData.detail) {
          setErro(errorData.detail);
        } else if (errorData.message) {
          setErro(errorData.message);
        } else if (typeof errorData === 'string') {
          setErro(errorData);
        } else {
          setErro("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
        }
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-3xl bg-white text-gray-700 rounded-xl p-8 shadow-lg">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-black flex items-center justify-center shadow-lg">
          <img src={BeeIcon} alt="Ícone" className="w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-center mt-8 mb-6">Cadastrar-se</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-[auto,1fr] items-center gap-3">
              <label className="text-sm font-semibold">Nome:</label>
              <input
                name="nome"
                placeholder="Gustavo Lanna"
                value={form.nome}
                onChange={handleChange}
                className="bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="grid grid-cols-[auto,1fr] items-center gap-3">
              <label className="text-sm font-semibold">Email:</label>
              <input
                name="email"
                placeholder="gustavo@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="grid grid-cols-[auto,1fr] items-center gap-3">
              <label className="text-sm font-semibold">Senha:</label>
              <input
                name="senha"
                type="password"
                placeholder="**********"
                value={form.senha}
                onChange={handleChange}
                className="bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="grid grid-cols-[auto,1fr] items-center gap-3">
              <label className="text-sm font-semibold">Acesso:</label>
              <select
                name="access_id"
                value={form.access_id}
                onChange={handleChange}
                className="bg-gray-100 rounded-md p-2"
                disabled={loadingAccess}
              >
                <option value="">Selecione o Acesso</option>
                {loadingAccess ? (
                  <option value="" disabled>Carregando níveis de acesso...</option>
                ) : accessLevels.length > 0 ? (
                  accessLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Nenhum nível de acesso encontrado</option>
                )}
              </select>
            </div>

            {erro && <p className="text-red-600 mt-1 font-semibold">{erro}</p>}

            <button
              type="submit"
              disabled={loading || loadingAccess}
              className={`${
                loading || loadingAccess 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-yellow-400 hover:bg-yellow-300"
              } text-black font-bold py-2 rounded-full shadow-md w-48 mx-auto mt-2`}
            >
              {loading ? "CADASTRANDO..." : "CADASTRAR"}
            </button>
          </form>

          <div className="md:border-l md:pl-6 text-sm leading-relaxed">
            <p>
              Este será o <span className="font-bold">usuário principal (root)</span> da conta.
            </p>
            <p className="mt-2">
              Com ele, você poderá acessar o sistema e
              <span className="font-bold"> criar acessos individuais</span> para sua equipe ou
              colaboradores.
            </p>
          </div>
        </div>

        <p className="text-sm text-center mt-6">
          Já possui conta? <a href="/login" className="font-bold">Voltar ao login!</a>
        </p>
      </div>
    </div>
  );
}
