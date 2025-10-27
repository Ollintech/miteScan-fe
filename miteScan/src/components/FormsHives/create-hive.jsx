import { useEffect, useState } from 'react'
import FormHive from './form-hive'
import axios from 'axios'

export default function CreateHiveCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [beeTypes, setBeeTypes] = useState([]);

  useEffect(() => {
    const fetchBeeTypes = async () => {
      try {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/bee_types/all`);
        setBeeTypes(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de abelha:', error.response?.data || error.message);
      }
    };

    fetchBeeTypes();
  }, []); // Array vazio garante que a busca ocorra apenas uma vez

  const handleCreate = async (dados) => {
    console.log('Criar colmeia com dados:', dados)

    const payload = {
      bee_type_id: parseInt(dados.bee_type_id) || null,
      location_lat: parseFloat(dados.location?.lat) || 0,
      location_lng: parseFloat(dados.location?.lng) || 0,
      size: parseInt(dados.size),
      humidity: null,
      temperature: null
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${userId}/hives/create`,
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
      beeTypes={beeTypes} // Passando os tipos de abelha para o formulário
    />
  )
}