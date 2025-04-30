import Image from '../../assets/images/colmeia2.jpg'
import Seguro from '../../assets/images/secure-icon.png'
import Perigo from '../../assets/images/AlertIcon.png'
import Bee from '../../assets/images/miniBee.png'
import { FaMapMarkerAlt, FaTrash, FaThermometerHalf, FaArrowLeft } from 'react-icons/fa';
import { MdAdd, MdEdit, MdHexagon, MdOutlineWaterDrop } from "react-icons/md";
import { TbWorldLatitude } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mr-10">
        <div className='flex items-center gap-4 text-2xl font-bold'>
          <button className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
            onClick={() => navigate('/home')}>
            <FaArrowLeft size={25} />
          </button>

          MINHAS COLMEIAS
        </div>
        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold p-3"
          onClick={() => navigate('/create-hive')}>
          <p className='ml-2'>ADICIONAR</p>
          <MdAdd size={25} />
        </button>
      </div>

      {/* Lista de colmeias */}
      <div className='max-h-[calc(100vh-340px)] overflow-y-auto pr-2'>
        <div className="grid gap-6">
          {colmeias.map((colmeia) => (
            <div className='flex items-center w-full'>
              <div key={colmeia.id} className="flex h-full w-full shadow-lg rounded-xl">

                {/* Card da Colmeia */}
                <div className="flex items-center h-full justify-between w-full flex gap-4 shadow-md rounded-xl bg-gray-100 overflow-hidden">
                  {/* Imagem */}
                  <img
                    src={Image}
                    alt={`Imagem da Colmeia ${colmeia.nome}`}
                    className="w-32 h-full object-cover"
                  />

                  {/* Informações */}
                  <div className="flex flex-col gap-3 py-6 text-start font-bold text-sm w-full">
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
                  </div>
                  <div className='h-25 w-0.5 bg-gray-600 mx-3 rounded-xl'></div>

                  <div className="pr-6">
                    <div className="flex gap-1 mb-5">
                      <FaThermometerHalf size={22} color={colmeia.temperatura > 28 ? "red" : "green"} />
                      {colmeia.temperatura}°C
                    </div>
                    <div className="flex gap-1">
                      <MdOutlineWaterDrop size={22} color={colmeia.umidade < 30 ? "red" : "green"} />
                      {colmeia.umidade}%

                    </div>
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
              </div>{/* Botões de ação*/}
              <div className="flex flex-col gap-6 ml-3 items-center">
                <button onClick={() => navigate('/edit-hive')}>
                  <MdEdit size={25} />
                </button>
                <button onClick={() => navigate('/delete-hive')}>
                  <FaTrash size={20} />
                </button>
              </div>



            </div>
          ))}
        </div></div>
    </div>
  )
}

