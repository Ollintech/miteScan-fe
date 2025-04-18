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
          <div className="title-kpi">
            <img src="../src/assets/images/icon-hive-home.png" className="icon-kpi" />
            <h3>Colmeias</h3>
          </div>
          <h2 style={{marginTop: '0px'}}>3</h2>
        </div>
        <div className="card-kpi">
        <div className="title-kpi">
            <img src="../src/assets/images/icon-hive-home.png" className="icon-kpi" />
            <h3> Taxa de Varroa</h3>
        </div>
        <h2 style={{marginTop: '0px'}}>0%</h2>
        </div>
        <div className="card-kpi">
        <div className="title-kpi">
            <img src="../src/assets/images/icon-hive-home.png" className="icon-kpi" />
            <h3>Colmeias + Varroa</h3>
        </div>
        <h2 style={{marginTop: '0px'}}>0</h2>
        </div>
      </div>

      <div className="dashboard">
      <div className="top"><p style={{fontSize: '23px', marginRight: '50%'}}>SUAS COLMEIAS <b>EM TEMPO REAL!</b> 🐝</p></div>
      <div className="card-box">
        {/* Card 1 */}
        <div className="card" onClick={() => navigate('/hives')}> 
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
        <div className="content-card">
          <div className="info">
            <h3>Colmeia 1</h3>
            <p>23 | 45 %</p>
          </div>
          <div className="icon-secure">
            <img src="../src/assets/images/secure-icon.png" style={{width: '40px'}}/>
          </div>
        </div>
        </div>

        {/* Card 2 */}
        <div className="card"><img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
        <div className="content-card">
          <div className="info">
            <h3>Colmeia 2</h3>
            <p>23 | 45 %</p>
          </div>
          <div className="icon-secure">
            <img src="../src/assets/images/secure-icon.png" style={{width: '40px'}}/>
          </div>
        </div>
        </div>

        {/* Card 3 */}
        <div className="card">
        <img src="../src/assets/images/colmeia-home.png" alt="Colmeia 1" className="card-image" />
        <div className="content-card">
          <div className="info">
            <h3>Colmeia 3</h3>
            <p>23 | 45 %</p>
          </div>
          <div className="icon-secure">
            <img src="../src/assets/images/secure-icon.png" style={{width: '40px'}}/>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
    </div>
    
  )
}

export default Home
