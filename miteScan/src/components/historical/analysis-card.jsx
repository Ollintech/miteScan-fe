import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AnalysisHist() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDays, setSelectedDays] = useState('all')
  const [selectedHive, setSelectedHive] = useState('all')

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token não encontrado')
          return
        }

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        const response = await axios.get(`${base}/hive_analyses/all`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const analyses = (response.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))


        const getHive = await Promise.all(
          analyses.map(async (analysis) => {
            try {
              try {
              const hiveRes = await axios.get(`${base}/hives/${analysis.hive_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })

              return {
                ...analysis,
                hive: hiveRes.data,
              }
            } catch (err) {
              console.error(`Erro ao buscar colmeia ${analysis.hive_id}:`, err)
              return analysis
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
        setAnalyses([]);
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  if (loading) return <p className="text-center p-6">Carregando...</p>

  if (analyses.length === 0) return <p className="text-center p-6">Nenhuma análise encontrada</p>

  // derive unique hive list for the hive select
  const hiveOptions = Array.from(new Set(analyses.map(a => a.hive_id))).map(id => ({ id }))

  const now = new Date()
  const filterByDays = (item) => {
    if (selectedDays === 'all') return true
    const days = Number(selectedDays)
    const created = new Date(item.created_at)
    const diffDays = (now - created) / (1000 * 60 * 60 * 24)
    return diffDays <= days
  }

  const filterByHive = (item) => {
    if (selectedHive === 'all') return true
    return String(item.hive_id) === String(selectedHive)
  }

  const visible = analyses.filter(a => filterByDays(a) && filterByHive(a))

  return (
    <div className='w-full'>
      {/* Filters header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Filtrar por:</h2>
        <div className="flex items-center gap-3">
          <label className="sr-only">Dias</label>
          <select value={selectedDays} onChange={(e) => setSelectedDays(e.target.value)} className="bg-gray-200 rounded px-2 py-1 text-sm">
            <option value="all">DIAS</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>

          <label className="sr-only">Colmeia</label>
          <select value={selectedHive} onChange={(e) => setSelectedHive(e.target.value)} className="bg-gray-200 rounded px-2 py-1 text-sm">
            <option value="all">COLMEIA</option>
            {hiveOptions.map(h => (
              <option key={h.id} value={h.id}>Colmeia {h.id}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='w-full max-h-[calc(100vh-340px)] overflow-y-auto'>
      {visible.map((analysis) => (
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
                <p><strong>Varroa:</strong> {analysis.has_varroa ? 'Detectada' : 'Não detectada'}</p>
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
    </div>
  )
}
