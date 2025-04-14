// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import '../Home/Home.css' 

function Home() {
  const navigate = useNavigate()

  return (
    <div className="wrapper-home">
    <div className="home-container">
      <h2>SUAS COLMEIAS <b>EM TEMPO REAL!</b> 🐝</h2>

      <div className="dashboard">
        {/* Card 1 */}
        <div className="card" onClick={() => navigate('/hives')}> 
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 1</h3>
          <p>Dados sobre a colmeia</p>
        </div>

        {/* Card 2 */}
        <div className="card"><img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 2</h3>
          <p>Mais dados sobre outra colmeia</p>
        </div>

        {/* Card 3 */}
        <div className="card">
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 3</h3>
          <p>Mais algumas informações aqui</p>
        </div>
      </div>
    </div>
    </div>
    
  )
}

export default Home
