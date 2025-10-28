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
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchHivesWithAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🏠 HomeHives - Token encontrado:", token ? "Sim" : "Não");

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        const hivesResponse = await axios.get(`${base}/hives/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hivesData = hivesResponse.data;
        console.log("🏠 HomeHives - Colmeias recebidas:", hivesData.length);
        console.log("🏠 HomeHives - Dados das colmeias:", hivesData);

        const hivesWithAnalysis = await Promise.all(
          hivesData.map(async (hive) => {
            try {
              try {
              const analysisResponse = await axios.get(`${base}/hive_analyses/hive/${hive.id}`);
              return { ...hive, analysis: analysisResponse.data };
            } catch {
              return { ...hive, analysis: null };
            }
            } catch {
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
        console.error("❌ Detalhes do erro:", error.response?.data || error.message);
        
        setHives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHivesWithAnalysis();
  }, []);

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
