import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'

export default function AnalysisHist() {
const navigate = useNavigate()

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl">
      <div className='p-8'>
        <div className='flex items-center gap-5 mb-3 font-bold'>
          <MdHexagon size={20} />
          <h3>Colmeia Rainha 01</h3>
          <p>14/04/2025</p>
        </div>

        <div className='flex '>
          <img src={Image} alt="colmeia" className='w-full' />

          <div className='justify-items-start ml-5'>
            <p><strong>Temperatura:</strong> 34°C</p>
            <p><strong>Umidade:</strong> 65%</p>
            <p><strong>Tipo de abelha:</strong> Apis mellifera</p>
            <p><strong>Varroa:</strong> Não detectada</p>
            <div className='bg-gray-500 h-0.5 my-2 w-2/3 mx-auto rounded-2xl'></div>
            <p><strong>Resumo:</strong> Temperatura e umidade dentro dos padrões ideais.</p>
          </div>
        </div>
      </div>

      <div className="w-full h-15 bg-green-100 rounded-b-xl font-bold content-center">
        ✅ Análise bem-sucedida
      </div>
    </div>
  )
}