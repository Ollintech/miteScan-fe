// src/pages/Analysis.jsx
import AnalysisHist from '../../components/historical/analysis-card'
import ButtonBack from '../../components/buttonBack'

function Historical() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8'>
          <ButtonBack title="histórico de análises" redirect='/hives'/>
        <AnalysisHist />
        </div>
    </div>
  )
}

export default Historical
