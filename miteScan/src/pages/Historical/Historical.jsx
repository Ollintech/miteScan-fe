// src/pages/Analysis.jsx
import { useNavigate } from 'react-router-dom'
import './Historical.css'
import { FaArrowLeft } from 'react-icons/fa'
import AnalysisHist from '../../components/historical/analysis-card'

function Historical() {
  const navigate = useNavigate()

  return (
    <div className="container-all">
      <div className='max-w-2/3'>
        <div className="flex items-center justify-between mb-2">
          <div className='flex items-center gap-4 text-2xl font-bold'>
            <button className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
              onClick={() => navigate('/hives')}>
              <FaArrowLeft size={25} />
            </button>
            HISTÓRICO DE ANÁLISES
          </div>
        </div>
        <AnalysisHist />
      </div>

      {/*
      <h2 className="historical-title">Histórico de Análises</h2>

      <div className="historical-card">
        <h3>Colmeia Rainha 01</h3>
        <p><strong>Data da análise:</strong> 14/04/2025</p>
        <p><strong>Temperatura:</strong> 34°C</p>
        <p><strong>Umidade:</strong> 65%</p>
        <p><strong>Tipo de abelha:</strong> Apis mellifera</p>
        <p><strong>Varroa:</strong> Não detectada</p>
        <p><strong>Resumo:</strong> Temperatura e umidade dentro dos padrões ideais.</p>

        <div className="status-sucesso">
          ✅ Análise bem-sucedida
        </div>
      </div>*/}
    </div>
  )
}

export default Historical
