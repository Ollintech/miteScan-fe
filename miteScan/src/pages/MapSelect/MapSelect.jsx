import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapSelect.css'

function MapSelect() {
  const navigate = useNavigate()
  const location = useLocation()

  // Pegando os dados do formulário da tela anterior (CreateHive)
  const formData = location.state?.fromForm || {}

  // Estado para armazenar as coordenadas do ponto clicado
  const [mapData, setMapData] = useState({ lat: null, lng: null })

  useEffect(() => {
    if (mapData.lat && mapData.lng) {
      // Atualiza o marcador no mapa
      setMapData({ ...mapData })
    }
  }, [mapData]) // Dependência de mapData

  // Função para lidar com o clique no mapa
  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng
    setMapData({ lat, lng }) // Armazenando as coordenadas
  }

  // Função para retornar as coordenadas ao formulário de cadastro
  const handleBackToForm = () => {
    navigate('/create-hive', { state: { ...formData, location: mapData } })
  }

  return (
    <div className="map-select-container">
      <h2>Escolha a localização da sua colmeia</h2>

      {/* MapContainer com OSM */}
      <MapContainer
        center={{ lat: -23.5505, lng: -46.6333 }} // Coordenadas de exemplo (São Paulo)
        zoom={12}
        style={{ width: '60%', height: '500px' }}
        onClick={handleMapClick}
      >
        {/* TileLayer com URL do OSM */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Adiciona marcador no mapa quando as coordenadas forem selecionadas */}
        {mapData.lat && mapData.lng && (
          <Marker position={mapData}>
            <Popup>Localização selecionada</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Exibe coordenadas ou mensagem */}
      <div className="map-info">
        {mapData.lat && mapData.lng ? (
          <div>
            <p>Latitude: {mapData.lat}</p>
            <p>Longitude: {mapData.lng}</p>
          </div>
        ) : (
          <p>Selecione um ponto no mapa</p>
        )}
      </div>

      {/* Botão para retornar ao formulário com as coordenadas */}
      <button onClick={handleBackToForm}>Voltar ao formulário</button>
    </div>
  )
}

export default MapSelect
