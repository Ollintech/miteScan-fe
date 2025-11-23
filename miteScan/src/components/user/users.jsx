import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaTrash, FaUserCircle } from "react-icons/fa";
import { MdAdd, MdEdit } from "react-icons/md";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
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
        setError("Sessão inválida. Faça login novamente.");
        navigate('/login');
        setLoading(false);
        return;
      }

      let account;
      try {
        const userObj = JSON.parse(userString);
        account = userObj?.account || localStorage.getItem('account');
      } catch (e) {
        console.error('Erro ao ler usuário da sessão:', e);
      }

      if (!account) {
        setError('Account não encontrado. Faça login novamente.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        
        const [usersResponse, accessLevelsResponse] = await Promise.all([
          axios.get(`${base}/${account}/users_associated`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          axios.get(`${base}/accesses/all`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);
        
        setUsers(usersResponse.data || []);
        setAccessLevels(accessLevelsResponse.data || []);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Sessão expirada ou credenciais inválidas. Faça login novamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('account');
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

  const getAccessLevelName = (accessId) => {
    if (!accessId || !accessLevels.length) {
      return accessId || '--';
    }
    const accessLevel = accessLevels.find(level => level.id === Number(accessId));
    return accessLevel ? accessLevel.name : accessId;
  };

  const getStatusInfo = (status) => {
    const value = typeof status === 'string' ? status.toLowerCase() : status;
    if (value === false || value === 'false' || value === 'inativo') {
      return { label: 'Inativo', dotClass: 'bg-red-500' };
    }
    return { label: 'Ativo', dotClass: 'bg-green-500' };
  };

  return (
    <div className="p-6">
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

      {loading && (
        <div className="w-full max-w-[90%] mx-auto bg-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.15)] p-6 text-center text-xs sm:text-sm">
          Carregando...
        </div>
      )}

      {error && !loading && (
        <div className="w-full max-w-[90%] mx-auto bg-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.15)] p-6 text-center text-red-600 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Tabela para Desktop */}
          <div className="hidden md:block w-full max-w-[90%] mx-auto bg-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.15)] overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] bg-gray-100 text-gray-700 font-semibold text-xs lg:text-sm">
                <div className="p-4 text-left border-r">Nome</div>
                <div className="p-4 text-left border-r">Email</div>
                <div className="p-4 text-center border-r">Nível</div>
                <div className="p-4 text-center border-r">Status</div>
                <div className="p-4 text-center">Ações</div>
              </div>

              {users.length === 0 ? (
                <div className="bg-white">
                  <div className="p-4 text-center text-sm text-gray-500 font-medium border-t" style={{ gridColumn: '1 / -1' }}>
                    Nenhum usuário cadastrado.
                  </div>
                </div>
              ) : (
                users.map((user, index) => (
                  <div
                    key={user.id}
                    className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr] text-xs lg:text-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="p-4 text-left border-t border-r break-words">
                      {user.name}
                    </div>
                    <div className="p-4 text-left border-t border-r break-words">
                      {user.email}
                    </div>
                    <div className="p-4 text-center border-t border-r">
                      {getAccessLevelName(user.access_id)}
                    </div>
                    <div className="p-4 text-center border-t border-r">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <span className={`w-2 h-2 rounded-full ${getStatusInfo(user.status).dotClass}`} />
                        {getStatusInfo(user.status).label}
                      </span>
                    </div>
                    <div className="p-4 text-center border-t">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="hover:text-yellow-600 transition-colors"
                          onClick={() => navigate(`/edit-user/${user.id}`)}
                          title="Editar"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className="hover:text-red-600 transition-colors"
                          onClick={() => navigate(`/delete-user/${user.id}`)}
                          title="Excluir"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lista para Mobile */}
          {users.length === 0 ? (
            <div className="md:hidden w-full max-w-[93%] mx-auto bg-white rounded-xl shadow-[0_8px_12px_rgba(0,0,0,0.15)] p-6 text-center text-gray-500 font-semibold text-base sm:text-lg">
              Nenhum usuário cadastrado.
            </div>
          ) : (
            <div className="md:hidden w-full max-w-[93%] mx-auto space-y-5">
              {users.map((user) => {
                const statusInfo = getStatusInfo(user.status);
                return (
                  <div
                    key={user.id}
                    className="bg-gray-100 rounded-3xl shadow-[0_10px_16px_rgba(0,0,0,0.12)] px-5 py-6"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0">
                            <FaUserCircle className="text-gray-500 w-12 h-12" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-gray-800 font-semibold text-base leading-tight truncate">{user.name}</p>
                            <p className="text-gray-600 text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 mt-1 flex-shrink-0">
                          <span className={`w-3 h-3 rounded-full ${statusInfo.dotClass}`} />
                          {statusInfo.label}
                        </span>
                      </div>

                      <hr className="border-gray-300"></hr>
                      
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wide">
                          Nível: {getAccessLevelName(user.access_id)}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/edit-user/${user.id}`)}
                            className="inline-flex items-center justify-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-md transition-colors text-sm"
                          >
                            <MdEdit size={18} />
                            Editar
                          </button>
                          <button
                            onClick={() => navigate(`/delete-user/${user.id}`)}
                            className="inline-flex items-center justify-center gap-1 bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-3 rounded-xl shadow-md transition-colors text-sm"
                          >
                            <FaTrash size={16} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}