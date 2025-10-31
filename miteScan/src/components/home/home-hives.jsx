import { useEffect, useState } from "react";
import HivesImg from "../../assets/images/colmeia1.png";
import {
  FaThermometerHalf,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import {
  MdHexagon,
  MdOutlineWaterDrop,
  MdVerifiedUser,
  MdAdd
} from "react-icons/md";
import {
  TbAlertTriangleFilled,
  TbAlertOctagonFilled
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomeHives() {
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Adicionado estado de erro
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHivesWithAnalysis = async () => {
      setLoading(true);
      setError(""); // Limpa erros anteriores

      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          setError("Sessão inválida. Faça login novamente."); // Define o erro
          setLoading(false);
          navigate('/login');
          return;
        }

        // --- INÍCIO DA CORREÇÃO (baseado em access_id) ---
        let idParaRota;
        try {
          const userObj = JSON.parse(userString);
          const accessId = Number(userObj?.access_id);
          idParaRota = accessId === 1 ? userObj?.id : userObj?.user_root_id;
        } catch (e) {
          console.error("❌ Erro ao parsear dados do usuário:", e);
          setError("Erro ao ler sessão. Faça login novamente.");
          setLoading(false);
          navigate('/login');
          return;
        }
        
        if (!idParaRota) {
           console.error("❌ Erro: ID de rota (user_root_id) não encontrado.");
           setError("ID do usuário inválido. Faça login novamente.");
           setLoading(false);
           navigate('/login');
           return;
        }
        // --- FIM DA CORREÇÃO ---

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        
        const url = `${base}/${idParaRota}/hives/all`; // URL usa o ID corrigido

        const hivesResponse = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hivesData = hivesResponse.data;

        const hivesWithAnalysis = await Promise.all(
          hivesData.map(async (hive) => {
            try {
              // NOTA: Esta rota também pode precisar do user_root_id
              const analysisResponse = await axios.get(`${base}/hive_analyses/hive/${hive.id}`, {
                  headers: { Authorization: `Bearer ${token}` } // Adicionado token
              });
              return { ...hive, analysis: analysisResponse.data };
            } catch {
              console.warn(`Nenhuma análise encontrada para colmeia ${hive.id}`);
              return { ...hive, analysis: null };
            }
          })
        );

        const parsed = hivesWithAnalysis.map((hive) => {
          const { temperature, humidity, analysis } = hive;
          const varroa = analysis?.varroa_detected;

          const tempOk = temperature > 33 && temperature < 37;
          const humOk = humidity >= 33 && humidity <= 47;

          let status = "ok";
          if (varroa) {
            status = "perigo";
          } else if (!tempOk || !humOk) {
            status = "alerta";
          }

          return {
            id: hive.id,
            nome: `COLMEIA ${hive.id}`,
            temperatura: temperature,
            umidade: humidity,
            status,
            imagem: HivesImg,
          };
        });

        setHives(parsed);
      } catch (error) {
        console.error("❌ Erro ao buscar colmeias:", error);
        
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                setError("Sessão expirada. Faça login novamente.");
                navigate('/login');
            } else if (error.response.status === 404) {
                setError("Nenhuma colmeia encontrada."); // Mensagem específica para 404
            } else {
                setError("Erro ao carregar colmeias.");
            }
        } else {
            setError("Erro de rede. Verifique sua conexão.");
        }
        
        setHives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHivesWithAnalysis();
  }, [navigate]);

  const renderIcon = (status) => {
    if (status === "ok") return <MdVerifiedUser size={25} className="text-green-600 mr-2" />;
    if (status === "alerta") return <TbAlertTriangleFilled size={25} className="text-yellow-500 mr-3" />;
    return <TbAlertOctagonFilled size={24} className="text-red-600 mr-2" />;
  };

  return (
    <>
      <div className="bg-yellow-400 text-gray-800 text-lg font-bold py-1 rounded-t-xl shadow-md w-full mx-auto px-4">
        SUAS COLMEIAS <span className="font-extrabold">EM TEMPO REAL! 🐝</span>
      </div>

      <div className="bg-gray-100 py-4 px-10 rounded-b-xl shadow-md w-full mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-lg font-semibold text-gray-600">Carregando colmeias...</div>
          </div>
        // Adiciona exibição de erro
        ) : error ? ( 
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <p className="text-lg font-semibold text-red-600">
                    {error}
                </p>
            </div>
        ) : hives.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">
              Não há colmeias cadastradas no momento.
            </p>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-xl flex items-center gap-2"
              onClick={() => navigate("/create-hive")}
            >
              <MdAdd size={20} />
              Nova colmeia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6">
            {hives.map((colmeia) => (
              <div
                key={colmeia.id}
                className="text-sm flex flex-col items-start bg-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform max-w-50 min-w-35 mx-auto cursor-pointer"
                onClick={() => navigate(`/hives/${colmeia.id}`)}
              >
                <img
                  src={colmeia.imagem}
                  alt={colmeia.nome}
                  className="h-25 w-full object-cover rounded-xl mb-2"
                />

                <div className="flex items-center justify-between mx-2 w-full">
                  <div className="flex gap-1">
                    <MdHexagon size={18} />
                    <h3 className="text-gray-800 font-semibold">{colmeia.nome}</h3>
                  </div>
                  {renderIcon(colmeia.status)}
                </div>

                <div className="text-md font-bold text-gray-700 flex items-center mx-2 mb-3">
                  <FaThermometerHalf />
                  {colmeia.temperatura ?? "--"}°C&nbsp;|&nbsp;
                  <MdOutlineWaterDrop size={15} />
                  {colmeia.umidade ?? "--"}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}