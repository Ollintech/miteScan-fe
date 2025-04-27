// src/pages/Home.jsx

import '../Home/Home.css' 
import HomeHives from '../../components/home-hives'
import InfoHome from '../../components/dashboard-home'

function Home() {
 

  return (
    <div className="wrapper-home">
    <div className="container-all">
      <InfoHome/>
      <HomeHives/>
    </div>
    </div>
  )
}

export default Home
