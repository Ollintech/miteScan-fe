// src/pages/CreateHive/CreateHive.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CreateHive.css'

function CreateHive() {
  const navigate = useNavigate()
  const location = useLocation() // 👈 aqui pegamos os dados vindos do MapSelect

  const [formData, setFormData] = useState({
    name: '',
    size: '',
    beeType: '',
    location: null,
  })

  // Se voltou da tela de mapa, atualiza o estado com a nova localização
  useEffect(() => {
    if (location.state?.location) {
      setFormData((prevData) => ({
        ...prevData,
        location: location.state.location,
      }))
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLocationClick = () => {
    navigate('/select-location', { state: { fromForm: formData } })
  }

  const handleConnectCamera = () => {
    alert('Câmera conectada! (simulado)')
  }

  return (
    <div className="create-hive-container">
      <h2>Cadastrar Colmeia</h2>
      <div className="form-card">
        <h3>PREENCHA AS INOFRMAÇÕES ABAIXO </h3>
        <input
          type="text"
          name="name"
          placeholder="Nome da colmeia"
          value={formData.name}
          onChange={handleChange}
        />

        <select name="size" value={formData.size} onChange={handleChange}>
          <option value="">Selecione o tamanho:</option>
          <option value="Small">Pequena</option>
          <option value="Medium">Média</option>
          <option value="Large">Grande</option>
        </select>

        <select name="beeType" value={formData.beeType} onChange={handleChange}>
          <option value="">Selecione o tipo de abelha:</option>
          <option value="Bee 1">Bee 1</option>
          <option value="Bee 2">Bee 2</option>
          <option value="Bee 3">Bee 3</option>
        </select>

        <button onClick={handleLocationClick}>
          {formData.location ? 'Editar localização' : 'Selecionar localização'}
        </button>

        {formData.location && (
          <div className="location-preview">
            📍 {formData.location.lat}, {formData.location.lng}
          </div>
        )}

        {formData.location && (
          <button onClick={handleConnectCamera}>Conectar Câmera</button>
        )}
      </div>
    </div>
  )
}

export default CreateHive
