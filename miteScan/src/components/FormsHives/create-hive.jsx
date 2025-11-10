import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([]);
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
    // Esta função agora lida com o redirecionamento
    // apenas se modalInfo.onClose estiver definido (o que só acontece no sucesso)
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: "", message: "", type: "error", onClose: null });
  };

  const handleCreate = async (dados) => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
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
      setModalInfo({
        isOpen: true,
        title: "Erro de Sessão",
        message: "Erro ao ler sessão. Faça login novamente.",
        type: "error",
        onClose: () => navigate('/login')
      });
      return;
    }

    if (!account) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Sessão",
        message: "Account não encontrado. Faça login novamente.",
        type: "error",
        onClose: () => navigate('/login') // Corrigido: redireciona para login
      });
      return;
    }

    if (!dados.name) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, insira um nome para a colmeia.",
        type: "error",
        onClose: null // Fica na página
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
        onClose: null // Fica na página
      });
      return;
    }
    if (isNaN(bee_type_id)) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, selecione um tipo de abelha.",
        type: "error",
        onClose: null // Fica na página
      });
      return;
    }
    if (!dados.location?.lat || !dados.location?.lng) {
      setModalInfo({
        isOpen: true,
        title: "Erro de Validação",
        message: "Por favor, defina uma localização.",
        type: "error",
        onClose: null // Fica na página
      });
      return;
    }

    const payload = {
      account: account,
      name: dados.name,
      bee_type_id: bee_type_id,
      location_lat: parseFloat(dados.location.lat),
      location_lng: parseFloat(dados.location.lng),
      size: size,
      humidity: null,
      temperature: null
    }

    const url = `${base}/${account}/hives/create`;

    try {
      const response = await axios.post(
        url,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      localStorage.removeItem('draftHiveForm');
      
      // **SUCESSO: Exibe o modal e define o onClose para redirecionar**
      setModalInfo({
        isOpen: true,
        title: "Sucesso",
        message: "Colmeia cadastrada com sucesso!", // Mensagem de sucesso
        type: "success",
        onClose: () => navigate('/hives') // Redireciona ao fechar
      });

    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message)
      
      // **ERRO: Exibe o modal e define onClose como null para ficar na página**
      setModalInfo({
        isOpen: true,
        title: "Erro ao Cadastrar",
        message: "Erro ao cadastrar colmeia.", // Mensagem de erro exata
        type: "error",
        onClose: null // Não faz nada ao fechar, fica na página
      });
    }
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
      <FormHive
        modo="criar"
        onConfirmar={handleCreate}
        beeTypes={beeTypes}
      />
    </>
  )
}