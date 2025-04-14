// src/pages/Analysis.jsx
import { useNavigate } from 'react-router-dom'
import './Historical.css'

function Historical() {
  return (
    <div className="historical-wrapper">
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
      </div>
    </div>
  )
}

export default Historical
