// src/pages/MapSelect/MapSelect.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './MapSelect.css'

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

function MapSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [marker, setMarker] = useState(null)

  const handleSelect = (latlng) => {
    setMarker(latlng)
    setTimeout(() => {
      navigate('/create-hive', {
        state: { ...location.state, location: latlng },
      })
    }, 1000)
  }

  return (
    <div className="map-select-container">
      <h2>Select Hive Location</h2>
      <MapContainer center={[-15.78, -47.93]} zoom={4} scrollWheelZoom={true} style={{ height: '400px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={handleSelect} />
        {marker && <Marker position={marker} />}
      </MapContainer>
    </div>
  )
}

export default MapSelect
