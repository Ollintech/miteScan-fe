import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'
import Modal from '../common/Modal'

export default function DeleteHiveCard() {
  const { id: hiveId } = useParams()
  const navigate = useNavigate()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", message: "", type: "error", onClose: null });

  const token = localStorage.getItem("token")
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Função para buscar dados da colmeia a ser excluída
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
          cameraConnected: true
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

  // Função para fechar modal
  const closeModal = () => {
    if (modalInfo.onClose) {
      modalInfo.onClose();
    }
    setModalInfo({ isOpen: false, title: "", message: "", type: "error", onClose: null });
  };

  // Função para excluir colmeia
  const handleDelete = async () => {
    const userString = localStorage.getItem('user');
    let account = null;
    try {
      const u = userString ? JSON.parse(userString) : null;
      account = u?.account || localStorage.getItem('account');
    } catch {}
    
    if (!token || !account) {
        setModalInfo({ 
          isOpen: true, 
          title: "Erro de Sessão", 
          message: "Sessão inválida. Faça login novamente.", 
          type: "error", 
          onClose: () => navigate('/login') 
        });
        return;
    }

    try {
      const url = `${base}/${account}/hives/${hiveId}?confirm=true`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setModalInfo({
        isOpen: true,
        title: "Sucesso",
        message: "Colmeia excluída com sucesso.",
        type: "success",
        onClose: () => navigate('/hives')
      });
    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message)
      setModalInfo({
        isOpen: true,
        title: "Erro",
        message: "Erro ao excluir colmeia.",
        type: "error"
      });
    }
  }

  if (loading) return <p className="text-center p-10">Carregando...</p>
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>
  if (!hive) return <p className="text-center p-10 text-red-500">Colmeia não encontrada.</p>

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
        key={hive.id}
        modo="excluir"
        colmeia={hive}
        onExcluir={handleDelete}
        beeTypes={beeTypes}
      />
    </>
  )
}