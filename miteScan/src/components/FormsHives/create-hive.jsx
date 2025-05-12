import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'

export default function CreateHiveCard() {
  const [beeTypes, setBeeTypes] = useState([])
  const userId = 5 // <- você pode puxar isso do contexto do usuário autenticado

  useEffect(() => {
    const fetchBeeTypes = async () => {
      try {
        const response = await axios.get('http://host.docker.internal:8000/bee_types/all')
        setBeeTypes(response.data)
      } catch (error) {
        console.error('Erro ao buscar tipos de abelha:', error)
      }
    }

    fetchBeeTypes()
  }, [])

  const handleCriar = async (dados) => {
    console.log('Criar colmeia com dados:', dados)

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
        'http://host.docker.internal:8000/hives/create',
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvQHRlc3RlLmNvbSIsInVzZXJfaWQiOjUsImFjY2Vzc19pZCI6MSwiZXhwIjoxNzQ3MDkxNjQxfQ.LZKAyoHTjB-MkndaGvMxJUBtaqfDlIwvvJPV0dWCXWY`
          }
        }
      )
      console.log('Colmeia criada com sucesso:', response.data)
    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message)
      alert('Erro ao cadastrar colmeia. Verifique os dados ou tente novamente.')
    }
  }


  return (
    <FormHive
      modo="criar"
      beeTypes={beeTypes}
      onConfirmar={handleCriar}
    />
  )
}
