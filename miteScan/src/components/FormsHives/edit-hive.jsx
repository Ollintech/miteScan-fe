import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'
import Modal from '../common/Modal'

export default function EditHiveCard() {
  const { id: hiveId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "", message: "", type: "error", onClose: null });

  const token = localStorage.getItem("token")
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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

  const handleEdit = async (dadosAtualizados) => {
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

    if (!dadosAtualizados.name) {
      setModalInfo({ 
        isOpen: true, 
        title: "Erro de Validação", 
        message: "Por favor, insira um nome para a colmeia.", 
        type: "error" 
      });
      return;
    }

    const size = parseInt(dadosAtualizados.size);
    if (isNaN(size) || size <= 0) {
      setModalInfo({ 
        isOpen: true, 
        title: "Erro de Validação", 
        message: "Por favor, insira um tamanho válido.", 
        type: "error" 
      });
      return;
    }

    const bee_type_id = parseInt(dadosAtualizados.bee_type_id);
    if (isNaN(bee_type_id)) {
      setModalInfo({ 
        isOpen: true, 
        title: "Erro de Validação", 
        message: "Por favor, selecione um tipo de abelha.", 
        type: "error" 
      });
      return;
    }

    const payload = {
      name: dadosAtualizados.name,
      bee_type_id: bee_type_id,
      location_lat: parseFloat(dadosAtualizados.location?.lat) || 0,
      location_lng: parseFloat(dadosAtualizados.location?.lng) || 0,
      size: size,
    }

    try {
      const url = `${base}/${account}/hives/${hiveId}`;
      
      const response = await axios.put(
        url,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )

      setModalInfo({
        isOpen: true,
        title: "Sucesso",
        message: "Colmeia atualizada com sucesso!",
        type: "success",
        onClose: () => navigate('/hives')
      });
    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error.response?.data || error.message)
      setModalInfo({
        isOpen: true,
        title: "Erro",
        message: "Erro ao atualizar colmeia.",
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
        key={hive.id + '-' + hive.location?.lat + '-' + hive.location?.lng + '-' + hive.cameraConnected}
        modo="editar"
        colmeia={hive}
        onConfirmar={handleEdit}
        beeTypes={beeTypes}
      />
    </>
  )
}