// src/components/Result.jsx
import React from 'react';
import resultImage from '../../assets/images/colmeia1.png';
import { FaThermometerHalf } from 'react-icons/fa';
import { MdOutlineWaterDrop } from "react-icons/md";

export default function Result() {
    return (
        <>
            <div className="flex items-center text-green-600 font-semibold text-sm mb-2 gap-2">
                <span className="text-xl">✅</span>
                <span>COLMEIA SEGURA, NENHUMA VARROA IDENTIFICADA.</span>
            </div>
            <div className="bg-gray-100 rounded-xl shadow-lg w-full mx-auto">

                <img
                    src={resultImage}
                    alt="Resultado da análise"
                    className="w-full h-80 rounded-md"
                />

                <div className="flex justify-between text-sm text-gray-700 py-5 px-5 ">
                    <div className='w-1/3'>
                        <span className="font-semibold">DATA:</span> 28/09/2024
                    </div>
                    <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
                    <div className="flex items-center gap-1 w-1/3 justify-center">
                        <FaThermometerHalf size={20} />
                        <span>23 °C</span>
                    </div>
                    <div className='bg-gray-600 h-auto w-0.5 rounded-xl'></div>
                    <div className="flex items-center gap-1 w-1/3 justify-center">
                        <MdOutlineWaterDrop size={20} />
                        <span>42%</span>
                    </div>
                </div>
            </div>
        </>
    );
}
