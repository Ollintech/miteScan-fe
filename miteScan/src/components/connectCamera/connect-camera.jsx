import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function CameraCard() {
    const location = useLocation()
    const navigate = useNavigate() // Para redirecionar para a tela de "analysis"

    const handleBackToForm = () => {
        const origem = location.state?.origem
        const hiveId = location.state?.hiveId

        let rotaDestino = '/create-hive'
        if (origem === 'editar' && hiveId) {
            rotaDestino = `/edit-hive/${hiveId}`
        }

        navigate(rotaDestino, {
            state: {
                ...location.state,
                cameraConnected: true,
            }
        })
    }

    return (
        <>
            <h3 className='uppercase text-md mb-3'>Lique sua câmera e a conecte ao aplicativo para análise!</h3>

            <div className="bg-gray-100 rounded-xl shadow-xl w-sm mx-auto">
                <p className='p-3'><strong>Modelo:</strong> ESP32-CAM</p>
                <img
                    src="http://192.168.1.77:81/stream"
                    alt="Stream da ESP32"
                    width="400"
                    className="rounded-xl"
                />
            </div>


            {/* Botão "Finalizar" para redirecionar para a tela de "analysis" */}
            <button onClick={handleBackToForm}
                className='bg-yellow-400 py-2 px-8 rounded-xl shadow-md font-bold mt-4'
            >Finalizar</button>
        </>
    )
}