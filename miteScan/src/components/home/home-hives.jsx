import { useEffect, useState } from "react";
import HivesImg from "../../assets/images/colmeia1.png";
import { FaThermometerHalf } from 'react-icons/fa';
import { MdHexagon, MdOutlineWaterDrop, MdVerifiedUser } from "react-icons/md";
import { TbAlertTriangleFilled, TbAlertOctagonFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function HomeHives() {
  const [hives, setHives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock dos dados do back-end
    const mockData = [
      {
        id: 1,
        temperature: 23,
        humidity: 42,
        latest_analysis: {
          varroa_detected: false,
        },
      },
      {
        id: 2,
        temperature: 36,
        humidity: 25,
        latest_analysis: {
          varroa_detected: false,
        },
      },
      {
        id: 3,
        temperature: 30,
        humidity: 45,
        latest_analysis: {
          varroa_detected: true,
        },
      },
      {
        id: 4,
        temperature: 39,
        humidity: 15,
        latest_analysis: {
          varroa_detected: true,
        },
      },
      {
        id: 5,
        temperature: 22,
        humidity: 55,
        latest_analysis: {
          varroa_detected: false,
        },
      },
    ];

    const parsed = mockData.map((hive) => {
      const { temperature, humidity, latest_analysis } = hive;

      const varroa = latest_analysis?.varroa_detected;
      const riscoTemperatura = temperature > 35;
      const riscoUmidade = humidity < 30;

      let status = "ok";
      if (varroa) {
        status = "perigo";
      } else if (riscoTemperatura || riscoUmidade) {
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
  }, []);

  return (
    <>
      <div className="bg-yellow-400 text-gray-800 text-lg font-bold py-1 rounded-t-xl shadow-md w-full mx-auto px-4">
        SUAS COLMEIAS <span className="font-extrabold">EM TEMPO REAL! 🐝</span>
      </div>

      <div className="bg-gray-100 py-4 px-10 rounded-b-xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 align-center w-full mx-auto">
        {hives.map((colmeia) => (
          <div
            key={colmeia.id}
            className="text-sm flex flex-col items-start bg-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform max-w-50 min-w-35 mx-auto"
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

              {colmeia.status === "ok" && (
                <MdVerifiedUser size={25} className="text-green-600 mr-2" />
              )}
              {colmeia.status === "alerta" && (
                <TbAlertTriangleFilled size={25} className="text-yellow-500 mr-3" />
              )}
              {colmeia.status === "perigo" && (
                <TbAlertOctagonFilled size={24} className="text-red-600 mr-2" />
              )}
            </div>

            <div className="text-md font-bold text-gray-700 flex items-center mx-2 mb-3">
              <FaThermometerHalf />
              {colmeia.temperatura}°C |
              <MdOutlineWaterDrop size={15} />
              {colmeia.umidade}%
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
