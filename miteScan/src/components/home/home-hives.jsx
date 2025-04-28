import HivesImg from "../../assets/images/colmeia1.png"
import secureIcon from "../../assets/images/secure-icon.png"
import alertIcon from "../../assets/images/AlertIcon.png"
import favIcon from "../../assets/images/favIcon-home.png"
import tempIcon from "../../assets/images/temIcon-home.png"
import waterIcon from "../../assets/images/waterIcon-home.png"
import { useNavigate } from "react-router-dom"

const colmeias = [
  {
    id: 1,
    nome: 'COLMEIA 1',
    temperatura: 23,
    umidade: 42,
    status: 'ok',
    imagem: HivesImg,
  },
  {
    id: 2,
    nome: 'COLMEIA 2',
    temperatura: 30,
    umidade: 20,
    status: 'alerta',
    imagem: HivesImg,
  },
  {
    id: 3,
    nome: 'COLMEIA 3',
    temperatura: 23,
    umidade: 42,
    status: 'ok',
    imagem: HivesImg,
  },

  {
    id: 4,
    nome: 'COLMEIA 4',
    temperatura: 40,
    umidade: 10,
    status: 'alerta',
    imagem: HivesImg,
  },
  {
    id: 5,
    nome: 'COLMEIA 5',
    temperatura: 23,
    umidade: 42,
    status: 'ok',
    imagem: HivesImg,
  },
];



export default function HomeHives() {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg-yellow-400 text-gray-800 text-lg font-bold py-1 rounded-t-xl shadow-md w-full mx-auto px-4">
        SUAS COLMEIAS <span className="font-extrabold">EM TEMPO REAL! 🐝</span>
      </div>

      {/* Grid das colmeias */}
      <div className="bg-gray-100 py-4 px-10 rounded-b-xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 align-center w-full mx-auto">
        {colmeias.map((colmeia) => (
          <div
            key={colmeia.id}
            className="text-sm flex flex-col items-start bg-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform max-w-50 min-w-37 mx-auto"
            onClick={() => navigate('/hives')}
          >
            {/* Imagem da colmeia */}
            <img
              src={colmeia.imagem}
              alt={colmeia.nome}
              className="h-25 w-full object-cover rounded-xl mb-2"
            />

            {/* Nome e status */}
            <div className="flex items-center justify-between mx-2 w-full">
              <div className="flex gap-1">
                <img src={favIcon} alt="" className="w-4 h-4" />
                <h3 className="text-gray-800 font-semibold">{colmeia.nome}</h3>
              </div>

              {/* Ícone de status */}
              {colmeia.status === 'ok' && (
                <img src={secureIcon} alt="OK" className="max-w-8 mr-2" />
              )}
              {colmeia.status === 'alerta' && (
                <img src={alertIcon} alt="Perigo" className="max-w-8 mr-2" />
              )}
            </div>

            {/* Temperatura e Umidade */}
            <div className="text-md font-bold text-gray-700 flex items-center mx-2 mb-3">
              <img src={tempIcon} />{colmeia.temperatura}°C | <img src={waterIcon} />{colmeia.umidade}%
            </div>
          </div>
        ))}
      </div>
    </>
  )
}