import Image from '../../assets/images/colmeia2.jpg'
import Seguro from '../../assets/images/secure-icon.png'
import Perigo from '../../assets/images/AlertIcon.png'
import Bee from '../../assets/images/miniBee.png'
import { FaMapMarkerAlt, FaTrash, FaThermometerHalf, FaArrowLeft } from 'react-icons/fa';
import { MdAdd, MdEdit, MdHexagon, MdOutlineWaterDrop } from "react-icons/md";
import { TbWorldLatitude } from "react-icons/tb";




const colmeias = [
  {
    id: 1,
    nome: "COLMEIA 1",
    abelha: "Bombus Temarius",
    localizacao: "Jacupiranga",
    coordenadas: "-24.708450, -48.002531",
    temperatura: 23,
    umidade: 42,
    estado: "segura",
  },
  {
    id: 2,
    nome: "COLMEIA 2",
    abelha: "Bombus Affinis",
    localizacao: "Jacupiranga",
    coordenadas: "-24.708450, -48.002531",
    temperatura: 30,
    umidade: 20,
    estado: "perigo",
  },
];

export default function HivesList() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className='flex items-center gap-4 text-2xl font-bold'>
          <button className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md mb-4">
            <FaArrowLeft size={25} />
          </button>

          MINHAS COLMEIAS
        </div>
        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl mb-4">
          Adicionar
          <MdAdd size={25} />
        </button>
      </div>

      {/* Lista de colmeias */}
      <div className="grid gap-6">
        {colmeias.map((colmeia) => (
          <div key={colmeia.id} className="flex items-center gap-4 shadow-lg">

            {/* Card da Colmeia */}
            <div className="flex items-center h-full flex-1 gap-3 shadow-md rounded-xl bg-gray-100 overflow-hidden">
              {/* Imagem */}
              <img
                src={Image}
                alt={`Imagem da Colmeia ${colmeia.nome}`}
                className="w-32 h-full object-cover"
              />

              {/* Informações */}
              <div className="flex-1 flex flex-col gap-1 py-5 text-start font-bold text-sm p-2">
                <div className="flex items-center gap-2">
                  <MdHexagon size={19} />
                  {colmeia.nome}
                </div>
                <div className="flex items-center gap-2">
                  <img src={Bee} className='w-4' />
                  {colmeia.abelha}
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt size={18} />
                  {colmeia.localizacao}
                </div>
                <div className="flex items-center gap-2">
                  <TbWorldLatitude size={18} />
                  {colmeia.coordenadas}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <FaThermometerHalf color={colmeia.temperatura > 28 ? "red" : "green"} />
                    {colmeia.temperatura}°C
                  </div>
                  <div className="flex items-center gap-1">
                    <MdOutlineWaterDrop color={colmeia.umidade < 30 ? "red" : "green"} />
                    {colmeia.umidade}%
                  </div>
                </div>
              </div>

              {/* Botões de ação*/}
              <div className="flex flex-col gap-2 items-center">
                <button >
                  <MdEdit size={25} />
                </button>
                <button>
                  <FaTrash size={20} />
                </button>
              </div>

              {/* Estado */}
              <div className={`flex flex-col items-center justify-center p-3 w-28 h-full
                  ${colmeia.estado === "segura" ? "bg-green-200" : "bg-red-200"}
              `}>
                <img
                  src={colmeia.estado === "segura" ? Seguro : Perigo}
                  alt="Ícone estado"
                  className="w-8 mb-1"
                />
                <span className="font-bold">
                  {colmeia.estado.toUpperCase()}
                </span>
              </div>
            </div>



          </div>
        ))}
      </div>
    </div>
  )
}

