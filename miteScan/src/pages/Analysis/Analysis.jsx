// src/pages/Analysis.jsx
import AnalysisCard from '../../components/Analysis/analysis'
import ButtonBack from '../../components/buttonBack'

function Analysis() {

  return (
    <div className="container-all">
      <div className='w-2/3 max-w-3xl min-w-xl'>
        <ButtonBack title="analisar agora" redirect='/hives' />
        <AnalysisCard />
      </div>
    </div>
  )
}

export default Analysis
