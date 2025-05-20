import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AnalysisHist() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }

        const response = await axios.get('http://localhost:8000/hive_analyses/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const analyses = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))


        const getHive = await Promise.all(
          analyses.map(async (analysis) => {
            try {
              const hiveRes = await axios.get(`http://localhost:8000/hives/${analysis.hive_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })

              return {
                ...analysis,
                hive: hiveRes.data
              }
            } catch (err) {
              console.error(`Erro ao buscar colmeia ${analysis.hive_id}:`, err)
              return analysis // retorna sem os dados da colmeia se der erro
            }
          })
        )

        setAnalyses(getHive)
        console.log(getHive)
      } catch (error) {
        console.error('Erro ao buscar análises:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  if (loading) return <p className="text-center p-6">Carregando...</p>

  if (analyses.length === 0) return <p className="text-center p-6">Nenhuma análise encontrada</p>

  return (
    <div className='w-full max-h-[calc(100vh-340px)] overflow-y-auto'>
      {analyses.map((analysis) => (
        <div key={analysis.id} className="p-5">
          <div className="bg-gray-100 rounded-xl shadow-xl w-full">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-center gap-3 p-4 font-bold text-sm sm:text-base">
              <MdHexagon size={20} />
              <h3>COLMEIA {analysis.hive_id}</h3>
              |
              <p>{new Date(analysis.created_at).toLocaleDateString()}</p>
            </div>

            {/* Conteúdo principal */}
            <div className="flex flex-col m-3 sm:flex-row items-center sm:items-center">
              <img
                src={Image}
                alt="colmeia"
                className="w-full sm:w-1/2 rounded-xl mb-4 sm:mb-0"
              />

              <div className="text-lg w-full space-y-3 justify-items-start sm:max-w-xs sm:ml-5">
                <p><strong>Tamanho:</strong> {analysis.hive?.size} cm</p>
                <p><strong>Temperatura:</strong> {analysis.hive?.temperature}°C</p>
                <p><strong>Umidade:</strong> {analysis.hive?.humidity}%</p>
              </div>
            </div>

            {/* Rodapé com status */}
            <div className={`w-full h-13 rounded-b-xl font-bold flex items-center justify-center text-sm sm:text-base
            ${analysis.varroa_detected ? 'bg-red-200 text-red-900' : 'bg-green-100 text-green-900'}
          `}>
              {analysis.varroa_detected ? '⚠️ Varroa detectada' : '✅ Sem varroa detectada'}
            </div>
          </div>
        </div>
      ))}

    </div>
  )
}
