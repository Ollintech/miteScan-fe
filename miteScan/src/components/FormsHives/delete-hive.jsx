import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function DeleteHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [colmeia, setColmeia] = useState(null)
  const [beeTypeName, setBeeTypeName] = useState('')
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const colmeiaRes = await axios.get(`http://host.docker.internal:8000/hives/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const hiveData = colmeiaRes.data

        const beeTypeRes = await axios.get(`http://host.docker.internal:8000/bee_types/${hiveData.bee_type_id}`)

        setColmeia({
          id: hiveData.id,
          name: hiveData.name || '',
          size: hiveData.size || '',
          beeType: hiveData.bee_type_id?.toString() || '',
          location: {
            lat: hiveData.location_lat,
            lng: hiveData.location_lng
          },
          cameraConnected: true
        })

        setBeeTypeName(beeTypeRes.data.name || 'Desconhecida')
      } catch (err) {
        console.error('❌ Erro ao buscar colmeia ou espécie:', err)
        alert('Erro ao carregar colmeia.')
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [id, token])

  const handleExcluir = async () => {
    try {
      await axios.delete(`http://host.docker.internal:8000/hives/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert('Colmeia excluída com sucesso.')
      navigate('/hives')
    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message)
      alert('Erro ao excluir colmeia.')
    }
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!colmeia) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      key={colmeia.id}
      modo="excluir"
      colmeia={{ ...colmeia, beeTypeName }}
      onExcluir={handleExcluir}
    />
  )
}
