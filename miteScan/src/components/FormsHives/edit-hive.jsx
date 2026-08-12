import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'
import Modal from '../common/Modal'
import { MdOutlineHelpOutline, MdErrorOutline } from 'react-icons/md'

export default function EditHiveCard() {
  const { id: hiveId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Estados para o Pop-up de Confirmação, Toast de Erro e Submissão
  const [pendingData, setPendingData] = useState(null)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastError, setToastError] = useState({ show: false, message: '' })

  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", message: "", type: "error", onClose: null })

  const token = localStorage.getItem("token")
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Função para exibir mensagem de erro via Toast Flutuante
  const triggerErrorToast = (msg) => {
    setToastError({ show: true, message: msg })
    setTimeout(() => {
      setToastError({ show: false, message: '' })
    }, 4000)
  }

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
          axios.get(hiveUrl, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          axios.get(beeTypesUrl, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        setBeeTypes(beeTypesRes.data || []);

        setHive({
          id: hiveRes.data.id,
          name: hiveRes.data.name || `COLMEIA ${hiveRes.data.id}`,
          size: hiveRes.data.size || '',
          bee_type_id: hiveRes.data.bee_type_id || '',
          image_path: hiveRes.data.image_path || '',
          location: {
            lat: hiveRes.data.location_lat,
            lng: hiveRes.data.location_lng
          },
          cameraConnected: true
        })

      } catch (err) {
        console.error('Erro ao carregar dados:', err)
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
  }, [hiveId, base, token, navigate])

  useEffect(() => {
    if (location.state?.location || location.state?.cameraConnected) {
      setHive(prev => {
        if (!prev) return prev 
        return {
          ...prev,
          location: location.state.location || prev.location,
          cameraConnected: location.state.cameraConnected ?? prev.cameraConnected
        }
      })
    }
  }, [location.state])

  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: "", message: "", type: "error", onClose: null });
  };

  // Etapa 1: Validação equivalente à do cadastro
  const handlePreEdit = (dadosAtualizados) => {
    try {
      const nameStr = String(dadosAtualizados?.name || '').trim();
      const sizeStr = String(dadosAtualizados?.size || '').trim();
      const beeTypeIdStr = String(dadosAtualizados?.bee_type_id || '').trim();

      // 1. Valida Nome
      if (!nameStr) {
        triggerErrorToast("Por favor, insira um nome para a colmeia.");
        return;
      }

      // 2. Valida Tamanho
      if (!sizeStr) {
        triggerErrorToast("Por favor, insira o tamanho da colmeia.");
        return;
      }

      const size = parseInt(sizeStr, 10);
      if (isNaN(size) || size <= 0) {
        triggerErrorToast("Por favor, insira um tamanho válido maior que zero.");
        return;
      }

      // 3. Valida Tipo de Abelha
      if (!beeTypeIdStr) {
        triggerErrorToast("Por favor, selecione um tipo de abelha.");
        return;
      }

      const bee_type_id = parseInt(beeTypeIdStr, 10);
      if (isNaN(bee_type_id)) {
        triggerErrorToast("Selecione um tipo de abelha válido.");
        return;
      }

      // 4. Valida Localização
      if (!dadosAtualizados?.location?.lat || !dadosAtualizados?.location?.lng) {
        triggerErrorToast("Por favor, defina a localização no mapa.");
        return;
      }

      setPendingData(dadosAtualizados);
      setShowConfirmPopup(true);

    } catch (error) {
      console.error("Erro ao validar edição:", error);
      triggerErrorToast("Erro ao validar os dados do formulário.");
    }
  };

  // Etapa 2: Executa a requisição de edição após o clique no pop-up
  const handleConfirmEdit = async () => {
    if (!pendingData) return;

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

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', pendingData.name);
    formData.append('bee_type_id', parseInt(pendingData.bee_type_id, 10));
    formData.append('location_lat', parseFloat(pendingData.location?.lat) || 0);
    formData.append('location_lng', parseFloat(pendingData.location?.lng) || 0);
    formData.append('size', parseInt(pendingData.size, 10));
    if (pendingData.image) {
      formData.append('image', pendingData.image);
    }

    try {
      const url = `${base}/${account}/hives/${hiveId}`;
      
      await axios.put(
        url,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      setShowConfirmPopup(false);

      // Redireciona para /hives com mensagem de sucesso
      navigate('/hives', {
        state: { successMessage: "Colmeia atualizada com sucesso!" }
      });

    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error.response?.data || error.message);
      setIsSubmitting(false);
      setShowConfirmPopup(false);

      // Exibe erro no Toast flutuante
      triggerErrorToast("Erro ao atualizar colmeia no servidor.");
    }
  };

  if (loading) return <p className="text-center p-10">Carregando...</p>
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>
  if (!hive) return <p className="text-center p-10 text-red-500">Colmeia não encontrada.</p>

  return (
    <div className="w-full flex flex-col items-center pt-4 pb-10 px-4">
      {toastError.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-2xl border border-red-500 font-semibold text-sm">
          <MdErrorOutline size={24} />
          <span>{toastError.message}</span>
        </div>
      )}

      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineHelpOutline size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Salvar Alterações?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Deseja salvar as alterações da colmeia <strong>"{pendingData?.name}"</strong>?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-1/2"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors w-1/2 flex items-center justify-center gap-1 shadow-md shadow-amber-200"
              >
                {isSubmitting ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal 
        isOpen={modalInfo.isOpen} 
        onClose={closeModal} 
        title={modalInfo.title} 
        type={modalInfo.type}
      >
        <p className="text-gray-700">{modalInfo.message}</p>
      </Modal>

      <FormHive
        key={hive.id + '-' + hive.location?.lat + '-' + hive.location?.lng + '-' + hive.cameraConnected}
        modo="editar"
        colmeia={hive}
        onConfirmar={handlePreEdit}
        beeTypes={beeTypes}
      />
    </div>
  )
}