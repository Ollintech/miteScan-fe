import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import resultImage from '../../assets/images/colmeia1.png';
import { FaThermometerHalf } from 'react-icons/fa';
import { MdOutlineWaterDrop } from "react-icons/md";
import { TbAlertTriangleFilled, TbAlertOctagonFilled } from "react-icons/tb";
import { MdVerifiedUser } from "react-icons/md";

export default function Result() {
  const location = useLocation();
  const { hiveAnalysisId } = location.state || {};
  const [analysis, setAnalysis] = useState(null);
  const [hive, setHive] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetch = async () => {
      try {
        const analysisResponse = await axios.get(
          `http://localhost:8000/hive_analyses/${hiveAnalysisId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const analysisData = analysisResponse.data;
        setAnalysis(analysisData);

        const hiveResponse = await axios.get(
          `http://localhost:8000/hives/${analysisData.hive_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setHive(hiveResponse.data);
      } catch (error) {
        console.error('Erro ao buscar análise ou colmeia:', error);
      }
    };

    if (hiveAnalysisId) {
      fetch();
    }
  }, [hiveAnalysisId]);

  if (!analysis || !hive) {
    return <p className="text-center font-semibold">Carregando análise...</p>;
  }

  const isTempOk = hive.temperature >= 34 && hive.temperature <= 36;
  const isHumidityOk = hive.humidity >= 33 && hive.humidity <= 47;

  let status = 'segura';
  if (analysis.varroa_detected) {
    status = 'perigo';
  } else if (!isTempOk || !isHumidityOk) {
    status = 'alerta';
  }

  const statusConfig = {
    segura: {
      color: 'text-green-600',
      icon: <MdVerifiedUser size={20} />,
      message: 'COLMEIA SEGURA, NENHUMA VARROA IDENTIFICADA.',
    },
    alerta: {
      color: 'text-yellow-500',
      icon: <TbAlertTriangleFilled size={20} />,
      message: 'COLMEIA EM ALERTA, CONDIÇÕES AMBIENTAIS FORA DO IDEAL.',
    },
    perigo: {
      color: 'text-red-600',
      icon: <TbAlertOctagonFilled size={20} />,
      message: 'PERIGO! VARROA DETECTADA NA COLMEIA.',
    },
  };

  const { color, icon, message } = statusConfig[status];

  return (
    <>
      <div className={`flex items-center font-semibold text-sm mb-2 gap-2 ${color}`}>
        {icon}
        <span>{message}</span>
      </div>

      <div className="bg-gray-100 rounded-xl shadow-lg w-full mx-auto">
        <img
          src={resultImage}
          alt="Resultado da análise"
          className="w-full h-80 object-cover rounded-md"
        />

        <div className="flex justify-between text-sm text-gray-700 py-5 px-5">
          <div className='w-1/3'>
            <span className="font-semibold">DATA:</span>{' '}
            {new Date(analysis.created_at).toLocaleDateString()}
          </div>
          <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex items-center gap-1 w-1/3 justify-center">
            <FaThermometerHalf size={20} />
            <span>{hive.temperature} °C</span>
          </div>
          <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex items-center gap-1 w-1/3 justify-center">
            <MdOutlineWaterDrop size={20} />
            <span>{hive.humidity}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
