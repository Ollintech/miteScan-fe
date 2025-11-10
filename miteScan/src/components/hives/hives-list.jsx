import Image from "../../assets/images/colmeia2.jpg";
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
    const fetchHivesWithAnalysis = async () => {
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
        let user;

        try {
          const userObj = JSON.parse(userString);
          user = userObj;
          account = userObj?.account || localStorage.getItem('account');
          
          const accessId = userObj?.access_id ?? userObj?.access?.id;
          setIsUserRoot(Number(accessId) === 4);
        } catch (e) {
          console.error("Erro ao parsear dados do usuário:", e);
          setError("Erro ao ler sessão. Faça login novamente.");
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!account) {
          console.error("Erro: account não encontrado.");
          setError("Account não encontrado. Faça login novamente.");
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

        try {
          const beeTypesResponse = await axios.get(`${base}/bee_types/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBeeTypes(beeTypesResponse.data);
        } catch (e) {
          console.error("Erro ao buscar tipos de abelha:", e);
        }

        const url = `${base}/${account}/hives/all`;

        const hivesResponse = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hivesData = hivesResponse.data;

        const hivesWithAnalysis = await Promise.all(
          hivesData.map(async (hive) => {
            try {
              const analysisResponse = await axios.get(
                `${base}/hive_analyses/hive/${hive.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return { ...hive, analysis: analysisResponse.data };
            } catch {
              console.warn(`Nenhuma análise encontrada para colmeia ${hive.id}`);
              return { ...hive, analysis: null };
            }
          })
        );

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

    fetchHivesWithAnalysis();
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
    if (analysis.varroa_detected) return "perigo";

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

  return (
    <div className="p-4 sm:p-6">
      <div className="w-full max-w-[90%] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:max-w-full gap-4">
        <div className="flex items-center gap-4 text-base sm:text-xl font-bold">
          <button
            className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-2 sm:py-3 px-3 sm:px-4"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft size={20} className="sm:w-6" />
          </button>
          <span className="text-sm sm:text-base lg:text-xl">MINHAS COLMEIAS</span>
        </div>
        {isUserRoot && (
        <button
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold p-2 sm:p-3 text-xs sm:text-base w-full sm:w-auto"
          onClick={() => navigate("/create-hive")}
        >
          <MdAdd size={20} className="sm:w-6" />
          <span className="sm:inline">ADICIONAR</span>
        </button>)}
      </div>

      <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-2 w-full">

        {error && (
          <div className="text-center p-4 text-red-600 font-semibold">{error}</div>
        )}
        {loading && (
          <div className="text-center p-10 text-gray-600 font-semibold">Carregando colmeias...</div>
        )}
        {!loading && !error && hives.length === 0 && (
          <div className="text-center p-10 text-gray-600 font-semibold">Nenhuma colmeia cadastrada.</div>
        )}

        <div className="grid gap-6 sm:mx-0 mx-auto max-w-[95%]">
          {!loading && hives.map((hive) => {
            const analysis = hive.analysis;
            const estado = getEstado(analysis, hive);

            return (
              <div key={hive.id} className="flex flex-col sm:flex-row items-center w-full gap-4">
                <div className="flex flex-col sm:flex-row h-full w-full shadow-lg rounded-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 shadow-md rounded-xl bg-gray-100 overflow-hidden sm:p-0">
                    <img
                      src={Image}
                      alt={`Colmeia ${hive.name}`}
                      className="w-full sm:w-32 h-32 sm:h-full object-cover rounded-t-xl sm:rounded-t-none sm:rounded-l-xl"
                    />

                    <div className="flex flex-col gap-3 text-start font-bold text-sm p-4 w-full">
                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} />
                        {hive.name}
                      </div>

                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} />
                        {hive.size || '--'} cm
                      </div>

                      <div className="flex items-center gap-2">
                        <img src={Bee} alt="Abelha" style={{ width: 18, height: 18 }} />
                        {getBeeTypeName(hive.bee_type_id).toUpperCase()}
                      </div>

                      <div className="flex items-center gap-2">
                        <TbWorldLatitude size={18} />
                        {`${hive.location_lat}, ${hive.location_lng}`}
                      </div>
                    </div>


                    <div className="h-25 w-0.5 bg-gray-600 mx-2 rounded-xl hidden sm:block"></div>
                    <div className="flex gap-2 sm:flex-col sm:pr-3 sm:space-y-8 text-sm">
                      <div className="flex gap-2 items-center">
                        <FaThermometerHalf
                          size={22}
                          color={getTemperatureColor(hive.temperature)}
                        />
                        {hive.temperature ?? "--"}°C
                      </div>
                      <div className="flex gap-2 items-center">
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
                      )} gap-2`}
                    >
                      {getIcon(estado)}
                      <span className="font-bold uppercase text-sm">{estado}</span>
                    </div>
                  </div>
                </div>

                {isUserRoot && (
                  <div className="flex sm:flex-col flex-row gap-4 sm:ml-3 items-center mt-4 sm:mt-0">
                    <button onClick={() => navigate(`/edit-hive/${hive.id}`)}>
                      <MdEdit size={25} />
                    </button>
                    <button onClick={() => navigate(`/delete-hive/${hive.id}`)}>
                      <FaTrash size={20} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}