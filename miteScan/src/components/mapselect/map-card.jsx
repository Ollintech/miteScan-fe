import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FaMapMarkerAlt } from 'react-icons/fa';
import { TbWorldLatitude } from "react-icons/tb";

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

export default function MapCard() {
  const navigate = useNavigate()
  const location = useLocation()

  const formData = location.state?.fromForm || {}
  const [mapData, setMapData] = useState({ lat: null, lng: null })

  const handleBackToForm = () => {
    navigate('/create-hive', { state: { ...formData, location: mapData } })
  }

  return (
    <>

      <div className="bg-gray-100 shadow-2xl rounded-xl w-2xl mx-auto">
        <div className="w-full h-80 rounded-lg overflow-hidden mb-0">
          <MapContainer
            center={[-23.5505, -46.6333]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler setMapData={setMapData} />
            {mapData.lat && mapData.lng && <Marker position={[mapData.lat, mapData.lng]} />}
          </MapContainer>
        </div>

        {mapData.lat && mapData.lng ? (
          <div className="flex items-center justify-between text-sm text-gray-800 border-t p-5">
            <div className="flex items-center gap-2">
              <span className=""><FaMapMarkerAlt size={25} /></span>
              <span>JACUPIRANGA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl"><TbWorldLatitude size={25} /></span>
              <span>{mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-md p-5">Selecione no mapa a localização da colmeia</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleBackToForm}
          className="bg-yellow-400 hover:bg-yellow-600 font-semibold py-2 px-6 rounded-xl shadow-lg transition"
        >
          AVANÇAR
        </button></div>
    </>
  )
}
