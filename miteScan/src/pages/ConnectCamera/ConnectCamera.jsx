// src/pages/ConnectCamera/ConnectCamera.jsx
import CameraCard from '../../components/connectCamera/connect-camera'
import ButtonBack from '../../components/buttonBack'

function ConnectCamera() {

  return (
    <div className="container-all">
      <div className='w-2/5 max-w-4xl min-w-xl'>
        <ButtonBack title="conectar câmera" redirect='/create-hive' />
        <CameraCard />
      </div>
    </div>
  )
}

export default ConnectCamera
