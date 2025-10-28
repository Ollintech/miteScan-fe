import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { MdAdd, MdEdit } from "react-icons/md";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        // No credentials -> redirect to login
        setError("Sessão inválida. Faça login novamente.");
        navigate('/login');
        setLoading(false);
        return;
      }

      let userRootId;
      try {
        const userObj = JSON.parse(userString);
        userRootId = userObj?.id;
      } catch (e) {
        console.error('Erro ao ler usuário da sessão:', e);
      }

      if (!userRootId) {
        setError('ID do usuário raiz inválido. Faça login novamente.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const url = `${base}/${userRootId}/users_associated`;
  const response = await axios.get(url, { headers: token ? { Authorization: `Bearer ${token}` } : {}, });
  setUsers(response.data || []);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Sua sessão expirou ou você não tem permissão.');
          navigate('/login');
        } else {
          setError('Erro ao carregar usuários.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="w-full max-w-[90%] mx-auto flex items-center justify-between mb-6 sm:max-w-full">
        <div className="flex items-center gap-4 sm:text-xl font-bold">
          <button
            className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft size={22} />
          </button>
          USUÁRIOS
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold p-3"
          onClick={() => navigate("/new-user")}
        >
          <MdAdd size={22} />
          <span className="hidden sm:inline ml-1">CADASTRAR NOVO</span>
        </button>
      </div>

      {/* Tabela */}
      <div className="w-full max-w-[90%] mx-auto bg-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] bg-gray-100 text-gray-700 font-semibold text-sm">
          <div className="p-4 text-center border-r">Nome</div>
          <div className="p-4 text-center border-r">Email</div>
          <div className="p-4 text-center border-r">Nível</div>
          <div className="p-4 text-center">Ações</div>
        </div>

        {loading && (
          <div className="p-6 text-center text-sm">Carregando...</div>
        )}
        {error && !loading && (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div>
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-[2fr_2fr_1fr_1fr] text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="p-4 text-center border-t border-r">
                  {user.name}
                </div>
                <div className="p-4 text-center border-t border-r break-words">
                  {user.email}
                </div>
                <div className="p-4 text-center border-t border-r">
                  {user.nivel}
                </div>
                <div className="p-4 text-center border-t">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="hover:text-yellow-600"
                      onClick={() => navigate(`/edit-user/${user.id}`)}
                      title="Editar"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="hover:text-red-600"
                      onClick={() => navigate(`/delete-user/${user.id}`)}
                      title="Excluir"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}