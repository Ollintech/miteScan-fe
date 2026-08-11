import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'
import { MdOutlineHelpOutline, MdCheckCircle } from 'react-icons/md'

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([]);
  const [pendingData, setPendingData] = useState(null); // Guarda os dados enquanto aguarda confirmação
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Controla o popup de confirmação
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "error",
    onClose: null
  });

  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchBeeTypes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('Sem token, redirecionando para login');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${base}/bee_types/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBeeTypes(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de abelha:', error.response?.data || error.message);
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

  // Etapa 1: Valida os dados do formulário e abre o Pop-up de Confirmação
  const handlePreCreate = (dados) => {
    if (!dados.name) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, insira um nome para a colmeia.",
        type: "error",
        onClose: null
      });
      return;
    }

    const size = parseInt(dados.size);
    const bee_type_id = parseInt(dados.bee_type_id);

    if (isNaN(size) || size <= 0) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, insira um tamanho válido.",
        type: "error",
        onClose: null
      });
      return;
    }

    if (isNaN(bee_type_id)) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, selecione um tipo de abelha.",
        type: "error",
        onClose: null
      });
      return;
    }

    if (!dados.location?.lat || !dados.location?.lng) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, defina uma localização.",
        type: "error",
        onClose: null
      });
      return;
    }

    // Se estiver tudo correto, salva os dados temporariamente e abre o Popup
    setPendingData(dados);
    setShowConfirmPopup(true);
  };

  // Etapa 2: Executada apenas quando o usuário clica em "Confirmar" no Pop-up
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
    formData.append('bee_type_id', parseInt(pendingData.bee_type_id));
    formData.append('location_lat', parseFloat(pendingData.location.lat));
    formData.append('location_lng', parseFloat(pendingData.location.lng));
    formData.append('size', parseInt(pendingData.size));
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

      // Redireciona para /hives enviando a mensagem de sucesso
      navigate('/hives', {
        state: { successMessage: "Colmeia cadastrada com sucesso!" }
      });

    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message);
      setIsSubmitting(false);
      setShowConfirmPopup(false);

      setModalInfo({
        isOpen: true,
        title: "Erro ao Cadastrar",
        message: "Erro ao cadastrar colmeia.",
        type: "error",
        onClose: null
      });
    }
  };

  return (
    <div className="relative">
      {/* POP-UP DE CONFIRMAÇÃO FLUTUANTE */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border border-gray-100 transform transition-all scale-100">
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

      {/* MODAL PADRÃO APENAS PARA ERROS */}
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