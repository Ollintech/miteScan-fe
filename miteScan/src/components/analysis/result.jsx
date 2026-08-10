import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import resultImage from '../../assets/images/colmeia1.png';
import { FaThermometerHalf, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { MdOutlineWaterDrop, MdVerifiedUser, MdHexagon } from "react-icons/md";
import { TbAlertTriangleFilled, TbAlertOctagonFilled, TbBug } from "react-icons/tb";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hiveAnalysisId } = location.state || {};
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
  }, [hiveAnalysisId, base]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-md border border-gray-100 my-6">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-200 border-t-yellow-500 mb-3"></div>
        <p className="text-gray-600 font-medium">Carregando resultado da análise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center my-6 shadow-sm">
        <TbAlertOctagonFilled className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-red-900 mb-1">Não foi possível carregar a análise</h3>
        <p className="text-sm text-red-700 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/analysis')}
          className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl text-sm transition-colors"
        >
          Voltar para Análise
        </button>
      </div>
    );
  }

  if (!analysis || !hive) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-2xl text-center my-6">
        <p className="text-gray-800 font-medium">Dados da análise não encontrados.</p>
      </div>
    );
  }

  const tempVal = hive.temperature ?? null;
  const humVal = hive.humidity ?? null;

  const isTempOk = tempVal !== null && tempVal >= 34 && tempVal <= 36;
  const isHumidityOk = humVal !== null && humVal >= 33 && humVal <= 47;

  let statusKey = 'segura';
  if (analysis.varroa_detected || analysis.bee_status === 'varroa') {
    statusKey = 'perigo';
  } else if (analysis.bee_status === 'deformada') {
    statusKey = 'deformada';
  } else if (!isTempOk || !isHumidityOk) {
    statusKey = 'alerta';
  }

  const statusConfig = {
    segura: {
      cardBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <MdVerifiedUser className="w-7 h-7 text-emerald-600 shrink-0" />,
      title: 'Colmeia Segura & Saudável',
      subtitle: 'Nenhuma infestação por Varroa ou anomalia foi identificada nesta análise.'
    },
    alerta: {
      cardBg: 'bg-amber-50/80 border-amber-200 text-amber-950',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <TbAlertTriangleFilled className="w-7 h-7 text-amber-600 shrink-0" />,
      title: 'Colmeia em Alerta Ambiental',
      subtitle: 'Nenhum parasita foi detectado, mas a temperatura/umidade precisa de atenção.'
    },
    perigo: {
      cardBg: 'bg-red-50/80 border-red-200 text-red-950',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      icon: <TbAlertOctagonFilled className="w-7 h-7 text-red-600 shrink-0" />,
      title: 'Perigo: Ácaro Varroa Detectado!',
      subtitle: 'Foi identificada a presença do ácaro Varroa Destructor no favo.'
    },
    deformada: {
      cardBg: 'bg-orange-50/80 border-orange-200 text-orange-950',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <TbBug className="w-7 h-7 text-orange-600 shrink-0" />,
      title: 'Atenção: Asas Deformadas Detectadas',
      subtitle: 'Foram identificados sintomas de asas deformadas nas abelhas.'
    }
  };

  const currentStatus = statusConfig[statusKey];
  const imageUrl = analysis.image_path ? `${base}/${analysis.image_path.replace(/\\/g, '/')}` : resultImage;

  return (
    <div className="w-full space-y-5 my-2 text-left">
      
      {/* 1. Card de Status Principal */}
      <div className={`p-5 rounded-2xl border ${currentStatus.cardBg} shadow-md transition-all`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
              {currentStatus.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${currentStatus.badgeClass}`}>
                  Resultado da Análise
                </span>
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                  {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {currentStatus.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {currentStatus.subtitle}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700">
            <MdHexagon className="text-yellow-500" />
            <span>Colmeia #{analysis.hive_id}</span>
          </div>
        </div>
      </div>

      {/* 2. Grid de Conteúdo (Imagem + Métricas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Lado Esquerdo: Imagem da Colmeia */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3.5 shadow-md border border-gray-200/80 flex flex-col justify-between">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] flex items-center justify-center border border-gray-200">
            <img 
              src={imageUrl} 
              alt="Foto da Colmeia Analisada"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-2.5 px-1 flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Registro oficial da colmeia</span>
            <span className="font-mono text-gray-400">#Análise {analysis.id}</span>
          </div>
        </div>

        {/* Lado Direito: Métricas e Indicadores */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Card Resumo do Diagnóstico */}
          <div className="bg-white p-4.5 rounded-2xl shadow-md border border-gray-200/80">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Diagnóstico da Colmeia
            </h3>
            
            <div className="space-y-2.5">
              {/* Varroa */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${analysis.varroa_detected ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <TbBug className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Ácaro Varroa</p>
                    <p className="text-sm font-bold text-gray-800">
                      {analysis.varroa_detected ? 'Detectado' : 'Ausente (Não Detectado)'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  analysis.varroa_detected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {analysis.varroa_detected ? 'Atenção' : 'Normal'}
                </span>
              </div>

              {/* Condição das Abelhas */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <MdHexagon className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Condição das Abelhas</p>
                    <p className="text-sm font-bold text-gray-800 capitalize">
                      {analysis.bee_status || 'Saudável'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Telemetria (Temperatura e Umidade) */}
          <div className="bg-white p-4.5 rounded-2xl shadow-md border border-gray-200/80 flex-1 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Condições Ambientais
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-2">
              {/* Temperatura */}
              <div className={`p-3 rounded-xl border ${
                isTempOk ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="flex items-center gap-1.5 mb-1 text-gray-600">
                  <FaThermometerHalf className={`w-3.5 h-3.5 ${isTempOk ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span className="text-xs font-semibold">Temperatura</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-0.5">
                  {tempVal !== null ? `${tempVal} °C` : '--'}
                </div>
                <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                  <span>Ideal: 34-36°C</span>
                  <span className={isTempOk ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {isTempOk ? 'Ideal' : 'Ajustar'}
                  </span>
                </div>
              </div>

              {/* Umidade */}
              <div className={`p-3 rounded-xl border ${
                isHumidityOk ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <div className="flex items-center gap-1.5 mb-1 text-gray-600">
                  <MdOutlineWaterDrop className={`w-3.5 h-3.5 ${isHumidityOk ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span className="text-xs font-semibold">Umidade</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-0.5">
                  {humVal !== null ? `${humVal}%` : '--'}
                </div>
                <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                  <span>Ideal: 33-47%</span>
                  <span className={isHumidityOk ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {isHumidityOk ? 'Ideal' : 'Ajustar'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-1 text-[11px] text-gray-400 text-center font-medium">
              Sensores de monitoramento da colmeia
            </div>
          </div>

        </div>

      </div>

      {/* 3. Botões de Ação */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={() => navigate('/historical')}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <FaHistory className="w-4 h-4 text-gray-900" />
          Ver Histórico Completo
        </button>
      </div>

    </div>
  );
}



