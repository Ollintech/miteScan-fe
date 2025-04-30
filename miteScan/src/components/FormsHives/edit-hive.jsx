import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HiveForm from './form-hive'

export default function EditHiveCard() {
  const { hiveId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    size: '',
    beeType: '',
    location: null,
  })

  // Simula busca de dados da colmeia pelo ID
  useEffect(() => {
    // Aqui você pode usar uma API real, ex: fetch(`/api/hives/${hiveId}`)
    const mockHive = {
      name: 'Colmeia 1',
      size: 'Large',
      beeType: 'Bee 1',
      location: { lat: -23.559616, lng: -46.658276 },
    }

    setFormData(mockHive)
  }, [hiveId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationClick = () => {
    navigate('/select-location', { state: { fromForm: formData } })
  }

  const handleSaveChanges = () => {
    // Aqui você faria uma chamada PUT para atualizar a colmeia no backend
    console.log('Dados atualizados:', formData)
    navigate('/dashboard') // volta para alguma tela depois de editar
  }

  return (
    <>
      <HiveForm
        formData={formData}
        onChange={handleChange}
        onLocationClick={handleLocationClick}
        onConnectCamera={null}
        showCameraButton={false}
      />

      <div className="text-center mt-4">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          Salvar Alterações
        </button>
      </div>
    </>
  )
}
