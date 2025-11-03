import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import yellowBee from '../../assets/images/yellowBee.png'

export default function FormHive({ modo, colmeia = {}, onConfirmar, onExcluir, beeTypes = [] }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    name: 'COLMEIA 1',
    size: '',
    bee_type_id: '',
    location: null,
    cameraConnected: false,
  })

  useEffect(() => {
    if (modo === 'editar' || modo === 'excluir') {
      if (colmeia) {
        setFormData({
          name: colmeia.name || '',
          size: colmeia.size || '',
          bee_type_id: colmeia.bee_type_id || '',
          location: colmeia.location || null,
          cameraConnected: colmeia.cameraConnected ?? true,
        });
      }
    } else if (modo === 'criar') {
      const draft = location.state?.fromForm || JSON.parse(localStorage.getItem('draftHiveForm'));
      if (draft) {
        setFormData(draft);
      }
    }

  }, [modo, colmeia?.id, location.state]);


  useEffect(() => {
    if ((modo === 'editar' || modo === 'excluir') && colmeia) {
      setFormData(prev => ({
        ...prev,
        location: colmeia.location || prev.location,
        cameraConnected: colmeia.cameraConnected ?? prev.cameraConnected,
      }))
    }
  }, [colmeia?.location?.lat, colmeia?.location?.lng, colmeia?.cameraConnected])


  useEffect(() => {
    if (location.state?.location) {
      setFormData(prev => ({ ...prev, location: location.state.location }))
    }
    if (location.state?.cameraConnected) {
      setFormData(prev => ({ ...prev, cameraConnected: true }))
    }
  }, [location.state])

  useEffect(() => {
    if (modo === 'criar') {
      localStorage.setItem('draftHiveForm', JSON.stringify(formData));
    }
  }, [formData, modo]);


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationClick = () => {
    navigate('/select-location', {
      state: {
        fromForm: formData,
        origem: modo,
        hiveId: colmeia?.id
      }
    })
  }

  const handleConnectCamera = () => {
    navigate('/connect-camera', {
      state: {
        fromForm: formData,
        origem: modo
      }
    })
  }

  const isLeitura = modo === 'excluir'

  // Para exibir o nome do tipo de abelha no modo de exclusão
  const beeTypeName = isLeitura 
    ? beeTypes.find(b => b.id === parseInt(formData.bee_type_id))?.name || 'Não informado'
    : '';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-200'>
        <img src={yellowBee} alt="Abelha" className='w-8 h-8' />
        <h3 className="text-gray-800 font-bold text-lg">
          {modo === 'criar' && 'PREENCHA AS INFORMAÇÕES ABAIXO'}
          {modo === 'editar' && 'EDITE AS INFORMAÇÕES'}
          {modo === 'excluir' && 'DESEJA MESMO EXCLUIR ESSA COLMEIA?'}
        </h3>
      </div>

      <div className="space-y-5">

        {/* Tamanho */}
        <div className="flex items-center gap-4">
          <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Tamanho (cm):</label>
          <div className="flex-1 relative">
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={(e) => handleChange({ target: { name: 'size', value: e.target.value.replace(/[^0-9]/g, '') } })}
              readOnly={isLeitura}
              className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ex.: 50"
            />
          </div>
        </div>
        
        {/* Tipo de Abelha */}
        <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Tipo de Abelha:</label>
            <div className="flex-1 relative">
                {isLeitura ? (
                    <span className="text-gray-700 px-3 py-2">{beeTypeName}</span>
                ) : (
                    <select
                        name="bee_type_id"
                        value={formData.bee_type_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option value="" disabled>Selecione um tipo</option>
                        {beeTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>


        {/* Localização */}
        <div className="flex items-center gap-4">
          <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Localização:</label>
          {!isLeitura ? (
            <button
              onClick={handleLocationClick}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors text-center"
            >
              {formData.location ? 'Editar localização' : 'Clique aqui para definir localização'}
            </button>
          ) : (
            <span className="text-gray-700">{formData.location?.lat}, {formData.location?.lng}</span>
          )}
        </div>

        {formData.location && !isLeitura && (
          <div className="text-sm text-gray-600 pl-[124px]">
            {formData.location.lat}, {formData.location.lng}
          </div>
        )}

        {/* Câmera */}
        {!isLeitura && formData.location && (
          <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Câmera:</label>
            <button
              onClick={handleConnectCamera}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors text-center"
            >
              {formData.cameraConnected ? 'Câmera Conectada' : 'Conectar Câmera'}
            </button>
          </div>
        )}


        {/* Botões finais */}
        <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
          {modo === 'criar' && formData.location && formData.cameraConnected && (
            <button
              onClick={() => {
                onConfirmar(formData)
                navigate('/analysis')
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-1 px-8 rounded-xl shadow-md transition-colors"
            >
              Confirmar
            </button>
          )}

          {modo === 'editar' && (
            <button
              onClick={() => {
                onConfirmar(formData)
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-1 px-8 rounded-xl shadow-md transition-colors"
            >
              Confirmar
            </button>
          )}

          {modo === 'excluir' && (
            <button
              onClick={onExcluir}
              className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-8 rounded-xl shadow-md transition-colors"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}