// src/pages/Analysis.jsx
import AnalysisHist from '../../components/Historical/analysis-card'
import ButtonBack from '../../components/buttonBack'

function Historical() {

  return (
    <div className="container-all">
      <div className='w-2/3 max-w-3xl min-w-xl'>
          <ButtonBack title="histórico de análises" redirect='/hives'/>
        <AnalysisHist />
        </div>
    </div>
  )
}

export default Historical
