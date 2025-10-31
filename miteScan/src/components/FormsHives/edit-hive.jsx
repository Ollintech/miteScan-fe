import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function EditHiveCard() {
  const { id: hiveId } = useParams() // Renomeado para evitar conflito
  const navigate = useNavigate()
  const location = useLocation()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([]) // Estado para os tipos de abelha
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true)
      setError("")

      // 1. Validar sessão e pegar userRootId
      const userString = localStorage.getItem('user');
      if (!token || !userString) {
        setError('Sessão inválida. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }
      
      let userRootId;
      try {
        const u = JSON.parse(userString);
        const accessId = Number(u?.access_id);
        userRootId = accessId === 1 ? u?.id : u?.user_root_id;
      } catch (e) {
        setError('Erro ao ler sessão. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }

      if (!userRootId) {
        setError('ID do usuário inválido. Faça login novamente.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        // 2. Buscar dados da colmeia e tipos de abelha em paralelo
        const hiveUrl = `${base}/${userRootId}/hives/${hiveId}`;
        const beeTypesUrl = `${base}/bee_types/all`; // Assumindo que esta é a rota

        const [hiveRes, beeTypesRes] = await Promise.all([
          axios.get(hiveUrl, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          axios.get(beeTypesUrl, { // Tipos de abelha também precisam de auth
             headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        // 3. Salvar tipos de abelha
        setBeeTypes(beeTypesRes.data || []);

        // 4. Salvar dados da colmeia, incluindo bee_type_id
        setHive({
          id: hiveRes.data.id,
          name: hiveRes.data.name || `COLMEIA ${hiveRes.data.id}`, // Garante um nome
          size: hiveRes.data.size || '',
          bee_type_id: hiveRes.data.bee_type_id || '', // <-- ESSENCIAL PARA O FORM
          location: {
            lat: hiveRes.data.location_lat,
            lng: hiveRes.data.location_lng
          },
          cameraConnected: true // Manter lógica original
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
  }, [hiveId, base, token, navigate]) // Dependências

  // Este useEffect lida com retornos do mapa/câmera
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

  const handleEdit = async (dadosAtualizados) => {
    // 1. Validar sessão e pegar userRootId
    const userString = localStorage.getItem('user');
    let userRootId = null;
    try {
      const u = userString ? JSON.parse(userString) : null;
      const accessId = Number(u?.access_id);
      userRootId = accessId === 1 ? u?.id : u?.user_root_id;
    } catch {}
    
    if (!token || !userRootId) {
        alert('Sessão inválida. Faça login novamente.');
        navigate('/login');
        return;
    }

    // 2. Validar dados do formulário
    const size = parseInt(dadosAtualizados.size);
    if (isNaN(size) || size <= 0) {
      alert('Erro: Por favor, insira um tamanho válido.');
      return;
    }

    const bee_type_id = parseInt(dadosAtualizados.bee_type_id);
    if (isNaN(bee_type_id)) {
      alert('Erro: Por favor, selecione um tipo de abelha.');
      return;
    }

    // 3. Montar payload corrigido
    const payload = {
      bee_type_id: bee_type_id,
      location_lat: parseFloat(dadosAtualizados.location?.lat) || 0,
      location_lng: parseFloat(dadosAtualizados.location?.lng) || 0,
      size: size,
      // O backend em Pydantic (PUT) geralmente ignora campos não enviados,
      // então não precisamos enviar humidity/temperature se não forem editáveis.
    }

    try {
      // 4. Usar a rota PUT correta
      const url = `${base}/${userRootId}/hives/${hiveId}`;
      
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

      console.log('Colmeia atualizada com sucesso:', response.data)
      navigate('/hives-list') // Navega para a lista de colmeias
    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error.response?.data || error.message)
      alert('Erro ao atualizar colmeia.')
    }
  }

  if (loading) return <p className="text-center p-10">Carregando...</p>
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>
  if (!hive) return <p className="text-center p-10 text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      // A 'key' força o FormHive a remontar quando os dados (v.g. location) mudam
      key={hive.id + '-' + hive.location?.lat + '-' + hive.location?.lng + '-' + hive.cameraConnected}
      modo="editar"
      colmeia={hive}
      onConfirmar={handleEdit}
      beeTypes={beeTypes} // 5. Passar beeTypes para o formulário
    />
  )
}