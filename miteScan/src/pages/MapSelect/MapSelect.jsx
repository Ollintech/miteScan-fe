// src/pages/MapSelect/MapSelect.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './MapSelect.css'

// Corrige o ícone do marcador no Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

function MapClickHandler({ setMapData }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setMapData({ lat, lng })
    },
  })
  return null
}

function MapSelect() {
  const navigate = useNavigate()
  const location = useLocation()

  const formData = location.state?.fromForm || {}
  const [mapData, setMapData] = useState({ lat: null, lng: null })

  const handleBackToForm = () => {
    navigate('/create-hive', { state: { ...formData, location: mapData } })
  }

  return (
    <div className="container-all">
      <h2>Escolha a localização da sua colmeia</h2>
      <MapContainer center={[-23.5505, -46.6333]} zoom={12} style={{ width: '60%', height: '500px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setMapData={setMapData} />
        {mapData.lat && mapData.lng && <Marker position={[mapData.lat, mapData.lng]} />}
      </MapContainer>

      <div className="map-info">
        {mapData.lat && mapData.lng ? (
          <div>
            <p>Lat: {mapData.lat}</p>
            <p>Lng: {mapData.lng}</p>
          </div>
        ) : (
          <p>Selecione um ponto no mapa</p>
        )}
      </div>

      <button onClick={handleBackToForm}>Voltar ao formulário</button>
    </div>
  )
}

export default MapSelect
