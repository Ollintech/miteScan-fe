// src/pages/Analysis.jsx
import ButtonBack from '../../components/buttonBack'
import Result from '../../components/analysis/result'

function ResultAnalysis() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8 mb-10'>
        <ButtonBack title="Resultado da análise" redirect='/analysis' />
        <Result />
      </div>
    </div>
  )
}

export default ResultAnalysis
