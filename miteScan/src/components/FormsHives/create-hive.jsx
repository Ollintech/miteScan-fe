import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([])
  const [formError, setFormError] = useState('')
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get('http://localhost:8000/bee_types/all')
        setBeeTypes(response.data)
      } catch (error) {
        console.error('Erro ao buscar tipos de abelha:', error)
      }
    }

    fetch()
  }, [])

  const handleCreate = async (dados) => {
    // Verificação de campos obrigatórios
    if (!dados.size || !dados.beeType || !dados.location || !dados.cameraConnected) {
      setFormError("Preencha todos os campos")
      return
    }

    const payload = {
      user_id: userId,
      bee_type_id: parseInt(dados.beeType),
      location_lat: parseFloat(dados.location?.lat) || 0,
      location_lng: parseFloat(dados.location?.lng) || 0,
      size: parseInt(dados.size),
      humidity: null,
      temperature: null
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        'http://localhost:8000/hives/create',
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      localStorage.removeItem('draftHiveForm')
      setFormError('')
      // Redirecionamento deve ser feito apenas no sucesso. Pode ser aqui ou no FormHive
      window.location.href = '/analysis'
    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message)
      setFormError("Erro ao cadastrar colmeia. Verifique os dados ou tente novamente.")
    }
  }

  return (
    <FormHive
      modo="criar"
      beeTypes={beeTypes}
      onConfirmar={handleCreate}
      dataError={formError}
    />
  )
}
