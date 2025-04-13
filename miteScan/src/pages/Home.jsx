// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import './Home.css' // Para estilos, se quiser

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <h2>Bem-vindo ao Dashboard das Abelhas 🐝</h2>
      
      {/* Botão para sair ou voltar */}
      <button onClick={() => navigate('/login')}>Sair</button>

      <div className="dashboard">
        {/* Card de exemplo 1 */}
        <div className="card">
          <h3>Colmeia 1</h3>
          <p>Dados sobre a colmeia</p>
        </div>

        {/* Card de exemplo 2 */}
        <div className="card">
          <h3>Colmeia 2</h3>
          <p>Mais dados sobre outra colmeia</p>
        </div>

        {/* Card de exemplo 3 */}
        <div className="card">
          <h3>Colmeia 3</h3>
          <p>Mais algumas informações aqui</p>
        </div>
      </div>
    </div>
  )
}

export default Home
