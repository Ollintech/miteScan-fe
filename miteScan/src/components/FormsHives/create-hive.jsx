import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import yellowBee from '../../assets/images/yellowBee.png'
import { FaMapMarkerAlt } from 'react-icons/fa';
import { TbWorldLatitude } from "react-icons/tb";


export default function CreateHiveCard() {
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
    navigate('/connect-camera', { state: formData }) // redirecionando para a página de conectar a câmera
  }

  return (
    <>
      <div className="bg-gray-100 rounded-xl shadow-xl py-10 px-25 w-full mx-auto">
        <div className='flex items-center gap-4 mx-auto w-fit mb-6'>
          <img src={yellowBee} alt="" className='w-8' />
          <h3 className="text-gray-7003 font-semibold text-center">
            PREENCHA AS INFORMAÇÕES ABAIXO
          </h3>
        </div>

        <div className="space-y-4">
          {/* Nome */}
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Nome:</label>
            <input
              type="text"
              name="name"
              placeholder="Insira o nome da colmeia"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none shadow-sm"
            />
          </div>

          {/* Tamanho */}
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Tamanho:</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm focus:outline-none"
            >
              <option value="">Selecione o tamanho:</option>
              <option value="Small">Pequena</option>
              <option value="Medium">Média</option>
              <option value="Large">Grande</option>
            </select>
          </div>

          {/* Tipo de abelha */}
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Tipo:</label>
            <select
              name="beeType"
              value={formData.beeType}
              onChange={handleChange}
              className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm focus:outline-none"
            >
              <option value="">Selecione o tipo de abelha:</option>
              <option value="Bee 1">Bee 1</option>
              <option value="Bee 2">Bee 2</option>
              <option value="Bee 3">Bee 3</option>
            </select>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Localização:</label>
            <button
              onClick={handleLocationClick}
              className="flex-1 hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
              style={{ backgroundColor: '#ffd452' }}
            >
              {formData.location ? 'Editar localização' : 'Clique aqui para definir a localização'}
            </button>
          </div>

          {formData.location && (
            <div className="text-sm text-gray-600 pl-[90px]"> {formData.location.lat}, {formData.location.lng}</div>
          )}

          {formData.location && (
            <div className="pl-[90px]">
              <button
                onClick={handleConnectCamera}
                className="mt-2 bg-yellow-400 hover:bg-yellow-300 font-bold py-2 px-8 rounded-xl shadow-md"
              >
                Conectar Câmera
              </button>
            </div>
          )}
        </div>
      </div>

    </>
  )
}