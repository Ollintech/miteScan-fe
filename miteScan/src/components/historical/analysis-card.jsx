import Image from '../../assets/images/colmeia-home.png'
import { useNavigate } from 'react-router-dom'
import { MdHexagon } from 'react-icons/md'

export default function AnalysisHist() {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-100 rounded-xl shadow-xl w-full">
      <div className="p-5">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center gap-3 mb-3 font-bold text-sm sm:text-base">
          <MdHexagon size={20} />
          <h3>Colmeia Rainha 01</h3>
          <p>14/04/2025</p>
        </div>

        {/* Conteúdo principal: imagem + infos */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {/* Imagem */}
          <img
            src={Image}
            alt="colmeia"
            className="w-full sm:w-1/2 rounded-xl mb-4 sm:mb-0"
          />

          {/* Informações */}
          <div className="text-md w-full sm:max-w-xs sm:ml-5">
            <p><strong>Temperatura:</strong> 34°C</p>
            <p><strong>Umidade:</strong> 65%</p>
            <p><strong>Tipo de abelha:</strong> Apis mellifera</p>
            <p><strong>Varroa:</strong> Não detectada</p>
            <div className="bg-gray-500 h-0.5 my-2 w-2/3 mx-auto rounded-2xl"></div>
            <p><strong>Resumo:</strong> Temperatura e umidade dentro dos padrões ideais.</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="w-full h-13 bg-green-100 rounded-b-xl font-bold flex items-center justify-center text-sm sm:text-base">
        ✅ Análise bem-sucedida
      </div>
    </div>
  )
}
