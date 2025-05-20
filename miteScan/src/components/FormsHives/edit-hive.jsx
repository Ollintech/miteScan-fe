import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function EditHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [hive, setHive] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetch = async () => {
      try {
        const [hiveRes, beeTypesRes] = await Promise.all([
          axios.get(`http://localhost:8000/hives/${id}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:8000/bee_types/all')
        ])

        setHive({
          id: hiveRes.data.id,
          name: hiveRes.data.name || '',
          size: hiveRes.data.size || '',
          beeType: hiveRes.data.bee_type_id?.toString() || '',
          location: {
            lat: hiveRes.data.location_lat,
            lng: hiveRes.data.location_lng
          },
          cameraConnected: true
        })

        setBeeTypes(beeTypesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados da colmeia:', error)
        alert('Erro ao carregar colmeia.')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id])

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
    const payload = {
      bee_type_id: parseInt(dadosAtualizados.beeType),
      location_lat: parseFloat(dadosAtualizados.location?.lat) || 0,
      location_lng: parseFloat(dadosAtualizados.location?.lng) || 0,
      size: parseInt(dadosAtualizados.size),
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/hives/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )

      console.log('Colmeia atualizada com sucesso:', response.data)
      navigate('/hives')
    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error.response?.data || error.message)
      alert('Erro ao atualizar colmeia.')
    }
    console.log(formData)
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!hive) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  console.log(location.state)

  return (
    <FormHive
      key={hive.id + '-' + hive.location?.lat + '-' + hive.location?.lng + '-' + hive.cameraConnected}
      modo="editar"
      colmeia={hive}
      beeTypes={beeTypes}
      onConfirmar={handleEdit}
    />
  )
}
