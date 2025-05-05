import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'
import { useEffect, useState } from 'react'

export default function AnalysisHist() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)

  // 🚧 Para futura conexão com a API:
  /*
  useEffect(() => {
    fetch('/api/hive_analyses/1') // substitua com o endpoint correto
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(err => console.error(err))
  }, [])
  */

  // 🔧 Dados mockados por enquanto
  useEffect(() => {
    setAnalysis({
      hive_name: 'Colmeia Rainha 01',
      date: '14/04/2025',
      temperature: 34,
      humidity: 65,
      bee_type: 'Apis mellifera',
      has_varroa: false,
      summary: 'Temperatura e umidade dentro dos padrões ideais.',
    })
  }, [])

  if (!analysis) return <p className="text-center p-6">Carregando...</p>

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl w-full">
      <div className="p-5">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center gap-3 mb-3 font-bold text-sm sm:text-base">
          <MdHexagon size={20} />
          <h3>{analysis.hive_name}</h3>
          <p>{analysis.date}</p>
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
            <p><strong>Temperatura:</strong> {analysis.temperature}°C</p>
            <p><strong>Umidade:</strong> {analysis.humidity}%</p>
            <p><strong>Tipo de abelha:</strong> {analysis.bee_type}</p>
            <p><strong>Varroa:</strong> {analysis.has_varroa ? 'Detectada' : 'Não detectada'}</p>
            <div className="bg-gray-500 h-0.5 my-2 w-2/3 mx-auto rounded-2xl"></div>
            <p><strong>Resumo:</strong> {analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Rodapé com status */}
      <div className={`w-full h-13 rounded-b-xl font-bold flex items-center justify-center text-sm sm:text-base
        ${analysis.has_varroa ? 'bg-red-200 text-red-900' : 'bg-green-100 text-green-900'}
      `}>
        {analysis.has_varroa ? '⚠️ Varroa detectada' : '✅ Sem varroa detectada'}
      </div>
    </div>
  )
}
