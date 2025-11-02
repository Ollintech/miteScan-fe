import { useState, useEffect } from "react";
import BeeIcon from '../../assets/images/bee-icon.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    account: "",
  });

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simplificado. Removemos a lógica 'if' desnecessária.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { nome, email, senha, account } = form;
    if (!nome || !email || !senha || !account) {
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
    if (e && e.preventDefault) e.preventDefault();
    setErro('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.nome,
        email: form.email,
        password: form.senha,
        account: form.account,
        access_id: 4, // O 'access_id' é definido aqui, diretamente.
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/users_root/register`, payload);

      alert("Usuário cadastrado com sucesso!");
      navigate("/login");

    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);

      if (error.response) {
        const errorData = error.response.data;
        if (errorData.detail) {
          // Este 'if' agora trata o erro de ID 4
          if (errorData.detail.includes("is not present in table \"accesses\"")) {
            setErro("Erro: O nível de acesso ID 4 não existe no banco de dados.");
          }
          else if (errorData.detail.includes("account")) {
            setErro("Esse nome de conta já está em uso. Tente outro.");
          } else if (errorData.detail.includes("Email")) {
            setErro("Este email já está cadastrado.");
          }
          else {
            setErro(errorData.detail);
          }
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
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-25 h-25 rounded-full bg-black flex items-center justify-center shadow-lg">
          <img src={BeeIcon} alt="Ícone" className="w-25" />
        </div>
        <h2 className="text-2xl font-extrabold text-center mt-8 mb-6">Cadastrar-se</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label htmlFor="nome" className="w-28 text-sm font-semibold">Nome:</label>
              <input
                id="nome"
                name="nome"
                placeholder="Insira seu nome"
                value={form.nome}
                onChange={handleChange}
                className="flex-1 bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="email" className="w-28 text-sm font-semibold">Email:</label>
              <input
                id="email"
                name="email"
                placeholder="nome@email.com"
                value={form.email}
                onChange={handleChange}
                className="flex-1 bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="senha" className="w-28 text-sm font-semibold">Senha:</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                className="flex-1 bg-gray-100 rounded-md p-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="account" className="w-28 text-sm font-semibold">Conta:</label>
              <input
                id="account"
                name="account"
                placeholder="Login único (ex: 'minha-empresa')"
                value={form.account}
                onChange={handleChange}
                className="flex-1 bg-gray-100 rounded-md p-2"
              />
            </div>

            {erro && <p className="text-red-600 mt-1 font-semibold">{erro}</p>}
          </form>

          <div className="md:border-l md:pl-6 text-lg leading-relaxed font-medium content-center">
            <p>
              Este será o <span className="font-bold">usuário principal (root)</span> da conta.
            </p>
            <p className="mt-2 text-md font-medium text-gray-600">
              O campo <span className="font-bold">'Conta'</span> será o seu identificador
              único para criar e associar seus funcionários.
            </p>
            <p className="mt-2 text-lg font-medium">
              Com ele, você poderá criar acessos individuais para sua equipe.
            </p>
          </div>
        </div>

        {/* Button centered under both columns */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300"
              } text-black font-bold py-3 px-8 rounded-full shadow-md w-48 transform active:translate-y-0.5`}
          >
            {loading ? "CADASTRANDO..." : "CADASTRAR"}
          </button>
        </div>

        <p className="text-sm text-center mt-6">
          Já possui conta? <a href="/login" className="font-bold">Voltar ao login!</a>
        </p>
      </div>
    </div>
  );
}