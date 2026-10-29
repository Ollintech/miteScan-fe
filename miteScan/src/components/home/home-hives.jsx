import { useEffect, useState, useCallback } from "react";
import HivesImg from "../../assets/images/colmeia1.png";
import { FaThermometerHalf } from 'react-icons/fa';
import {
  MdHexagon,
  MdOutlineWaterDrop,
  MdVerifiedUser,
  MdAdd,
  MdRefresh
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchHivesWithAnalysis = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        if (isInitial) {
          setError("Sessão inválida. Faça login novamente.");
          navigate('/login');
        }
        return;
      }

      let account;
      try {
        const userObj = JSON.parse(userString);
        account = userObj?.account || localStorage.getItem('account');
      } catch {
        if (isInitial) {
          setError("Erro ao ler sessão. Faça login novamente.");
          navigate('/login');
        }
        return;
      }

      if (!account) {
        if (isInitial) {
          setError("Account não encontrado. Faça login novamente.");
          navigate('/login');
        }
        return;
      }

      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const [hivesRes, analysesRes] = await Promise.all([
        axios.get(`${base}/${account}/hives/all`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }),
        axios.get(`${base}/hive_analyses/all`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { account },
          timeout: 5000
        }).catch(() => ({ data: [] }))
      ]);

      const hivesData = hivesRes.data || [];
      const analysesData = analysesRes.data || [];

      if (!Array.isArray(hivesData) || hivesData.length === 0) {
        setHives([]);
        return;
      }

      const latestAnalysisMap = new Map();
      analysesData.forEach((analysis) => {
        if (!latestAnalysisMap.has(analysis.hive_id)) {
          latestAnalysisMap.set(analysis.hive_id, analysis);
        }
      });

      const parsed = hivesData.map((hive) => {
        const analysis = latestAnalysisMap.get(hive.id) || null;
        const { temperature, humidity } = hive;
        const varroa = analysis?.varroa_detected;
        const beeStatus = analysis?.bee_status;

        const tempOk = temperature >= 33.5 && temperature <= 36;
        const humOk = humidity >= 37 && humidity <= 43;

        let status = "ok";
        let displayStatus = beeStatus || (varroa ? 'varroa' : 'normal');

        if (varroa || beeStatus === 'deformada') {
          status = "perigo";
        } else if (!tempOk || !humOk) {
          status = "alerta";
          if (displayStatus === 'normal') displayStatus = 'alerta';
        }

        return {
          id: hive.id,
          nome: hive.name ? hive.name : `Colmeia ${hive.id}`,
          temperatura: temperature,
          umidade: humidity,
          status,
          beeStatus: displayStatus,
          imagem: hive.image_path ? hive.image_path : HivesImg,
        };
      });

      setHives(parsed);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setError("Sessão expirada. Faça login novamente.");
          navigate('/login');
        } else if (error.response.status === 404) {
          setError("");
          setHives([]);
          return;
        } else if (isInitial) {
          setError("Erro ao carregar colmeias.");
        }
      } else if (isInitial) {
        setError("Erro de rede. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchHivesWithAnalysis(true);

    // Atualização automática em segundo plano a cada 20 segundos
    const interval = setInterval(() => {
      fetchHivesWithAnalysis(false);
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchHivesWithAnalysis]);

  const renderIcon = (status) => {
    if (status === "ok") return <MdVerifiedUser size={25} className="text-green-600 mr-2" />;
    if (status === "alerta") return <TbAlertTriangleFilled size={25} className="text-yellow-500 mr-3" />;
    return <TbAlertOctagonFilled size={24} className="text-red-600 mr-2" />;
  };

  return (
    <>
      <div className="bg-yellow-400 text-gray-800 text-base sm:text-lg font-bold py-2 rounded-t-xl shadow-md w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>SUAS COLMEIAS</span>
          <span className="font-extrabold">🐝</span>
        </div>

        <button
          onClick={() => fetchHivesWithAnalysis(false)}
          disabled={refreshing || loading}
          title="Atualizar"
          className="p-1.5 rounded-full text-black/60 hover:text-black hover:bg-black/10 transition-all active:scale-90 disabled:opacity-30 flex items-center justify-center"
        >
          <MdRefresh size={19} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-gray-100 py-4 px-10 rounded-b-xl shadow-md w-full mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-lg font-semibold text-gray-600">Carregando colmeias...</div>
          </div>
        ) : error ? ( 
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <p className="text-lg font-semibold text-red-600">{error}</p>
            </div>
        ) : hives.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">
              Você ainda não possui colmeias.
            </p>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-xl flex items-center gap-2"
              onClick={() => navigate("/create-hive")}
            >
              <MdAdd size={20} />
              Comece aqui!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-10 gap-y-4 sm:gap-y-6">
            {hives.slice(0, 5).map((colmeia) => (
              <div
                key={colmeia.id}
                className="text-sm flex flex-col items-start bg-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform w-full max-w-sm mx-auto cursor-pointer"
                onClick={() => navigate(`/hives/${colmeia.id}`)}
              >
                <img
                  src={colmeia.imagem}
                  alt={colmeia.nome}
                  className="h-18 sm:h-26 w-full object-cover rounded-xl mb-2"
                />

                <div className="flex items-center justify-between px-2 w-full">
                  <div className="flex gap-1 items-center min-w-0 pr-2">
                    <MdHexagon size={18} className="shrink-0" />
                    <h3 className="text-gray-800 font-semibold text-xs sm:text-sm truncate" title={colmeia.nome}>{colmeia.nome}</h3>
                  </div>
                  <div className="shrink-0">
                    {renderIcon(colmeia.status)}
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-gray-700 flex flex-wrap items-center px-2 mb-3 gap-y-1">
                  <div className="flex items-center">
                    <FaThermometerHalf size={14} />
                    <span className="ml-1">{colmeia.temperatura ?? "--"}°C</span>
                  </div>
                  <span className="mx-2">|</span>
                  <div className="flex items-center">
                    <MdOutlineWaterDrop size={14} />
                    <span className="ml-1">{colmeia.umidade ?? "--"}%</span>
                  </div>
                  <span className="mx-2">|</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                    colmeia.status === 'ok' ? 'bg-green-200 text-green-800' : 
                    colmeia.status === 'alerta' ? 'bg-orange-200 text-orange-800' : 
                    'bg-red-200 text-red-800'
                  }`}>
                    {colmeia.beeStatus}
                  </span>
                </div>
              </div>
            ))}
            {hives.length > 5 && (
              <div className="flex items-center justify-center w-full max-w-sm mx-auto">
                <button
                  onClick={() => navigate("/hives")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-md transition-colors w-40 h-25 flex items-center justify-center"
                >
                  Ver mais...
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
