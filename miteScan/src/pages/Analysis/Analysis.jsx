// src/pages/Analysis.jsx
import AnalysisCard from '../../components/Analysis/analysis'
import ButtonBack from '../../components/buttonBack'

function Analysis() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8 mb-10'>
        <ButtonBack title="analisar agora" redirect='/hives' />
        <AnalysisCard />
      </div>
    </div>
  )
}

export default Analysis
