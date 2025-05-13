import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function EditHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [colmeia, setColmeia] = useState(null)
  const [beeTypes, setBeeTypes] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [colmeiaRes, beeTypesRes] = await Promise.all([
          axios.get(`http://host.docker.internal:8000/hives/${id}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }),
          axios.get('http://host.docker.internal:8000/bee_types/all')
        ])

        setColmeia({
          id: colmeiaRes.data.id,
          name: colmeiaRes.data.name || '',
          size: colmeiaRes.data.size || '',
          beeType: colmeiaRes.data.bee_type_id?.toString() || '',
          location: {
            lat: colmeiaRes.data.location_lat,
            lng: colmeiaRes.data.location_lng
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

    fetchDados()
  }, [id])

  useEffect(() => {
    if (location.state?.location || location.state?.cameraConnected) {
      setColmeia(prev => {
        if (!prev) return prev // Evita erro se colmeia ainda não tiver carregado
        return {
          ...prev,
          location: location.state.location || prev.location,
          cameraConnected: location.state.cameraConnected ?? prev.cameraConnected
        }
      })
    }
  }, [location.state])



  const handleEditar = async (dadosAtualizados) => {
    const payload = {
      bee_type_id: parseInt(dadosAtualizados.beeType),
      location_lat: parseFloat(dadosAtualizados.location?.lat) || 0,
      location_lng: parseFloat(dadosAtualizados.location?.lng) || 0,
      size: parseInt(dadosAtualizados.size),
      humidity: null,
      temperature: null
    }

    try {
      const response = await axios.put(
        `http://host.docker.internal:8000/hives/${id}`,
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
  if (!colmeia) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  console.log(location.state)

  return (
    <FormHive
      key={colmeia.id + '-' + colmeia.location?.lat + '-' + colmeia.location?.lng + '-' + colmeia.cameraConnected}
      modo="editar"
      colmeia={colmeia}
      beeTypes={beeTypes}
      onConfirmar={handleEditar}
    />
  )
}
