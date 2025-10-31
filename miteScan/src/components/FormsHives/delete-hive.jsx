import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function DeleteHiveCard() {
  const { id: hiveId } = useParams() // Renomeado para clareza
  const navigate = useNavigate()
  
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([]) // Adicionado para exibir o nome
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("") // Adicionado para feedback

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
        // 2. URLs corrigidas e busca de beeTypes
        const hiveUrl = `${base}/${userRootId}/hives/${hiveId}`;
        const beeTypesUrl = `${base}/bee_types/all`;

        const [hiveRes, beeTypesRes] = await Promise.all([
          axios.get(hiveUrl, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(beeTypesUrl, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const hiveData = hiveRes.data
        
        setBeeTypes(beeTypesRes.data || []); // Salva os tipos de abelha
        setHive({
          id: hiveData.id,
          name: hiveData.name || `COLMEIA ${hiveData.id}`,
          size: hiveData.size || '',
          bee_type_id: hiveData.bee_type_id || '', // Adicionado
          location: {
            lat: hiveData.location_lat,
            lng: hiveData.location_lng
          },
          cameraConnected: true // Mantido
        })
        
      } catch (err) {
        console.error('❌ Erro ao buscar colmeia:', err)
        // 3. Tratamento de erro melhorado
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
  }, [hiveId, token, base, navigate]) // Dependências atualizadas

  const handleDelete = async () => {
    // 4. Validar userRootId antes de deletar
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

    try {
      // 5. URL de exclusão corrigida
      const url = `${base}/${userRootId}/hives/${hiveId}?confirm=true`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Colmeia excluída com sucesso.')
      navigate('/hives') // 6. Navegação corrigida
    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message)
      alert('Erro ao excluir colmeia.')
    }
  }

  if (loading) return <p className="text-center p-10">Carregando...</p>
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>
  if (!hive) return <p className="text-center p-10 text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      key={hive.id}
      modo="excluir"
      colmeia={hive}
      onExcluir={handleDelete}
      beeTypes={beeTypes} // Passa os tipos de abelha para o formulário
    />
  )
}