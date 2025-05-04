// src/pages/MapSelect/MapSelect.jsx
import MapCard from '../../components/MapSelect/map-card'
import ButtonBack from '../../components/buttonBack'

function MapSelect() {

  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8'>
        <ButtonBack title="definir localização" redirect='/create-hive' />
        <MapCard />
      </div>
    </div>
  )
}

export default MapSelect
