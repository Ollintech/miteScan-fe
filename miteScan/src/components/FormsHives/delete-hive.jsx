import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function DeleteHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hive, sethive] = useState(null)
  const [beeTypeName, setBeeTypeName] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState('')


  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/hives/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const hiveData = response.data

        const beeTypeResponse = await axios.get(`http://localhost:8000/bee_types/${hiveData.bee_type_id}`)

        sethive({
          id: hiveData.id,
          name: hiveData.name || '',
          size: hiveData.size || '',
          beeTypeName: beeTypeResponse.data.name || 'Desconhecida',
          location: {
            lat: hiveData.location_lat,
            lng: hiveData.location_lng
          },
          cameraConnected: true
        })

        setBeeTypeName(beeTypeResponse.data.name || 'Desconhecida')
      } catch (err) {
        console.error('❌ Erro ao buscar colmeia ou espécie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id, token])

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/hives/${id}?confirm=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      setDeleteError('')
      navigate('/hives')

    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error.response?.data || error.message)
      setDeleteError('Não foi possível excluir essa colmeia.')
    }
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!hive) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      key={hive.id}
      modo="excluir"
      colmeia={{ ...hive, beeTypeName }}
      onExcluir={handleDelete}
      deleteError={deleteError}
    />
  )
}
