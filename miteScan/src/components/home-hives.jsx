import HivesImg from "../assets/images/colmeia1.png"
import secureIcon from "../assets/images/secure-icon.png"
import alertIcon from "../assets/images/AlertIcon.png"
import favIcon from "../assets/images/favIcon-home.png"
import tempIcon from "../assets/images/temIcon-home.png"
import waterIcon from "../assets/images/waterIcon-home.png"
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
      <div className="bg-yellow-400 text-gray-800 text-lg font-bold py-3 px-4 rounded-t-xl shadow-md w-5xl">
        SUAS COLMEIAS <span className="font-extrabold">EM TEMPO REAL! 🐝</span>
      </div>

      {/* Grid das colmeias */}
      <div className="bg-gray-100 p-10 rounded-b-xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 align-center w-5xl">
        {colmeias.map((colmeia) => (
          <div
            key={colmeia.id}
            className="flex flex-col items-start bg-gray-200 p-4 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => navigate('/hives')}
          >
            {/* Imagem da colmeia */}
            <img
              src={colmeia.imagem}
              alt={colmeia.nome}
              className="h-32 w-full object-cover rounded mb-4"
            />

            {/* Nome e status */}
            <div className="flex items-center gap-2 mb-2 w--full">
              <img src={favIcon} alt="" />
              <h3 className="text-gray-800 font-semibold">{colmeia.nome}</h3>

              {/* Ícone de status */}
              {colmeia.status === 'ok' && (
                <img src={secureIcon} alt="OK" className="ml-22" />
              )}
              {colmeia.status === 'alerta' && (
                <img src={alertIcon} alt="Perigo" className="ml-23" />
              )}
            </div>

            {/* Temperatura e Umidade */}
            <div className="text-md font-bold text-gray-700 flex items-center">
              <img src={tempIcon} />{colmeia.temperatura}°C | <img src={waterIcon} />{colmeia.umidade}%
            </div>
          </div>
        ))}
      </div>
    </>
  )
}