import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AnalysisHist() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHive, setSelectedHive] = useState('all')

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token')
        const userString = localStorage.getItem('user')
        
        if (!token || !userString) {
          console.error('Token ou usuário não encontrado')
          setLoading(false)
          return
        }

        // Obter account
        let account;
        try {
          const userObj = JSON.parse(userString);
          account = userObj?.account || localStorage.getItem('account');
        } catch (e) {
          console.error('Erro ao parsear user:', e);
          setLoading(false)
          return;
        }

        if (!account) {
          console.error('Account não encontrado');
          setLoading(false)
          return
        }

        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        
        // Buscar todas as análises
        const response = await axios.get(`${base}/hive_analyses/all`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { account: account } // <-- CORREÇÃO AQUI
        })

        const analyses = (response.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        // Buscar dados das colmeias usando a rota correta com account
        const getHive = await Promise.all(
          analyses.map(async (analysis) => {
            try {
              const hiveRes = await axios.get(`${base}/${account}/hives/${analysis.hive_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })

              return {
                ...analysis,
                hive: hiveRes.data,
              }
            } catch (err) {
              console.error(`Erro ao buscar colmeia ${analysis.hive_id}:`, err)
              return {
                ...analysis,
                hive: null, // Retorna análise sem dados da colmeia se der erro
              }
            }
          })
        )

        setAnalyses(getHive)
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

  if (analyses.length === 0) return <p className="text-center p-6">Você ainda nao possui análises ou colmeias cadastradas</p>

  // Lógica para extrair nomes únicos das colmeias para o filtro
  const hiveMap = new Map();
  analyses.forEach(a => {
    if (a.hive) {
      hiveMap.set(a.hive.id, a.hive.name);
    } else if (a.hive_id) {
      // Fallback caso a colmeia não tenha sido encontrada
      hiveMap.set(a.hive_id, `Colmeia ${a.hive_id}`);
    }
  });
  const hiveOptions = Array.from(hiveMap.entries()).map(([id, name]) => ({ id, name }));


  const filterByHive = (item) => {
    if (selectedHive === 'all') return true
    return String(item.hive_id) === String(selectedHive)
  }

  const visible = analyses.filter(a => filterByHive(a))

  return (
    <div className='w-full'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-base sm:text-lg font-bold">Filtrar por:</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="sr-only">Colmeia</label>
          <select 
            value={selectedHive} 
            onChange={(e) => setSelectedHive(e.target.value)} 
            className="bg-gray-200 rounded px-2 py-1 text-sm w-full sm:w-auto"
          >
            <option value="all">COLMEIA</option>
            {/* CORREÇÃO AQUI para mostrar o nome */}
            {hiveOptions.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='w-full max-h-[calc(100vh-340px)] overflow-y-auto'>
      {visible.map((analysis) => (
        <div key={analysis.id} className="p-3 sm:p-5 mb-4">
          <div className="bg-gray-100 rounded-xl shadow-xl w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 font-bold text-xs sm:text-sm">
              <MdHexagon size={18} className="sm:w-5" />
              {/* CORREÇÃO AQUI para mostrar o nome */}
              <h3>{analysis.hive?.name ?? `COLMEIA ${analysis.hive_id}`}</h3>
              <span className="hidden sm:inline">|</span>
              <p className="text-xs sm:text-sm">{new Date(analysis.created_at).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col m-3 sm:flex-row items-center sm:items-center gap-4">
              <img
                src={Image} // Idealmente, isso deveria ser analysis.image_path
                alt="colmeia"
                className="w-full sm:w-1/2 h-auto rounded-xl"
              />

              <div className="text-sm sm:text-base w-full sm:max-w-xs space-y-2 sm:space-y-3 sm:ml-5">
                <p className="text-xs sm:text-base"><strong>Tamanho:</strong> {analysis.hive?.size ?? '--'} cm</p>
                <p className="text-xs sm:text-base"><strong>Temperatura:</strong> {analysis.hive?.temperature ?? '--'}°C</p>
                <p className="text-xs sm:text-base"><strong>Umidade:</strong> {analysis.hive?.humidity ?? '--'}%</p>
                <p className="text-xs sm:text-base"><strong>Varroa:</strong> {analysis.varroa_detected ? 'Detectada' : 'Não detectada'}</p>
              </div>
            </div>

            <div className={`w-full min-h-[48px] rounded-b-xl font-bold flex items-center justify-center text-xs sm:text-sm px-4 py-2
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