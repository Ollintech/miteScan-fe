import Image from '../../assets/images/colmeia-home.png'
import {
  MdHexagon,
  MdThermostat,
  MdWaterDrop,
  MdStraighten,
  MdCalendarToday,
  MdFilterList,
  MdHive,
} from 'react-icons/md'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AnalysisHist() {
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

        let account

        try {
          const userObj = JSON.parse(userString)

          account =
            userObj?.account ||
            localStorage.getItem('account')
        } catch (e) {
          console.error('Erro ao parsear user:', e)
          setLoading(false)
          return
        }

        if (!account) {
          console.error('Account não encontrado')
          setLoading(false)
          return
        }

        const base =
          import.meta.env.VITE_API_BASE_URL ||
          'http://localhost:8000'

        const response = await axios.get(
          `${base}/hive_analyses/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              account,
            },
          }
        )

        const sortedAnalyses = (response.data || []).sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        )

        const analysesWithHive = await Promise.all(
          sortedAnalyses.map(async (analysis) => {
            try {
              const hiveRes = await axios.get(
                `${base}/${account}/hives/${analysis.hive_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )

              return {
                ...analysis,
                hive: hiveRes.data,
              }
            } catch (err) {
              console.error(
                `Erro ao buscar colmeia ${analysis.hive_id}:`,
                err
              )

              return {
                ...analysis,
                hive: null,
              }
            }
          })
        )

        setAnalyses(analysesWithHive)
      } catch (error) {
        console.error(
          'Erro ao buscar análises:',
          error
        )

        setAnalyses([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  /* =========================
     LOADING
  ========================== */

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

  /* =========================
     SEM ANÁLISES
  ========================== */

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
          Você ainda não possui análises ou colmeias cadastradas.
        </p>
      </div>
    )
  }

  /* =========================
     COLMEIAS
  ========================== */

  const hiveMap = new Map()

  analyses.forEach((analysis) => {
    if (analysis.hive) {
      hiveMap.set(
        analysis.hive.id,
        analysis.hive.name
      )
    } else if (analysis.hive_id) {
      hiveMap.set(
        analysis.hive_id,
        `Colmeia ${analysis.hive_id}`
      )
    }
  })

  const hiveOptions = Array.from(
    hiveMap.entries()
  ).map(([id, name]) => ({
    id,
    name,
  }))

  /* =========================
     FILTRO
  ========================== */

  const visible = analyses.filter((item) => {
    if (selectedHive === 'all') {
      return true
    }

    return (
      String(item.hive_id) ===
      String(selectedHive)
    )
  })

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-10">

      {/* =========================
          FILTRO
      ========================== */}

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
            onChange={(e) =>
              setSelectedHive(e.target.value)
            }
            className="
              w-full sm:w-56
              bg-gray-50
              border border-gray-200
              rounded-xl
              px-4 py-2.5
              text-sm
              font-medium
              text-gray-700
              outline-none
              cursor-pointer
              transition
              focus:border-yellow-500
              focus:ring-2
              focus:ring-yellow-100
            "
          >
            <option value="all">
              Todas as colmeias
            </option>

            {hiveOptions.map((hive) => (
              <option
                key={hive.id}
                value={hive.id}
              >
                {hive.name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* =========================
          CONTADOR
      ========================== */}

      <div className="mb-4">

        <h2 className="text-lg font-bold text-gray-800">
          Análises realizadas
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          {visible.length}{' '}
          {visible.length === 1
            ? 'análise encontrada'
            : 'análises encontradas'}
        </p>

      </div>

      {/* =========================
          CARDS
      ========================== */}

      <div className="space-y-5">

        {visible.map((analysis) => {

          const hive = analysis.hive

          /* =========================
             STATUS
          ========================== */

          const isDanger =
            analysis.bee_status === 'varroa' ||
            analysis.bee_status === 'deformada' ||
            analysis.varroa_detected

          let isAlert = false

          if (hive && !isDanger) {

            const tempOk =
              hive.temperature >= 33.5 &&
              hive.temperature <= 36

            const humOk =
              hive.humidity >= 37 &&
              hive.humidity <= 43

            if (!tempOk || !humOk) {
              isAlert = true
            }
          }

          let statusConfig = {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'bg-green-100',
            status: 'Colmeia saudável',
            description:
              'Nenhuma condição de risco foi identificada.',
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

          } else if (isAlert) {

            statusConfig = {
              bg: 'bg-orange-50',
              border: 'border-orange-200',
              text: 'text-orange-800',
              icon: 'bg-orange-100',
              status: 'Colmeia em alerta',
              description:
                'As condições ambientais estão fora dos valores ideais.',
              symbol: '!',
            }

          }

          const result =
            analysis.bee_status ||
            (
              analysis.varroa_detected
                ? 'varroa'
                : 'normal'
            )

          const resultLabel =
            result === 'varroa'
              ? 'Varroa detectada'
              : result === 'deformada'
                ? 'Asas deformadas'
                : 'Normal'

          const imageUrl =
            analysis.image_path
              ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${analysis.image_path}`
              : Image

          return (

            <div
              key={
                analysis.id ||
                analysis._id ||
                `${analysis.hive_id}-${analysis.created_at}`
              }
              className="
                bg-white
                border border-gray-200
                rounded-2xl
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition-shadow
              "
            >

              {/* =========================
                  CABEÇALHO DO CARD
              ========================== */}

              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                      <MdHive className="text-2xl text-yellow-600" />
                    </div>

                    <div>

                      <h3 className="font-bold text-gray-800">
                        {hive?.name ||
                          `Colmeia ${analysis.hive_id}`}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MdCalendarToday className="text-sm" />

                        {new Date(
                          analysis.created_at
                        ).toLocaleDateString('pt-BR')}
                      </div>

                    </div>

                  </div>

                  <div
                    className={`
                      self-start sm:self-auto
                      px-3 py-1.5
                      rounded-full
                      text-xs
                      font-bold
                      ${
                        isDanger
                          ? 'bg-red-100 text-red-700'
                          : isAlert
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                      }
                    `}
                  >
                    IA: {resultLabel}
                  </div>

                </div>

              </div>

              {/* =========================
                  CONTEÚDO DO CARD
              ========================== */}

              <div className="p-4 sm:p-6">

                <div className="flex flex-col lg:flex-row gap-6">

                  {/* =========================
                      IMAGEM
                  ========================== */}

                  <div className="w-full lg:w-[42%] shrink-0">

                    <div className="relative overflow-hidden rounded-xl bg-gray-100">

                      <img
                        src={imageUrl}
                        alt="Foto da análise"
                        onError={(e) => {
                          e.currentTarget.src = Image
                        }}
                        className="
                          w-full
                          h-52
                          sm:h-64
                          lg:h-60
                          object-cover
                        "
                      />

                      <div className="absolute bottom-3 left-3">

                        <div
                          className={`
                            px-3 py-1.5
                            rounded-full
                            text-xs
                            font-bold
                            shadow-md
                            ${
                              isDanger
                                ? 'bg-red-600 text-white'
                                : isAlert
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-green-600 text-white'
                            }
                          `}
                        >
                          {resultLabel}
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      INFORMAÇÕES
                  ========================== */}

                  <div className="flex-1">

                    <h4 className="text-sm font-bold text-gray-800 mb-4">
                      Informações da colmeia
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                      {/* TAMANHO */}

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                        <div className="flex items-center gap-2 mb-2">

                          <MdStraighten className="text-xl text-gray-500" />

                          <span className="text-xs text-gray-500">
                            Tamanho
                          </span>

                        </div>

                        <p className="text-lg font-bold text-gray-800">
                          {hive?.size ?? '--'}

                          <span className="text-xs font-medium text-gray-500 ml-1">
                            cm
                          </span>
                        </p>

                      </div>

                      {/* TEMPERATURA */}

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                        <div className="flex items-center gap-2 mb-2">

                          <MdThermostat className="text-xl text-gray-500" />

                          <span className="text-xs text-gray-500">
                            Temperatura
                          </span>

                        </div>

                        <p className="text-lg font-bold text-gray-800">
                          {hive?.temperature ?? '--'}

                          <span className="text-xs font-medium text-gray-500 ml-1">
                            °C
                          </span>
                        </p>

                      </div>

                      {/* UMIDADE */}

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

                        <div className="flex items-center gap-2 mb-2">

                          <MdWaterDrop className="text-xl text-gray-500" />

                          <span className="text-xs text-gray-500">
                            Umidade
                          </span>

                        </div>

                        <p className="text-lg font-bold text-gray-800">
                          {hive?.humidity ?? '--'}

                          <span className="text-xs font-medium text-gray-500 ml-1">
                            %
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* =========================
                        ALERTA
                    ========================== */}

                    <div
                      className={`
                        mt-5
                        rounded-xl
                        border
                        ${statusConfig.border}
                        ${statusConfig.bg}
                        p-4
                      `}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`
                            w-9 h-9
                            rounded-full
                            ${statusConfig.icon}
                            ${statusConfig.text}
                            flex items-center justify-center
                            font-bold
                            shrink-0
                          `}
                        >
                          {statusConfig.symbol}
                        </div>

                        <div>

                          <p
                            className={`
                              text-sm
                              font-bold
                              ${statusConfig.text}
                            `}
                          >
                            {statusConfig.status}
                          </p>

                          <p
                            className={`
                              text-xs
                              ${statusConfig.text}
                              opacity-80
                              mt-1
                            `}
                          >
                            {statusConfig.description}
                          </p>

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

      {/* =========================
          FILTRO SEM RESULTADOS
      ========================== */}

      {visible.length === 0 && (

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <MdHive className="text-3xl text-gray-400" />
          </div>

          <h3 className="font-bold text-gray-700">
            Nenhuma análise encontrada
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Não existem análises registradas para esta colmeia.
          </p>

        </div>

      )}

    </div>
  )
}