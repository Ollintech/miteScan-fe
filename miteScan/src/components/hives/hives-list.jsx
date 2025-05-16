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
import { TbAlertTriangleFilled, TbAlertOctagonFilled } from "react-icons/tb";
import { TbWorldLatitude } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HivesList() {
  const [hives, setHives] = useState([]);
  const [beeTypes, setBeeTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHivesWithAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1. Buscar colmeias
        const hivesResponse = await axios.get("http://localhost:8000/hives/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hivesData = hivesResponse.data;

        // 2. Buscar análises de cada colmeia
        const hivesWithAnalysis = await Promise.all(
          hivesData.map(async (hive) => {
            try {
              const analysisResponse = await axios.get(
                `http://localhost:8000/hive_analyses/${hive.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return { ...hive, analysis: analysisResponse.data };
            } catch (error) {
              console.warn(`Sem análise para colmeia ${hive.id}`);
              return { ...hive, analysis: null };
            }
          })
        );

        setHives(hivesWithAnalysis);
      } catch (error) {
        console.error("Erro ao buscar colmeias:", error);
      }
    };

    const fetchBeeTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/bee_types/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBeeTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de abelha:", error);
      }
    };

    fetchHivesWithAnalysis();
    fetchBeeTypes();
  }, []);

  function getBeeTypeName(id) {
    const beeType = beeTypes.find((bt) => bt.id === id);
    return beeType ? beeType.name : "Tipo desconhecido";
  }

  function getTemperatureColor(temp) {
    if (temp == null) return "gray";
    if (temp >= 34 && temp <= 36) return "green";
    return "red";
  }

  function getHumidityColor(hum) {
    if (hum == null) return "gray";
    if (hum >= 33 && hum <= 47) return "green";
    return "red";
  }
  function getEstado(analysis, hive) {
    if (!analysis) return "segura";
    if (analysis.varroa_detected) return "perigo";

    const tempOk = hive.temperature > 33 && hive.temperature < 37;
    const humOk = hive.humidity >= 33 && hive.humidity <= 47;

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mr-10">
        <div className="flex items-center gap-4 text-2xl font-bold">
          <button
            className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
            onClick={() => navigate("/home")}
          >
            <FaArrowLeft size={25} />
          </button>
          MINHAS COLMEIAS
        </div>
        <button
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold p-3"
          onClick={() => navigate("/create-hive")}
        >
          <p className="ml-2">ADICIONAR</p>
          <MdAdd size={25} />
        </button>
      </div>

      {/* Lista */}
      <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-2">
        <div className="grid gap-6">
          {hives.map((hive) => {
            const analysis = hive.analysis;
            console.log(`Colmeia ${hive.id}: Temp = ${hive.temperature}, Hum = ${hive.humidity}, Varroa = ${analysis?.varroa_detected}`);
            const estado = getEstado(analysis, hive);

            return (
              <div key={hive.id} className="flex items-center w-full">
                <div className="flex h-full w-full shadow-lg rounded-xl">
                  <div className="flex items-center h-full justify-between w-full gap-4 shadow-md rounded-xl bg-gray-100 overflow-hidden">
                    {/* Imagem */}
                    <img
                      src={Image}
                      alt={`Colmeia ${hive.name}`}
                      className="w-32 h-full object-cover"
                    />

                    {/* Info */}
                    <div className="flex flex-col gap-3 py-6 text-start font-bold text-sm w-full">
                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} />
                        COLMEIA {hive.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Bee} className="w-4" />
                        {getBeeTypeName(hive.bee_type_id)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={18} />
                        {hive.size} cm
                      </div>
                      <div className="flex items-center gap-2">
                        <TbWorldLatitude size={18} />
                        {`${hive.location_lat}, ${hive.location_lng}`}
                      </div>
                    </div>

                    {/* Medidas */}
                    <div className="h-25 w-0.5 bg-gray-600 mx-2 rounded-xl"></div>
                    <div className="pr-3 space-y-8">
                      <div className="flex gap-1">
                        <FaThermometerHalf
                          size={22}
                          color={getTemperatureColor(hive.temperature)}
                        />
                        {hive.temperature ?? "--"}°C
                      </div>
                      <div className="flex gap-1">
                        <MdOutlineWaterDrop
                          size={22}
                          color={getHumidityColor(hive.humidity)}
                        />
                        {hive.humidity ?? "--"}%
                      </div>
                    </div>

                    {/* Estado */}
                    <div
                      className={`flex flex-col items-center justify-center p-3 w-28 h-full ${getBgColor(
                        estado
                      )}`}
                    >
                      {getIcon(estado)}
                      <span className="font-bold uppercase">{estado}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-6 ml-3 items-center">
                  <button onClick={() => navigate(`/edit-hive/${hive.id}`)}>
                    <MdEdit size={25} />
                  </button>
                  <button onClick={() => navigate(`/delete-hive/${hive.id}`)}>
                    <FaTrash size={20} />
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
