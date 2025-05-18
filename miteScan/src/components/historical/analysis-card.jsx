import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'
import { useEffect, useState } from 'react'

export default function AnalysisHist() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }
        const response = await fetch('http://localhost:8000/hive_analyses/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar análises')
        }

        const data = await response.json()
        setAnalyses(data)

        if(data.length >= 0) {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchAnalyses()
  }, [])

  if (loading) return <p className="text-center p-6">Carregando...</p>

  if (analyses.length === 0) return <p className="text-center p-6">Nenhuma análise encontrada</p>

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl w-full">
      {analyses.map((analyses) => (
        <div className="p-5">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-center gap-3 mb-3 font-bold text-sm sm:text-base">
            <MdHexagon size={20} />
            <h3>{analyses.hive_id}</h3>
            <p>{new Date(analyses.created_at).toLocaleDateString()}</p>
          </div>

          {/* Conteúdo principal: imagem + infos */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            {/* Imagem */}
            <img
              src={Image}
              alt="colmeia"
              className="w-full sm:w-1/2 rounded-xl mb-4 sm:mb-0"
            />

            {/* Informações */}
            <div className="text-md w-full sm:max-w-xs sm:ml-5">
              <p><strong>Tamanho:</strong> {analyses.hive.size} cm</p>
              <p><strong>Temperatura:</strong> {analyses.hive.temperature}°C</p>
              <p><strong>Umidade:</strong> {analyses.hive.humidity}%</p>
              <p><strong>Varroa:</strong> {analyses.hive.varroa_detected ? 'Detectada' : 'Não detectada'}</p>
            </div>
          </div>
            {/* Rodapé com status */}
          <div className={`w-full h-13 rounded-b-xl font-bold flex items-center justify-center text-sm sm:text-base
            ${analyses.has_varroa ? 'bg-red-200 text-red-900' : 'bg-green-100 text-green-900'}
          `}>
            {analyses.has_varroa ? '⚠️ Varroa detectada' : '✅ Sem varroa detectada'}
          </div>
        </div>
      ))}
    </div >
  )
}
