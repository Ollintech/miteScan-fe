import React from 'react';
import resultImage from '../../assets/images/colmeia1.png';
import { FaThermometerHalf } from 'react-icons/fa';
import { MdOutlineWaterDrop } from "react-icons/md";
import { TbAlertTriangleFilled, TbAlertOctagonFilled } from "react-icons/tb";
import { MdVerifiedUser } from "react-icons/md";

export default function Result() {
  const analysis = {
    data: '28/09/2024',
    temperatura: 24,
    umidade: 40,
    varroaDetectada: false,
  };

  const isTempOk = analysis.temperatura >= 20 && analysis.temperatura <= 35;
  const isHumidityOk = analysis.umidade >= 40 && analysis.umidade <= 80;

  let status = 'segura';
  if (analysis.varroaDetectada) {
    status = 'perigo';
  } else if (!isTempOk || !isHumidityOk) {
    status = 'alerta';
  }

  const statusConfig = {
    segura: {
      color: 'text-green-600',
      icon: <MdVerifiedUser size={20} />,
      message: 'COLMEIA SEGURA, NENHUMA VARROA IDENTIFICADA.',
    },
    alerta: {
      color: 'text-yellow-500',
      icon: <TbAlertTriangleFilled size={20} />,
      message: 'COLMEIA EM ALERTA, CONDIÇÕES AMBIENTAIS FORA DO IDEAL.',
    },
    perigo: {
      color: 'text-red-600',
      icon: <TbAlertOctagonFilled size={20} />,
      message: 'PERIGO! VARROA DETECTADA NA COLMEIA.',
    },
  };

  const { color, icon, message } = statusConfig[status];

  return (
    <>
      <div className={`flex items-center font-semibold text-sm mb-2 gap-2 ${color}`}>
        {icon}
        <span>{message}</span>
      </div>

      <div className="bg-gray-100 rounded-xl shadow-lg w-full mx-auto">
        <img
          src={resultImage}
          alt="Resultado da análise"
          className="w-full h-80 object-cover rounded-md"
        />

        <div className="flex justify-between text-sm text-gray-700 py-5 px-5">
          <div className='w-1/3'>
            <span className="font-semibold">DATA:</span> {analysis.data}
          </div>
          <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex items-center gap-1 w-1/3 justify-center">
            <FaThermometerHalf size={20} />
            <span>{analysis.temperatura} °C</span>
          </div>
          <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
          <div className="flex items-center gap-1 w-1/3 justify-center">
            <MdOutlineWaterDrop size={20} />
            <span>{analysis.umidade}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
