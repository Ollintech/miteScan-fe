import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'
import { MdOutlineHelpOutline, MdErrorOutline } from 'react-icons/md'

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([]);
  const [pendingData, setPendingData] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do Toast Flutuante
  const [toastError, setToastError] = useState({ show: false, message: '' });

  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "error",
    onClose: null
  });

  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const triggerErrorToast = (msg) => {
    console.warn("Disparando aviso:", msg); // Para conferir no Console (F12)
    setToastError({ show: true, message: msg });
    setTimeout(() => {
      setToastError({ show: false, message: '' });
    }, 4000);
  };

  useEffect(() => {
    const fetchBeeTypes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${base}/bee_types/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBeeTypes(response.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      }
    };

    fetchBeeTypes();
  }, [base, navigate]);

  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: "", message: "", type: "error", onClose: null });
  };

  const handlePreCreate = (dados) => {
    try {
      const nameStr = String(dados?.name || '').trim();
      const sizeStr = String(dados?.size || '').trim();
      const beeTypeIdStr = String(dados?.bee_type_id || '').trim();

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
      if (!dados?.location?.lat || !dados?.location?.lng) {
        triggerErrorToast("Por favor, defina a localização no mapa.");
        return;
      }

      setPendingData(dados);
      setShowConfirmPopup(true);

    } catch (error) {
      console.error("Erro ao validar:", error);
      triggerErrorToast("Erro ao validar os dados do formulário.");
    }
  };

  const handleConfirmCreate = async () => {
    if (!pendingData) return;

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
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

    let account;
    try {
      const userObj = JSON.parse(userString);
      account = userObj?.account || localStorage.getItem('account');
    } catch (e) {
      setShowConfirmPopup(false);
      setModalInfo({
        isOpen: true,
        title: "Erro de Sessão",
        message: "Erro ao ler sessão. Faça login novamente.",
        type: "error",
        onClose: () => navigate('/login')
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', pendingData.name);
    formData.append('bee_type_id', parseInt(pendingData.bee_type_id, 10));
    formData.append('location_lat', parseFloat(pendingData.location.lat));
    formData.append('location_lng', parseFloat(pendingData.location.lng));
    formData.append('size', parseInt(pendingData.size, 10));
    if (pendingData.image) {
      formData.append('image', pendingData.image);
    }

    const url = `${base}/${account}/hives/create`;

    try {
      await axios.post(url, formData, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      localStorage.removeItem('draftHiveForm');
      setShowConfirmPopup(false);

      navigate('/hives', {
        state: { successMessage: "Colmeia cadastrada com sucesso!" }
      });

    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message);
      setIsSubmitting(false);
      setShowConfirmPopup(false);

      triggerErrorToast("Erro ao cadastrar colmeia no servidor.");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* TOAST FLUTUANTE VISÍVEL COM Z-INDEX MÁXIMO E ESTILO GARANTIDO */}
      {toastError.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-2xl border border-red-500 font-semibold text-sm">
          <MdErrorOutline size={24} />
          <span>{toastError.message}</span>
        </div>
      )}

      {/* POP-UP DE CONFIRMAÇÃO */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineHelpOutline size={28} />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Confirmar Cadastro?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Deseja realmente cadastrar a colmeia <strong>"{pendingData?.name}"</strong>?
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
                onClick={handleConfirmCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors w-1/2 flex items-center justify-center gap-1 shadow-md shadow-amber-200"
              >
                {isSubmitting ? "Cadastrando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SESSÃO */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={closeModal}
        title={modalInfo.title}
        type={modalInfo.type}
      >
        <p className="text-gray-700">{modalInfo.message}</p>
      </Modal>

      <FormHive
        modo="criar"
        onConfirmar={handlePreCreate}
        beeTypes={beeTypes}
      />
    </div>
  );
}