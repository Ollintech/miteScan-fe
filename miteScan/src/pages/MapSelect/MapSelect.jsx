import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './MapSelect.css'

function MapSelect() {
  const navigate = useNavigate()
  const location = useLocation()

  // Pegando os dados do formulário da tela anterior (CreateHive)
  const formData = location.state?.fromForm || {}

  const [mapData, setMapData] = useState({ lat: null, lng: null })

  // Função para inicializar o mapa (é chamada pelo callback do script Google Maps)
  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -23.5505, lng: -46.6333 }, // Exemplo de coordenadas (São Paulo)
      zoom: 12,
    })

    // Evento de clique no mapa para capturar as coordenadas
    map.addListener('click', (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      setMapData({ lat, lng })
    })
  }

  // Função para lidar com o retorno à tela anterior
  const handleBackToForm = () => {
    navigate('/create-hive', { state: { ...formData, location: mapData } })
  }

  return (
    <div className="map-select-container">
      <h2>Escolha a localização da sua colmeia</h2>
      <div id="map" style={{ width: '60%', height: '500px' }}></div>

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
