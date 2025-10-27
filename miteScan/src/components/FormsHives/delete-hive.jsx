import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function DeleteHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hive, sethive] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchDados = async () => {
      try {
  const hiveRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/hives/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
 
        const hiveData = hiveRes.data

        sethive({
          id: hiveData.id,
          name: hiveData.name || '',
          size: hiveData.size || '',
          location: {
            lat: hiveData.location_lat,
            lng: hiveData.location_lng
          },
          cameraConnected: true
        })
      } catch (err) {
        console.error('❌ Erro ao buscar colmeia:', err)
        alert('Erro ao carregar colmeia.')
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [id, token])

  const handleDelete = async () => {
    try {
  await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/hives/${id}?confirm=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      alert('Colmeia excluída com sucesso.')
      navigate('/hives')
    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message)
      alert('Erro ao excluir colmeia.')
    }
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!hive) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      key={hive.id}
      modo="excluir"
      colmeia={hive}
      onExcluir={handleDelete}
    />
  )
}
