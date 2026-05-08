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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onClose: null
  });

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: '', message: '', type: 'info', onClose: null });
  };

  const handleAnalysis = async () => {
    const selectedHive = hives.find(h => h.id === selectedHiveId);

    if (!selectedHive || !selectedFile) {
      setModalInfo({
        isOpen: true,
        title: 'Aviso',
        message: 'Selecione uma colmeia e anexe uma imagem para analisar.',
        type: 'info',
        onClose: null
      });
      return;
    }

    setIsAnalyzing(true);
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

      // Chamada SEGURA para o novo endpoint protegido
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('hive_id', selectedHiveId);

      const response = await axios.post(
        `${base}/hive_analyses/create-protected`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hiveAnalysisId = response.data.id;

      navigate('/loading-analysis', {
        state: { hiveAnalysisId }
      });

    } catch (error) {
      console.error('Erro ao criar análise:', error.response?.data || error.message);
      setModalInfo({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao processar análise. Verifique sua conexão e tente novamente.',
        type: 'error',
        onClose: null
      });
    } finally {
      setIsAnalyzing(false);
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
              Colmeia {hive.id}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 rounded-2xl shadow-2xl p-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 mb-4 cursor-pointer hover:bg-gray-200 transition-colors relative"
             onClick={() => document.getElementById('file-upload').click()}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-80 object-contain rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <MdAdd size={48} />
              <p className="font-bold">ANEXE UMA FOTO PARA ANALISAR</p>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex justify-center">
          <button
            className={`rounded-xl shadow-lg font-bold my-2 w-full sm:w-1/3 p-3 text-sm sm:text-base transition-all ${
              isAnalyzing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-yellow-400 hover:bg-yellow-300'
            }`}
            onClick={handleAnalysis}
            disabled={!selectedHiveId || !selectedFile || isAnalyzing} 
          >
            {isAnalyzing ? '⌛ Analisando...' : '🔍 Analisar'}
          </button>
        </div>
      </div>
    </>
  );
}