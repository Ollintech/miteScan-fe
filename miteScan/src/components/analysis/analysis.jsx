import { useEffect, useState } from 'react';
import axios from 'axios';
import colmeia1 from '../../assets/images/colmeia1.png';
import colmeia2 from '../../assets/images/colmeia2.jpg';
import { useNavigate } from 'react-router-dom';

export default function AnalysisCard() {
  const [hives, setHives] = useState([]);
  const [selectedHiveId, setSelectedHiveId] = useState('');
  const navigate = useNavigate();

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const hiveImages = {
    1: colmeia1,
    2: colmeia2
  };

  let user = null;
  try {
    const s = localStorage.getItem('user');
    user = s ? JSON.parse(s) : null;
  } catch (e) {
    console.error('Erro ao parsear user do localStorage em AnalysisCard:', e);
    localStorage.removeItem('user');
    user = null;
  }
  // user_id não é mais usado no payload, mas pode ser útil para outra lógica futura.
  // const userId = user?.id; 
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHives = async () => {
      try {
        const userString = localStorage.getItem('user');
        let idParaRota;
        try {
          const u = userString ? JSON.parse(userString) : null;
          const accessId = Number(u?.access_id);
          idParaRota = accessId === 1 ? u?.id : u?.user_root_id;
        } catch (e) {
          console.error('Erro ao parsear user em AnalysisCard:', e);
        }

        if (!idParaRota) throw new Error('ID para rota não encontrado');

        const response = await axios.get(`${base}/${idParaRota}/hives/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHives(response.data);
        setSelectedHiveId(response.data[0]?.id || '');
      } catch (error) {
        console.error('Erro ao buscar colmeias:', error.response?.data || error.message);
        setHives([]);
        setSelectedHiveId('');
      }
    };

    fetchHives();
  }, [token]); // Removido 'base' da dependência, pois é definido fora do efeito

  const handleAnalysis = async () => {
    // REMOVIDO: Geração de temperature e humidity
    // const temperature = Math.floor(Math.random() * (38 - 30 + 1)) + 30;
    // const humidity = Math.floor(Math.random() * (50 - 30 + 1)) + 30;

    const selectedHive = hives.find(h => h.id === selectedHiveId);

    if (!selectedHive) return;

    // REMOVIDO: hiveUpdatePayload
    /*
     const hiveUpdatePayload = {
      user_id: userId,
      bee_type_id: selectedHive.bee_type_id,
      location_lat: selectedHive.location_lat,
      location_lng: selectedHive.location_lng,
      size: selectedHive.size,
      temperature,
      humidity
    };
    */

    try {
      // A lógica para 'idParaRota' é necessária para o payload da análise (user_root_id)
      const userString = localStorage.getItem('user');
      let idParaRota;
      try {
        const u = userString ? JSON.parse(userString) : null;
        const accessId = Number(u?.access_id);
        idParaRota = accessId === 1 ? u?.id : u?.user_root_id;
      } catch (e) {
        console.error('Erro ao parsear user para criar análise em AnalysisCard:', e);
      }
      
      // REMOVIDO: Bloco da requisição PUT
      /*
       console.debug('AnalysisCard PUT hive - idParaRota:', idParaRota, 'selectedHiveId:', selectedHiveId);
       await axios.put(`${base}/${idParaRota}/hives/${selectedHiveId}`, hiveUpdatePayload, {
           headers: { Authorization: `Bearer ${token}` },
       });
      */


      // 2. Cria nova análise
      let userRootIdNumber = Number(idParaRota);
      if (!Number.isFinite(userRootIdNumber) || userRootIdNumber <= 0) {
        const accessId = Number(user?.access_id);
        userRootIdNumber = accessId === 1 ? Number(user?.id) : Number(user?.user_root_id);
      }
      if (!Number.isFinite(userRootIdNumber) || userRootIdNumber <= 0) {
        console.error('user_root_id inválido ao criar análise. user:', user);
        throw new Error('user_root_id inválido');
      }
      const analysisPayload = {
        hive_id: selectedHiveId,
        user_root_id: userRootIdNumber,
        image_path: "string", // Você pode querer atualizar isso
        varroa_detected: Math.random() < 0.5,
        detection_confidence: Math.round(Math.random() * 100) / 100
      };

      console.debug('AnalysisCard POST payload:', analysisPayload);

      const analysisResponse = await axios.post(
        `${base}/hive_analyses/create`,
        analysisPayload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      const hiveAnalysisId = analysisResponse.data.id;

      // Redireciona para a tela de resultado, passando o ID da análise
      navigate('/loading-analysis', {
        state: { hiveAnalysisId }
      });

    } catch (error) {
      console.error('Erro ao criar análise:', error.response?.data || error.message, 'status:', error.response?.status);
      if (error.response?.data) {
        console.error('Detalhes do erro ao criar análise:', JSON.stringify(error.response.data));
      }
      alert('Erro ao criar análise. Tente novamente.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3 mx-auto w-full">
        <label className="font-bold" htmlFor="hive-select">SELECIONE A COLMEIA:</label>
        <select
          id="hive-select"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(Number(e.target.value))}
          className='bg-gray-200 py-1 px-6 rounded-lg'
        >
          {hives.map(hive => (
            <option key={hive.id} value={hive.id}>
              COLMEIA {hive.id}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 rounded-2xl shadow-2xl">
        <img
          src={hiveImages[selectedHiveId] || colmeia1}
          alt={`Colmeia ${selectedHiveId}`}
          className="w-full h-75 object-cover rounded-xl"
        />
        <button
          className="rounded-xl shadow-lg bg-yellow-400 hover:bg-yellow-300 font-bold my-4 w-1/3 p-2"
          onClick={handleAnalysis}
        >
          🔍 Analisar
        </button>
      </div>
    </>
  );
}