import { useEffect, useState } from 'react';
import axios from 'axios';
import colmeia1 from '../../assets/images/colmeia1.png';
import colmeia2 from '../../assets/images/colmeia2.jpg';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { MdAdd } from 'react-icons/md';

export default function AnalysisCard() {
  const [hives, setHives] = useState([]);
  const [selectedHiveId, setSelectedHiveId] = useState('');
  const [loadingHives, setLoadingHives] = useState(true);
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onClose: null
  });

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHives = async () => {
      setLoadingHives(true);
      try {
        const userString = localStorage.getItem('user');
        let account;
        try {
          const u = userString ? JSON.parse(userString) : null;
          account = u?.account || localStorage.getItem('account');
        } catch (e) {
          console.error('Erro ao parsear user em AnalysisCard:', e);
        }

        if (!account) throw new Error('Account não encontrado');

        const response = await axios.get(`${base}/${account}/hives/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHives(response.data);
        setSelectedHiveId(response.data[0]?.id || '');
      } catch (error) {
        console.error('Erro ao buscar colmeias:', error.response?.data || error.message);
        setHives([]);
        setSelectedHiveId('');
      } finally {
        setLoadingHives(false);
      }
    };

    fetchHives();
  }, [token, base]);

  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: '', message: '', type: 'info', onClose: null });
  };

  const handleAnalysis = async () => {
    const selectedHive = hives.find(h => h.id === selectedHiveId);

    if (!selectedHive) return;

    try {
      const userString = localStorage.getItem('user');
      let account;
      try {
        const u = userString ? JSON.parse(userString) : null;
        account = u?.account || localStorage.getItem('account');
      } catch (e) {
        console.error('Erro ao parsear user para criar análise:', e);
      }
      
      if (!account) {
        console.error('Account não encontrado ao criar análise.');
        throw new Error('Account não encontrado');
      }

      // Simulação de dados para a análise (mantido do original)
      const analysisPayload = {
        hive_id: selectedHiveId,
        account: account,
        image_path: "string",
        varroa_detected: Math.random() < 0.5,
        detection_confidence: Math.round(Math.random() * 100) / 100
      };

      const analysisResponse = await axios.post(
        `${base}/hive_analyses/create`,
        analysisPayload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      const hiveAnalysisId = analysisResponse.data.id;

      navigate('/loading-analysis', {
        state: { hiveAnalysisId }
      });

    } catch (error) {
      console.error('Erro ao criar análise:', error.response?.data || error.message, 'status:', error.response?.status);
      if (error.response?.data) {
        console.error('Detalhes do erro ao criar análise:', JSON.stringify(error.response.data));
      }
      setModalInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao criar análise. Tente novamente.',
        type: 'error',
        onClose: null
      });
    }
  };

  if (loadingHives) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 font-semibold">Carregando colmeias...</p>
      </div>
    );
  }

  if (hives.length === 0) {
    return (
      <>
        <Modal
          isOpen={modalInfo.isOpen}
          onClose={closeModal}
          title={modalInfo.title}
          type={modalInfo.type}
        >
          <p className="text-gray-700">{modalInfo.message}</p>
        </Modal>
        <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">
              Você ainda não possui colmeias.
            </p>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-xl flex items-center gap-2"
              onClick={() => navigate("/create-hive")}
            >
              <MdAdd size={20} />
              Comece aqui!
            </button>
          </div>
      </>
    );
  }

  // Renderização normal se houver colmeias
  return (
    <>
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={closeModal}
        title={modalInfo.title}
        type={modalInfo.type}
      >
        <p className="text-gray-700">{modalInfo.message}</p>
      </Modal>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-3 mx-auto w-full">
        <label className="font-bold text-sm sm:text-base" htmlFor="hive-select">SELECIONE A COLMEIA:</label>
        <select
          id="hive-select"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(Number(e.target.value))}
          className='bg-gray-200 py-1 px-4 sm:px-6 rounded-lg text-sm sm:text-base w-full sm:w-auto'
        >
          {hives.map(hive => (
            <option key={hive.id} value={hive.id}>
              {hive.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 rounded-2xl shadow-2xl">
        <img
          src={hiveImages[selectedHiveId] || colmeia1}
          alt={`Colmeia ${selectedHiveId}`}
          className="w-full h-auto sm:h-75 object-cover rounded-xl"
        />
        <div className="flex justify-center">
          <button
            className="rounded-xl shadow-lg bg-yellow-400 hover:bg-yellow-300 font-bold my-4 w-full sm:w-1/3 p-2 text-sm sm:text-base"
            onClick={handleAnalysis}
            disabled={!selectedHiveId} 
          >
            🔍 Analisar
          </button>
        </div>
      </div>
    </>
  );
}