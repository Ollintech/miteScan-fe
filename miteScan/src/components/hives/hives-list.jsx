import Image from '../../assets/images/colmeia2.jpg'
import Bee from '../../assets/images/miniBee.png'
import { FaMapMarkerAlt, FaTrash, FaThermometerHalf, FaArrowLeft } from 'react-icons/fa'
import { MdAdd, MdEdit, MdHexagon, MdOutlineWaterDrop, MdVerifiedUser } from "react-icons/md"
import { TbAlertTriangleFilled, TbAlertOctagonFilled } from "react-icons/tb";
import { TbWorldLatitude } from "react-icons/tb"
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios';

export default function HivesList() {
  const [hives, setHives] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchHives = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://host.docker.internal:8000/hives/all', {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvQHRlc3RlLmNvbSIsInVzZXJfaWQiOjUsImFjY2Vzc19pZCI6MSwiZXhwIjoxNzQ3MDkxNjQxfQ.LZKAyoHTjB-MkndaGvMxJUBtaqfDlIwvvJPV0dWCXWY`,
          },
        });
        setHives(response.data);
      } catch (error) {
        console.error("Erro ao buscar colmeias:", error);
      }
    };

    fetchHives();
  }, []);

  const [beeTypes, setBeeTypes] = useState([]);

  useEffect(() => {
    const fetchBeeTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://host.docker.internal:8000/bee_types/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBeeTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de abelha:", error);
      }
    };

    fetchBeeTypes();
  }, []);

  function getBeeTypeName(id) {
    const beeType = beeTypes.find(bt => bt.id === id);
    return beeType ? beeType.name : 'Tipo desconhecido';
  }


  function getEstado(analysis) {
    if (!analysis) return 'segura'
    if (analysis.has_varroa) return 'perigo'
    if (analysis.temperature > 28 || analysis.humidity < 30) return 'alerta'
    return 'segura'
  }

  function getIcon(estado) {
    if (estado === 'segura') return <MdVerifiedUser size={28} className='text-green-600' />
    if (estado === 'alerta') return <TbAlertTriangleFilled size={28} className='text-yellow-400' />
    return <TbAlertOctagonFilled size={25} className='text-red-600' />
  }

  function getBgColor(estado) {
    if (estado === 'segura') return 'bg-green-200'
    if (estado === 'alerta') return 'bg-yellow-200'
    return 'bg-red-200'
  }

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

      {/* Lista */}
      <div className='max-h-[calc(100vh-340px)] overflow-y-auto pr-2'>
        <div className="grid gap-6">
          {hives.map((hive) => {
            const analysis = hive.hive_analyses?.[0]
            const estado = getEstado(analysis)

            return (
              <div key={hive.id} className='flex items-center w-full'>
                <div className="flex h-full w-full shadow-lg rounded-xl">

                  <div className="flex items-center h-full justify-between w-full gap-4 shadow-md rounded-xl bg-gray-100 overflow-hidden">
                    {/* Imagem */}
                    <img src={Image} alt={`Colmeia ${hive.name}`} className="w-32 h-full object-cover" />

                    {/* Info */}
                    <div className="flex flex-col gap-3 py-6 text-start font-bold text-sm w-full">
                      <div className="flex items-center gap-2">
                        <MdHexagon size={19} />
                        COLMEIA {hive.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={Bee} className='w-4' />
                        {getBeeTypeName(hive.bee_type_id)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={18} />
                        {hive.size} cm
                      </div>
                      <div className="flex items-center gap-2">
                        <TbWorldLatitude size={18} />
                        {`${hive.location_lat}, ${hive.location_lng}`}
                      </div>
                    </div>

                    {/* Medidas */}
                    <div className='h-25 w-0.5 bg-gray-600 mx-3 rounded-xl'></div>
                    <div className="pr-6">
                      <div className="flex gap-1 mb-5">
                        <FaThermometerHalf size={22} color={analysis?.temperature > 28 ? "red" : "green"} />
                        {hive.temperature ?? "--"}°C
                      </div>
                      <div className="flex gap-1">
                        <MdOutlineWaterDrop size={22} color={analysis?.humidity < 40 ? "red" : "green"} />
                        {hive.humidity ?? "--"}%
                      </div>
                    </div>

                    {/* Estado */}
                    <div className={`flex flex-col items-center justify-center p-3 w-28 h-full ${getBgColor(estado)}`}>
                      {getIcon(estado)}
                      <span className="font-bold uppercase">{estado}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-6 ml-3 items-center">
                  <button onClick={() => navigate(`/edit-hive/${hive.id}`)}>
                    <MdEdit size={25} />
                  </button>
                  <button onClick={() => navigate(`/delete-hive/${hive.id}`)}>
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
