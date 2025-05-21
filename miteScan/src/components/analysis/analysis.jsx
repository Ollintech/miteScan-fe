import { useEffect, useState } from 'react';
import axios from 'axios';
import colmeia1 from '../../assets/images/colmeia1.png';
import colmeia2 from '../../assets/images/colmeia2.jpg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AnalysisCard() {
  const [hives, setHives] = useState([]);
  const [selectedHiveId, setSelectedHiveId] = useState(null); // Inicializa como null
  const navigate = useNavigate();
  const location = useLocation();

  const hiveImages = {
    1: colmeia1,
    2: colmeia2
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const token = localStorage.getItem("token");

  // Fazendo o fetch das colmeias
  useEffect(() => {
    const fetchHives = async () => {
      try {
        const response = await axios.get('http://localhost:8000/hives/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Pega o ID da colmeia a partir do estado de navegação, se existir
        const initialHiveId = location.state?.selectedHiveId || response.data[0]?.id;

        setHives(response.data);
        setSelectedHiveId(initialHiveId);  // Atualiza o ID da colmeia selecionada
      } catch (error) {
        console.error('Erro ao buscar colmeias:', error.response?.data || error.message);
      }
    };

    fetchHives();
  }, [token, location.state]);

  // Função para criar a análise da colmeia
  const handleAnalysis = async () => {
    const selectedHive = hives.find(hive => hive.id === selectedHiveId);

    if (!selectedHive) return;

    const analysisPayload = {
      hive_id: selectedHiveId,
      user_id: userId,
      image_path: "string", 
      varroa_detected: Math.random() < 0.5, 
      detection_confidence: (Math.random()).toFixed(2), 
      temperature: selectedHive.temperature,
      humidity: selectedHive.humidity
    };

    try {
      const analysisResponse = await axios.post(
        'http://localhost:8000/hive_analyses/create',
        analysisPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const hiveAnalysisId = analysisResponse.data.id;

      // Navega para a página de loading da análise
      navigate('/loading-analysis', {
        state: { hiveAnalysisId }
      });
    } catch (error) {
      console.error('Erro ao criar análise:', error.response?.data || error.message);
      alert('Erro ao criar análise. Tente novamente.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-3 mx-auto w-full">
        <label className="font-bold" htmlFor="hive-select">SELECIONE A COLMEIA:</label>
        <select
          id="hive-select"
          value={selectedHiveId || ''}
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
