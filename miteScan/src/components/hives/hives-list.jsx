import Bee from "../../assets/images/miniBee.png";
import {
  FaMapMarkerAlt,
  FaTrash,
  FaThermometerHalf,
  FaArrowLeft,
} from "react-icons/fa";
import {
  MdAdd,
  MdEdit,
  MdHexagon,
  MdOutlineWaterDrop,
  MdVerifiedUser,
} from "react-icons/md";
import { TbAlertTriangleFilled, TbAlertOctagonFilled, TbWorldLatitude } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HivesList() {
  const [hives, setHives] = useState([]);
  const [beeTypes, setBeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserRoot, setIsUserRoot] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHivesAndAnalyses = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          setError("Sessão inválida. Faça login novamente.");
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        let account;
        try {
          const userObj = JSON.parse(userString);
          account = userObj?.account || localStorage.getItem('account');

          const userType = localStorage.getItem("user_type");
          setIsUserRoot(userType === 'root' || userType === 'associated');
        } catch (e) {
          console.error("Erro ao parsear dados do usuário:", e);
          setError("Erro ao ler sessão. Faça login novamente.");
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!account) {
          setError("Account não encontrado. Faça login novamente.");
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        // 1. Busca tipos de abelha, colmeias e todas as análises em paralelo (muito mais rápido)
        const [beeTypesRes, hivesRes, analysesRes] = await Promise.all([
          axios.get(`${base}/bee_types/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: [] })),
          
          axios.get(`${base}/${account}/hives/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get(`${base}/hive_analyses/all`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { account },
          }).catch(() => ({ data: [] }))
        ]);

        setBeeTypes(beeTypesRes.data);
        const hivesData = hivesRes.data || [];
        const analysesData = analysesRes.data || [];

        // 2. Associa a análise mais recente de cada colmeia em memória (sem requisições extras)
        const latestAnalysisMap = new Map();
        analysesData.forEach((analysis) => {
          // Se houver várias análises para a mesma colmeia, guarda a mais recente
          if (!latestAnalysisMap.has(analysis.hive_id)) {
            latestAnalysisMap.set(analysis.hive_id, analysis);
          }
        });

        const hivesWithAnalysis = hivesData.map((hive) => ({
          ...hive,
          analysis: latestAnalysisMap.get(hive.id) || null,
        }));

        setHives(hivesWithAnalysis);
      } catch (error) {
        console.error("Erro ao buscar colmeias:", error);
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            setError("Sessão expirada. Faça login novamente.");
            setTimeout(() => navigate('/login'), 2000);
          } else if (error.response.status === 404) {
            setError("Nenhuma colmeia encontrada.");
          } else {
            setError("Erro ao carregar colmeias.");
          }
        } else {
          setError("Erro de rede ao buscar colmeias.");
        }
        setHives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHivesAndAnalyses();
  }, [navigate]);

  function getTemperatureColor(temp) {
    if (temp == null) return "gray";
    if (temp >= 33.5 && temp <= 36) return "green";
    return "red";
  }

  function getHumidityColor(hum) {
    if (hum == null) return "gray";
    if (hum >= 37 && hum <= 43) return "green";
    return "red";
  }

  function getEstado(analysis, hive) {
    if (!analysis) return "segura";
    if (analysis.varroa_detected || analysis.bee_status === 'deformada') return "perigo";

    const tempOk = hive.temperature >= 33.5 && hive.temperature <= 36;
    const humOk = hive.humidity >= 37 && hive.humidity <= 43;

    if (!tempOk || !humOk) return "alerta";
    return "segura";
  }

  function getIcon(estado) {
    if (estado === "segura")
      return <MdVerifiedUser size={28} className="text-green-600" />;
    if (estado === "alerta")
      return <TbAlertTriangleFilled size={28} className="text-yellow-500" />;
    return <TbAlertOctagonFilled size={25} className="text-red-600" />;
  }

  function getBgColor(estado) {
    if (estado === "segura") return "bg-green-200";
    if (estado === "alerta") return "bg-yellow-200";
    return "bg-red-200";
  }

  function getBeeTypeName(typeId) {
    if (!beeTypes || beeTypes.length === 0) {
      return (typeId || '--').toString();
    }
    const beeType = beeTypes.find(bt => bt.id === Number(typeId));
    return beeType ? beeType.name : (typeId || '--').toString();
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const SUPABASE_PROJECT_URL = "https://angzdelcvwneuqwhmfbd.supabase.co"; 
    const BUCKET_NAME = "images-mitescan";

    const cleanFileName = imagePath.split('/').filter(Boolean).pop();

    return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${BUCKET_NAME}/hives/${encodeURIComponent(cleanFileName)}`;
  };

  return (
    <div className="p-4 sm:p-6 relative min-h-[80vh]">
      <div className="w-full max-w-[95%] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:pr-14">
        <div className="flex items-center gap-4 text-base sm:text-xl font-bold">
          <button
            className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-2 sm:py-3 px-3 sm:px-4 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft size={20} className="sm:w-6" />
          </button>
          <span className="text-sm sm:text-base lg:text-xl">MINHAS COLMEIAS</span>
        </div>

        {isUserRoot && (
          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 rounded-xl font-bold p-3 text-base shadow-md transition-all duration-200 active:scale-95 hover:shadow-lg"
            onClick={() => navigate("/create-hive")}
          >
            <MdAdd size={24} />
            <span>ADICIONAR COLMEIA</span>
          </button>
        )}
      </div>

      {isUserRoot && (
        <button
          className="fixed bottom-8 right-8 z-50 flex sm:hidden items-center justify-center w-14 h-14 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-lg transition-all duration-200 active:scale-95"
          onClick={() => navigate("/create-hive")}
          title="Adicionar Colmeia"
        >
          <MdAdd size={32} />
        </button>
      )}

      <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-2 w-full">

        {loading && (
          <div className="text-center p-10 text-gray-600 font-semibold animate-pulse">Carregando colmeias...</div>
        )}
        {!loading && error && hives.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">
              você ainda não possui colmeias.
            </p>
            <button
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all duration-200 active:scale-95"
              onClick={() => navigate("/create-hive")}
            >
              <MdAdd size={20} />
              Comece aqui!
            </button>
          </div>
        )}

        <div className="grid gap-6 mx-auto max-w-[95%]">
          {!loading && hives.map((hive) => {
            const analysis = hive.analysis;
            const estado = getEstado(analysis, hive);

            return (
              <div 
                key={hive.id} 
                className="flex flex-col sm:flex-row items-center w-full gap-4 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row h-full w-full shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 border border-transparent hover:border-amber-300/60 overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 shadow-md rounded-xl bg-gray-100 overflow-hidden sm:p-0">
                    <div className="w-full sm:w-32 h-32 sm:h-full overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(hive.image_path)}
                        alt={`Colmeia ${hive.name}`}
                        className="w-full h-full object-cover rounded-t-xl sm:rounded-t-none sm:rounded-l-xl transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col gap-3 text-start font-bold text-sm p-4 w-full">
                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} className="text-amber-500" />
                        {hive.name}
                      </div>

                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} className="text-gray-400" />
                        {hive.size || '--'} cm
                      </div>

                      <div className="flex items-center gap-2">
                        <img src={Bee} alt="Abelha" style={{ width: 18, height: 18 }} />
                        {getBeeTypeName(hive.bee_type_id).toUpperCase()}
                      </div>

                      <div className="flex items-center gap-2">
                        <TbWorldLatitude size={18} className="text-gray-500" />
                        {`${hive.location_lat}, ${hive.location_lng}`}
                      </div>
                    </div>

                    <div className="h-25 w-0.5 bg-gray-300 mx-2 rounded-xl hidden sm:block"></div>
                    
                    <div className="flex gap-2 sm:flex-col sm:pr-3 sm:space-y-8 text-sm">
                      <div className="flex gap-2 items-center font-bold">
                        <FaThermometerHalf
                          size={22}
                          color={getTemperatureColor(hive.temperature)}
                        />
                        {hive.temperature ?? "--"}°C
                      </div>
                      <div className="flex gap-2 items-center font-bold">
                        <MdOutlineWaterDrop
                          size={22}
                          color={getHumidityColor(hive.humidity)}
                        />
                        {hive.humidity ?? "--"}%
                      </div>
                    </div>

                    <div
                      className={`flex flex-row sm:flex-col items-center justify-center p-3 w-full sm:w-28 h-20 sm:h-full ${getBgColor(
                        estado
                      )} gap-2 transition-colors duration-300`}
                    >
                      {getIcon(estado)}
                      <span className="font-bold uppercase text-[10px] sm:text-xs tracking-wider">
                        {analysis?.bee_status || estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col flex-row gap-4 sm:ml-3 items-center mt-4 sm:mt-0">
                  <button 
                    onClick={() => navigate(`/edit-hive/${hive.id}`)} 
                    title="Editar Colmeia"
                    className="p-2 rounded-full hover:bg-yellow-100 transition-all duration-200 active:scale-90"
                  >
                    <MdEdit size={25} className="text-gray-700 hover:text-yellow-600 transition-colors" />
                  </button>
                  <button 
                    onClick={() => navigate(`/delete-hive/${hive.id}`)} 
                    title="Excluir Colmeia"
                    className="p-2 rounded-full hover:bg-red-100 transition-all duration-200 active:scale-90"
                  >
                    <FaTrash size={20} className="text-gray-700 hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}