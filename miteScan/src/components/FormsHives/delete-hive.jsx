import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'
import Modal from '../common/Modal'
import { MdOutlineWarning } from 'react-icons/md'

export default function DeleteHiveCard() {
  const { id: hiveId } = useParams()
  const navigate = useNavigate()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Estados para o novo Pop-up de Confirmação e submissão
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", message: "", type: "error", onClose: null });

  const token = localStorage.getItem("token")
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Busca dados da colmeia
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true)
      setError("")

      const userString = localStorage.getItem('user');
      if (!token || !userString) {
        setError('Sessão inválida. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }
      
      let account;
      try {
        const u = JSON.parse(userString);
        account = u?.account || localStorage.getItem('account');
      } catch (e) {
        setError('Erro ao ler sessão. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }

      if (!account) {
        setError('Account não encontrado. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const hiveUrl = `${base}/${account}/hives/${hiveId}`;
        const beeTypesUrl = `${base}/bee_types/all`;

        const [hiveRes, beeTypesRes] = await Promise.all([
          axios.get(hiveUrl, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(beeTypesUrl, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const hiveData = hiveRes.data
        
        setBeeTypes(beeTypesRes.data || []);
        setHive({
          id: hiveData.id,
          name: hiveData.name || `COLMEIA ${hiveData.id}`,
          size: hiveData.size || '',
          bee_type_id: hiveData.bee_type_id || '',
          location: {
            lat: hiveData.location_lat,
            lng: hiveData.location_lng
          },
          image_path: hiveData.image_path
        })
        
      } catch (err) {
        console.error('Erro ao buscar colmeia:', err)
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setError('Sessão expirada. Faça login novamente.');
            navigate('/login');
        } else if (err.response && err.response.status === 404) {
            setError('Colmeia não encontrada.');
        } else {
            setError('Erro ao carregar dados da colmeia.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [hiveId, token, base, navigate])

  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: "", message: "", type: "error", onClose: null });
  };

  // Etapa 1: Quando o usuário clica no botão "Excluir" do formulário, abre o pop-up
  const handlePreDelete = () => {
    setShowConfirmPopup(true);
  };

  // Etapa 2: Executada ao clicar em "Excluir" dentro do pop-up
  const handleConfirmDelete = async () => {
    const userString = localStorage.getItem('user');
    let account = null;
    try {
      const u = userString ? JSON.parse(userString) : null;
      account = u?.account || localStorage.getItem('account');
    } catch {}
    
    if (!token || !account) {
        setShowConfirmPopup(false);
        setModalInfo({ 
          isOpen: true, 
          title: "Erro de Sessão", 
          message: "Sessão inválida. Faça login novamente.", 
          type: "error", 
          onClose: () => navigate('/login') 
        });
        return;
    }

    setIsDeleting(true);

    try {
      const url = `${base}/${account}/hives/${hiveId}?confirm=true`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowConfirmPopup(false);

      // Redireciona para /hives enviando mensagem de sucesso no estado
      navigate('/hives', {
        state: { successMessage: "Colmeia excluída com sucesso!" }
      });

    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message);
      setIsDeleting(false);
      setShowConfirmPopup(false);

      setModalInfo({
        isOpen: true,
        title: "Erro ao Excluir",
        message: "Não foi possível excluir a colmeia.",
        type: "error",
        onClose: null
      });
    }
  };

  if (loading) return <p className="text-center p-10">Carregando...</p>
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>
  if (!hive) return <p className="text-center p-10 text-red-500">Colmeia não encontrada.</p>

  return (
    <div className="relative">
      {/* POP-UP DE CONFIRMAÇÃO FLUTUANTE DE DELEÇÃO */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border border-gray-100 transform transition-all scale-100">
            
            {/* Ícone de aviso em vermelho */}
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineWarning size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Excluir Colmeia?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir a colmeia <strong>"{hive?.name}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-1/2"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-1/2 flex items-center justify-center gap-1 shadow-md shadow-red-200"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PADRÃO DE ERROS */}
      <Modal 
        isOpen={modalInfo.isOpen} 
        onClose={closeModal} 
        title={modalInfo.title} 
        type={modalInfo.type}
      >
        <p className="text-gray-700">{modalInfo.message}</p>
      </Modal>

      <FormHive
        key={hive.id}
        modo="excluir"
        colmeia={hive}
        onExcluir={handlePreDelete}
        beeTypes={beeTypes}
      />
    </div>
  )
}