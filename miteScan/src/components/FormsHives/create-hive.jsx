import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'

export default function CreateHiveCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const handleCreate = async (dados) => {
    console.log('Criar colmeia com dados:', dados)

    const payload = {
      user_id: userId,
      bee_type_id: null,
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
      localStorage.removeItem('draftHiveForm');
      console.log('Colmeia criada com sucesso:', response.data)
    } catch (error) {
      console.error('Erro ao criar colmeia:', error.response?.data || error.message)
      alert('Erro ao cadastrar colmeia. Verifique os dados ou tente novamente.')
    }
  }


  return (
    <FormHive
      modo="criar"
      onConfirmar={handleCreate}
    />
  )
}
