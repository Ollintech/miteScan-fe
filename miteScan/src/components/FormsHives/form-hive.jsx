import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import yellowBee from '../../assets/images/yellowBee.png'

export default function FormHive({ modo, colmeia = {}, onConfirmar, onExcluir, beeTypes = [] }) {
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        name: '',
        size: '',
        bee_type_id: '',
        location: null,
        image: null,
        imagePreview: null
    })

    // Função para carregar dados da colmeia ao editar ou excluir
    useEffect(() => {
        if (modo === 'editar' || modo === 'excluir') {
            if (colmeia) {
                setFormData({
                    name: colmeia.name || '',
                    size: colmeia.size || '',
                    bee_type_id: colmeia.bee_type_id || '',
                    location: colmeia.location || null,
                    image: null,
                    imagePreview: colmeia.image_path ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${colmeia.image_path}` : null,
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
            }))
        }
    }, [colmeia?.location?.lat, colmeia?.location?.lng])

    // Função para atualizar dados do formulário a partir do estado da navegação
    useEffect(() => {
        if (location.state?.location) {
            setFormData(prev => ({ ...prev, location: location.state.location }))
        }
    }, [location.state])

    // Função para salvar rascunho do formulário ao criar colmeia
    useEffect(() => {
        if (modo === 'criar') {
            localStorage.setItem('draftHiveForm', JSON.stringify(formData));
        }
    }, [formData, modo]);

    // Função para atualizar campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }))
        }
    }

    // Função para navegar para seleção de localização
    const handleLocationClick = () => {
        navigate('/select-location', {
            state: {
                fromForm: formData,
                origem: modo,
                hiveId: colmeia?.id
            }
        })
    }


    const isLeitura = modo === 'excluir'

    const beeTypeName = isLeitura
        ? beeTypes.find(b => b.id === parseInt(formData.bee_type_id))?.name || 'Não informado'
        : ''

    // Função para formatar coordenadas
    const formatCoordinate = (value) => {
        if (value === null || value === undefined || value === '') return 'Não informado'
        const num = Number(value)
        if (Number.isNaN(num)) return value
        return num.toFixed(6)
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6">
            <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-200'>
                <img src={yellowBee} alt="Abelha" className='w-8 h-8' />
                <h3 className="text-gray-800 font-bold text-lg">
                    {modo === 'criar' && 'PREENCHA AS INFORMAÇÕES ABAIXO'}
                    {modo === 'editar' && 'EDITE AS INFORMAÇÕES'}
                    {modo === 'excluir' && 'DESEJA MESMO EXCLUIR ESSA COLMEIA?'}
                </h3>
            </div>

            <div className="space-y-5">

                <div className="flex items-center gap-4">
                    <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Nome da Colmeia:</label>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            readOnly={isLeitura}
                            className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                            placeholder="Ex.: Colmeia 01 - Jataí"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Tamanho (cm):</label>
                    <div className="flex-1 relative">
                        <input
                            type="number"
                            name="size"
                            value={formData.size}
                            onChange={(e) => handleChange({ target: { name: 'size', value: e.target.value.replace(/[^0-9]/g, '') } })}
                            readOnly={isLeitura}
                            className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                            placeholder="Ex.: 50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Tipo de Abelha:</label>
                    <div className="flex-1 relative">
                        {isLeitura ? (
                            <div className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 shadow-sm">
                                {beeTypeName}
                            </div>
                        ) : (
                            <select
                                name="bee_type_id"
                                value={formData.bee_type_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
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
                        <div className="flex-1">
                            <div className="w-full px-3 py-2 rounded-lg bg-yellow-300/80 text-gray-900 font-semibold shadow-sm">
                                {formData.location ? (
                                    <>
                                        <p>{formatCoordinate(formData.location.lat)}</p>
                                        <p>{formatCoordinate(formData.location.lng)}</p>
                                    </>
                                ) : (
                                    <p>Não informada</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {formData.location && !isLeitura && (
                    <div className="text-sm text-gray-600 pl-[124px] ">
                        {formData.location.lat}, {formData.location.lng}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <label className="min-w-[120px] text-gray-800 font-semibold text-sm">Foto da Colmeia:</label>
                    <div className="flex flex-col items-center gap-4">
                        {formData.imagePreview && (
                            <img 
                                src={formData.imagePreview} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-xl shadow-md border-2 border-yellow-400" 
                            />
                        )}
                        {!isLeitura && (
                            <div 
                                className="w-full bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-300 transition-colors"
                                onClick={() => document.getElementById('hive-image').click()}
                            >
                                <p className="text-gray-600 font-bold">{formData.imagePreview ? 'Alterar Foto' : 'Clique para anexar foto'}</p>
                                <input
                                    id="hive-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        )}
                        {isLeitura && !formData.imagePreview && (
                             <p className="text-gray-500 italic">Sem foto cadastrada</p>
                        )}
                    </div>
                </div>


                <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
                    {modo === 'criar' && formData.location && (
                        <button
                            onClick={() => {
                                onConfirmar(formData)
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