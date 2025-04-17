// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import '../Home/Home.css' 

function Home() {
  const navigate = useNavigate()

  return (
    <div className="wrapper-home">
    <div className="home-container">
      <div className="kpi">
        <div className="card-kpi">
          <h3>🐝 Colmeias</h3>
          <p>3</p>
        </div>
        <div className="card-kpi">
          <h3>🐝 Taxa de Varroa</h3>
          <p>0%</p>
        </div>
        <div className="card-kpi">
          <h3>🐝 Colmeias C/ Varroa</h3>
          <p>0</p>
        </div>
      </div>

      <div className="dashboard">
      <div className="top"><h2>SUAS COLMEIAS <b>EM TEMPO REAL!</b> 🐝</h2></div>
      <div className="card-box">
        {/* Card 1 */}
        <div className="card" onClick={() => navigate('/hives')}> 
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 1</h3>
          <p>Colmeia 1</p>
          <p>23 | 45 %</p>
        </div>

        {/* Card 2 */}
        <div className="card"><img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 2</h3>
          <p>Colmeia 1</p>
          <p>23 | 45 %</p>
        </div>

        {/* Card 3 */}
        <div className="card">
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
          <h3>Colmeia 3</h3>
          <p>Colmeia 1</p>
          <p>23 | 45 %</p>
        </div>
      </div>
      </div>
    </div>
    </div>
    
  )
}

export default Home
