import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisAndHive = async () => {
      if (!hiveAnalysisId) {
        setError('ID da análise não encontrado.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        setError('Sessão inválida. Faça login novamente.');
        setLoading(false);
        return;
      }

      let account;
      try {
        const userObj = JSON.parse(userString);
        account = userObj?.account || localStorage.getItem('account');
      } catch (e) {
        console.error('Erro ao parsear user:', e);
        setError('Erro ao ler sessão.');
        setLoading(false);
        return;
      }

      if (!account) {
        setError('Account não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        
        const analysisResponse = await axios.get(`${base}/hive_analyses/${hiveAnalysisId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const analysisData = analysisResponse.data;
        setAnalysis(analysisData);

        const hiveResponse = await axios.get(`${base}/${account}/hives/${analysisData.hive_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHive(hiveResponse.data);
      } catch (error) {
        console.error('Erro ao buscar análise ou colmeia:', error);
        if (error.response?.status === 404) {
          setError('Análise ou colmeia não encontrada.');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Sessão expirada. Faça login novamente.');
        } else {
          setError('Erro ao carregar dados da análise.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisAndHive();
  }, [hiveAnalysisId]);

  if (loading) {
    return <p className="text-center font-semibold">Carregando análise...</p>;
  }

  if (error) {
    return <p className="text-center font-semibold text-red-600">{error}</p>;
  }

  if (!analysis || !hive) {
    return <p className="text-center font-semibold">Dados não encontrados.</p>;
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
      <div className={`flex flex-col sm:flex-row items-center sm:items-start font-semibold text-xs sm:text-sm mb-2 gap-2 ${color}`}>
        {icon}
        <span className="text-center sm:text-left">{message}</span>
      </div>

      <div className="bg-gray-100 rounded-xl shadow-lg w-full mx-auto">
        <img
          src={resultImage}
          alt="Resultado da análise"
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-md"
        />

        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-700 py-4 sm:py-5 px-3 sm:px-5 gap-3 sm:gap-0">
          <div className='w-full sm:w-1/3 text-center sm:text-left'>
            <span className="font-semibold">DATA:</span>{' '}
            {new Date(analysis.created_at).toLocaleDateString()}
          </div>
          <div className='hidden sm:block bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex flex-col items-center gap-1 w-full sm:w-1/3 justify-center">
            <div className="flex items-center gap-1">
              <FaThermometerHalf size={16} className="sm:w-5" />
              <span>{hive.temperature ?? '--'} °C</span>
            </div>
            <div className="text-xs text-gray-500 sm:hidden">
              <span>Tamanho: {hive.size ?? '--'} cm</span>
            </div>
          </div>
          <div className='hidden sm:block bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex flex-col items-center gap-1 w-full sm:w-1/3 justify-center">
            <div className="flex items-center gap-1">
              <MdOutlineWaterDrop size={16} className="sm:w-5" />
              <span>{hive.humidity ?? '--'}%</span>
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              <span>Tamanho: {hive.size ?? '--'} cm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
