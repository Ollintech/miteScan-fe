import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // 1. Importar useNavigate

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([]);
  const navigate = useNavigate(); // 2. Inicializar useNavigate
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchBeeTypes = async () => {
      // 3. Adicionar autenticação à busca de tipos de abelha
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('Sem token, redirecionando para login');
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(`${base}/bee_types/all`, {
           headers: { Authorization: `Bearer ${token}` } // <-- Header de auth adicionado
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
  }, [base, navigate]); // 4. Adicionar dependências

  const handleCreate = async (dados) => {
    console.log('Criar colmeia com dados:', dados)

    // --- 5. LÓGICA DE ID CORRETA ---
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      alert('Sessão inválida. Faça login novamente.');
      navigate('/login');
      return;
    }

    let idParaRota;
    try {
      const userObj = JSON.parse(userString);
      const accessId = Number(userObj?.access_id);
      idParaRota = accessId === 1 ? userObj?.id : userObj?.user_root_id;
    } catch (e) {
      alert('Erro ao ler sessão. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!idParaRota) {
      alert('ID do usuário raiz não encontrado. Faça login novamente.');
      return;
    }

    // --- 6. VALIDAÇÃO DOS DADOS DO FORMULÁRIO ---
    const size = parseInt(dados.size);
    const bee_type_id = parseInt(dados.bee_type_id);

    if (isNaN(size) || size <= 0) {
      alert('Erro: Por favor, insira um tamanho válido.');
      return;
    }
    if (isNaN(bee_type_id)) {
      alert('Erro: Por favor, selecione um tipo de abelha.');
      return;
    }
    if (!dados.location?.lat || !dados.location?.lng) {
        alert('Erro: Por favor, defina uma localização.');
        return;
    }

    // --- 7. PAYLOAD CORRIGIDO (COM user_root_id) ---
    const payload = {
      user_root_id: Number(idParaRota), // <-- ADICIONADO
      bee_type_id: bee_type_id,
      location_lat: parseFloat(dados.location.lat),
      location_lng: parseFloat(dados.location.lng),
      size: size,
      humidity: null,
      temperature: null
    }

    // --- 8. URL CORRIGIDA (COM idParaRota) ---
    const url = `${base}/${idParaRota}/hives/create`;

    try {
      const response = await axios.post(
        url, // <-- URL corrigida
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      localStorage.removeItem('draftHiveForm');
      console.log('Colmeia criada com sucesso:', response.data)
      alert('Colmeia cadastrada com sucesso!');
      navigate('/hives');

    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message)
      // Tenta extrair o erro de validação do FastAPI
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
         alert(`Erro: ${detail[0].msg}`);
      } else {
         alert('Erro ao cadastrar colmeia. Verifique os dados ou tente novamente.')
      }
    }
  }

  return (
    <FormHive
      modo="criar"
      onConfirmar={handleCreate}
      beeTypes={beeTypes} 
    />
  )
}