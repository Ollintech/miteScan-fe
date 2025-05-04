// src/pages/ConnectCamera/ConnectCamera.jsx
import CameraCard from '../../components/connectCamera/connect-camera'
import ButtonBack from '../../components/buttonBack'

function ConnectCamera() {

  return (
    <div className="container-all">
      <div className='w-full max-w-4xl px-4 sm:px-8'>
        <ButtonBack title="conectar câmera" redirect='/create-hive' />
        <CameraCard />
      </div>
    </div>
  )
}

export default ConnectCamera
