// src/pages/Analysis.jsx
import ButtonBack from '../../components/buttonBack'
import Result from '../../components/analysis/result'

function ResultAnalysis() {

  return (
    <div className="container-all">
      <div className='w-2/3 max-w-3xl min-w-xl mb-10'>
        <ButtonBack title="Resultado da análise" redirect='/analysis' />
        <Result />
      </div>
    </div>
  )
}

export default ResultAnalysis
