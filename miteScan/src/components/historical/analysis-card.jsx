import Image from '../../assets/images/colmeia-home.png'
import {
  MdHexagon,
  MdThermostat,
  MdWaterDrop,
  MdStraighten,
  MdCalendarToday,
  MdFilterList,
  MdHive,
  MdHelpOutline,
} from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AnalysisHist() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHive, setSelectedHive] = useState('all')

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [analysisToDelete, setAnalysisToDelete] = useState(null)

  const token = localStorage.getItem('token')
  const userString = localStorage.getItem('user')
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  let account = ''
  try {
    const userObj = JSON.parse(userString)
    account = userObj?.account || localStorage.getItem('account')
  } catch (e) {
    console.error('Erro ao parsear user:', e)
  }

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        if (!token || !account) {
          console.error('Token ou usuário não encontrado')
          setLoading(false)
          return
        }

        // Busca apenas as análises de forma limpa e direta
        const analysesRes = await axios.get(
          `${base}/hive_analyses/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { account },
          }
        )

        const sortedAnalyses = (analysesRes.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )

        setAnalyses(sortedAnalyses)
      } catch (error) {
        console.error('Erro ao buscar análises:', error)
        setAnalyses([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [token, account, base])

  const openDeleteModal = (analysis) => {
    setAnalysisToDelete(analysis)
    setDeleteModalOpen(true)
  }

  const confirmDeleteAnalysis = async () => {
    if (!analysisToDelete) return

    const analysisId = analysisToDelete.id

    try {
      await axios.delete(`${base}/hive_analyses/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAnalyses((prev) => prev.filter((item) => item.id !== analysisId))
    } catch (err) {
      console.error('Erro ao excluir análise:', err)
      alert('Não foi possível excluir a análise.')
    } finally {
      setDeleteModalOpen(false)
      setAnalysisToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4">
        <MdHexagon className="text-5xl text-yellow-500 animate-pulse" />
        <p className="text-gray-500 text-sm">
          Carregando histórico de análises...
        </p>
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-5">
          <MdHive className="text-4xl text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Nenhuma análise encontrada
        </h2>
        <p className="text-gray-500 text-sm text-center mt-2 max-w-md">
          Você ainda não possui análises cadastradas.
        </p>
      </div>
    )
  }

  const hiveMap = new Map()
  analyses.forEach((analysis) => {
    if (analysis.hive_id) {
      hiveMap.set(analysis.hive_id, `Colmeia ${analysis.hive_id}`)
    }
  })

  const hiveOptions = Array.from(hiveMap.entries()).map(([id, name]) => ({
    id,
    name,
  }))

  const visible = analyses.filter((item) => {
    if (selectedHive === 'all') {
      return true
    }
    return String(item.hive_id) === String(selectedHive)
  })

  const hiveNameForModal = `Colmeia ${analysisToDelete?.hive_id}`

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-10 relative">

      {/* FILTRO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mb-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <MdFilterList className="text-xl text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Filtrar análises
              </p>
              <p className="text-xs text-gray-500">
                Selecione uma colmeia para visualizar apenas seus resultados.
              </p>
            </div>
          </div>

          <select
            value={selectedHive}
            onChange={(e) => setSelectedHive(e.target.value)}
            className="w-full sm:w-56 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
          >
            <option value="all">Todas as colmeias</option>
            {hiveOptions.map((hive) => (
              <option key={hive.id} value={hive.id}>
                {hive.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTADOR */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Análises realizadas</h2>
        <p className="text-xs text-gray-500 mt-1">
          {visible.length}{' '}
          {visible.length === 1 ? 'análise encontrada' : 'análises encontradas'}
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-5">
        {visible.map((analysis) => {
          const isDanger =
            analysis.bee_status === 'varroa' ||
            analysis.bee_status === 'deformada' ||
            analysis.varroa_detected

          let statusConfig = {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'bg-green-100',
            status: 'Colmeia saudável',
            description: 'Nenhuma condição de risco foi identificada.',
            symbol: '✓',
          }

          if (isDanger) {
            statusConfig = {
              bg: 'bg-red-50',
              border: 'border-red-200',
              text: 'text-red-800',
              icon: 'bg-red-100',
              status:
                analysis.bee_status === 'deformada'
                  ? 'Atenção: Asas deformadas'
                  : 'Atenção: Varroa detectada',
              description:
                'A análise identificou uma condição que requer atenção.',
              symbol: '!',
            }
          }

          const result =
            analysis.bee_status ||
            (analysis.varroa_detected ? 'varroa' : 'normal')

          const resultLabel =
            result === 'varroa'
              ? 'Varroa detectada'
              : result === 'deformada'
                ? 'Asas deformadas'
                : 'Normal'

          const imageUrl = analysis.image_path
            ? analysis.image_path.startsWith('http')
              ? analysis.image_path
              : `${base}/${analysis.image_path}`
            : Image

          return (
            <div
              key={analysis.id || `${analysis.hive_id}-${analysis.created_at}`}
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300/60 transition-all duration-300">
                
                {/* CABEÇALHO DO CARD */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                        <MdHive className="text-2xl text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Colmeia {analysis.hive_id}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <MdCalendarToday className="text-sm" />
                          {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          isDanger ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        IA: {resultLabel}
                      </div>

                      <button
                        onClick={() => openDeleteModal(analysis)}
                        title="Excluir Análise"
                        className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* CONTEÚDO DO CARD */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* IMAGEM */}
                    <div className="w-full lg:w-[42%] shrink-0">
                      <div className="relative overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={imageUrl}
                          alt="Foto específica da análise"
                          onError={(e) => {
                            e.currentTarget.src = Image
                          }}
                          className="w-full h-52 sm:h-64 lg:h-60 object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute bottom-3 left-3">
                          <div
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                              isDanger ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                            }`}
                          >
                            {resultLabel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800 mb-4">
                        Informações da análise
                      </h4>

                      {/* ALERTA STATUS */}
                      <div className={`rounded-xl border ${statusConfig.border} ${statusConfig.bg} p-4`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${statusConfig.icon} ${statusConfig.text} flex items-center justify-center font-bold shrink-0`}>
                            {statusConfig.symbol}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${statusConfig.text}`}>
                              {statusConfig.status}
                            </p>
                            <p className={`text-xs ${statusConfig.text} opacity-80 mt-1`}>
                              {statusConfig.description}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <MdHive className="text-3xl text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-700">Nenhuma análise encontrada</h3>
          <p className="text-sm text-gray-500 mt-1">
            Não existem análises registradas para esta colmeia.
          </p>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-5 text-amber-500 shadow-xs">
              <MdHelpOutline className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Excluir Análise?
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Deseja realmente excluir a análise da <span className="font-semibold text-gray-700">"{hiveNameForModal}"</span>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-2xl transition duration-200 active:scale-95 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteAnalysis}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-2xl transition duration-200 active:scale-95 shadow-md shadow-amber-500/20 text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}