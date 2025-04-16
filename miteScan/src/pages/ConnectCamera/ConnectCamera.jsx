// src/pages/ConnectCamera/ConnectCamera.jsx
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './ConnectCamera.css'

function ConnectCamera() {
  const location = useLocation()
  const navigate = useNavigate() // Para redirecionar para a tela de "analysis"
  const videoRef = useRef(null)
  const [cameraInfo, setCameraInfo] = useState(null)

  useEffect(() => {
    async function getCameraInfo() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === 'videoinput')

        if (videoDevices.length > 0) {
          setCameraInfo(videoDevices[0]) // pega a primeira câmera disponível

          const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[0].deviceId } })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        }
      } catch (err) {
        console.error('Erro ao acessar a câmera:', err)
      }
    }

    getCameraInfo()
  }, [])

  // Função para navegar para a tela de "analysis"
  const handleFinish = () => {
    navigate('/analysis') // Aqui você redireciona para a página de "analysis"
  }

  return (
    <div className="connect-camera-container">
      <h2>Conectar Câmera</h2>
      {cameraInfo ? (
        <div className="camera-card">
          <p><strong>Modelo:</strong> {cameraInfo.label || 'Câmera detectada'}</p>
          <video ref={videoRef} autoPlay playsInline width="400" />
        </div>
      ) : (
        <p>Nenhuma câmera conectada ou permissão negada.</p>
      )}

      {/* Botão "Finalizar" para redirecionar para a tela de "analysis" */}
      <button onClick={handleFinish}>Finalizar</button>
    </div>
  )
}

export default ConnectCamera
