export default function HiveForm({
  formData,
  onChange,
  onLocationClick,
  onConnectCamera,
  showCameraButton = false,
  showLocation = true
}) {
  return (
    <div className="bg-gray-100 rounded-xl shadow-xl py-10 px-25 w-full mx-auto">
      <div className='flex items-center gap-4 mx-auto w-fit mb-6'>
        <img src="/images/yellowBee.png" alt="Abelha" className='w-8' />
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
            onChange={onChange}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none shadow-sm"
          />
        </div>

        {/* Tamanho */}
        <div className="flex items-center gap-4">
          <label className="min-w-[90px] text-gray-600 font-medium">Tamanho:</label>
          <select
            name="size"
            value={formData.size}
            onChange={onChange}
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
            onChange={onChange}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm focus:outline-none"
          >
            <option value="">Selecione o tipo de abelha:</option>
            <option value="Bee 1">Bee 1</option>
            <option value="Bee 2">Bee 2</option>
            <option value="Bee 3">Bee 3</option>
          </select>
        </div>

        {/* Localização */}
        {showLocation && (
          <div className="flex items-center gap-4">
            <label className="min-w-[90px] text-gray-600 font-medium">Localização:</label>
            <button
              onClick={onLocationClick}
              className="flex-1 hover:bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition-colors"
              style={{ backgroundColor: '#ffd452' }}
            >
              {formData.location ? 'Editar localização' : 'Clique aqui para definir a localização'}
            </button>
          </div>
        )}

        {/* Exibição das coordenadas */}
        {formData.location && (
          <div className="text-sm text-gray-600 pl-[90px]">
            {formData.location.lat}, {formData.location.lng}
          </div>
        )}

        {/* Botão de conectar câmera */}
        {showCameraButton && formData.location && (
          <div className="pl-[90px]">
            <button
              onClick={onConnectCamera}
              className="mt-2 bg-yellow-400 hover:bg-yellow-300 font-bold py-2 px-8 rounded-xl shadow-md"
            >
              Conectar Câmera
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
