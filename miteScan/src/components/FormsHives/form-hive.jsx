import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import yellowBee from '../../assets/images/yellowBee.png'

export default function FormHive({ modo, colmeia = {}, onConfirmar, onExcluir }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    name: '',
    size: '',
    beeType: '',
    location: null,
    cameraConnected: false,
  })

  useEffect(() => {
    if ((modo === 'editar' || modo === 'excluir') && colmeia) {
      setFormData({
        name: colmeia.name || '',
        size: colmeia.size || '',
        beeType: colmeia.beeType || '',
        location: colmeia.location || null,
        cameraConnected: true, 
      })
    }
  }, [modo, colmeia])

  useEffect(() => {
    if (location.state?.location) {
      setFormData(prev => ({ ...prev, location: location.state.location }))
    }
    if (location.state?.cameraConnected) {
      setFormData(prev => ({ ...prev, cameraConnected: true }))
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationClick = () => {
    navigate('/select-location', { state: { ...formData, origem: modo } })
  }

  const handleConnectCamera = () => {
    navigate('/connect-camera', { state: { ...formData, origem: modo } })
  }

  const handleFinish = () => {
    navigate('/hives')
  }
  const handleAnalysis = () => {
    navigate('/analysis')
  }

  const isLeitura = modo === 'excluir'


  return (
    <div className="bg-gray-100 rounded-xl shadow-xl py-10 px-4 w-full mx-auto">
      <div className='flex items-center gap-4 mx-auto mb-6'>
        <img src={yellowBee} alt="Abelha" className='w-8' />
        <h3 className="text-gray-700 font-semibold text-center">
          {modo === 'criar' && 'PREENCHA AS INFORMAÇÕES ABAIXO'}
          {modo === 'editar' && 'EDITE AS INFORMAÇÕES'}
          {modo === 'excluir' && 'DESEJA MESMO EXCLUIR ESSA COLMEIA?'}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Nome */}
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-600 font-medium">Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={isLeitura}
            className="flex-1 px-2 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none shadow-sm"
          />
        </div>

        {/* Tamanho */}
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-600 font-medium">Tamanho:</label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            disabled={isLeitura}
            className="flex-1 px-2 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm focus:outline-none"
          >
            <option value="">Selecione o tamanho:</option>
            <option value="Small">Pequena</option>
            <option value="Medium">Média</option>
            <option value="Large">Grande</option>
          </select>
        </div>

        {/* Tipo */}
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-600 font-medium">Tipo:</label>
          <select
            name="beeType"
            value={formData.beeType}
            onChange={handleChange}
            disabled={isLeitura}
            className="flex-1 px-2 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm focus:outline-none"
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
          {!isLeitura ? (
            <button
              onClick={handleLocationClick}
              className="flex-1 hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
              style={{ backgroundColor: '#ffd452' }}
            >
              {formData.location ? 'Editar localização' : 'Clique aqui para definir a localização'}
            </button>
          ) : (
            <span className="text-gray-700">{formData.location?.lat}, {formData.location?.lng}</span>
          )}
        </div>

        {formData.location && !isLeitura && (
          <div className="text-sm text-gray-600 pl-[90px]">
            {formData.location.lat}, {formData.location.lng}
          </div>
        )}

        {/* Câmera */}
        {!isLeitura && formData.location && (
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Câmera:</label>
            <button
              onClick={handleConnectCamera}
              className="flex-1 style={{ backgroundColor: '#ffd452' }}hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
              style={{ backgroundColor: '#ffd452' }}
            >
              {formData.cameraConnected ?
                'Câmera Conectada' : 'Conectar Câmera'}
            </button>
          </div>
        )}

        {/* Botões finais */}
        <div className="flex justify-center mt-6">
          {modo === 'criar' && formData.location && formData.cameraConnected && (
            <button
              onClick={() => {
                onConfirmar(formData) // envia os dados pro back
                navigate('/analysis')
              }}
              className="bg-yellow-400 hover:bg-yellow-300 font-bold py-2 px-8 mt-3 rounded-xl shadow-md"
            >
              Confirmar
            </button>
          )}

          {modo === 'editar' && (
            <button
              onClick={() => {
                onConfirmar(formData)
                navigate('/hives')
              }}
              className="bg-yellow-400 hover:bg-yellow-300 font-bold py-2 px-8 mt-3 rounded-xl shadow-md"
            >
              Confirmar
            </button>
          )}

          {modo === 'excluir' && (
            <button
              onClick={onExcluir}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-8 mt-3 rounded-xl shadow-md"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
