// src/pages/MapSelect/MapSelect.jsx
import MapCard from '../../components/MapSelect/map-card'
import ButtonBack from '../../components/buttonBack'

function MapSelect() {

  return (
    <div className="container-all">
      <div className='w-2/5 max-w-3xl min-w-lg'>
        <ButtonBack title="definir localização" redirect='/create-hive' />
        <MapCard />
      </div>
    </div>
  )
}

export default MapSelect
