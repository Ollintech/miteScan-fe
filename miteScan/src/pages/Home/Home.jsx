// src/pages/Home.jsx

import '../Home/Home.css'
import HomeHives from '../../components/home/home-hives'
import InfoHome from '../../components/home/dashboard-home'

function Home() {


  return (
    <div className="container-all">
      <div className='w-2/5 max-w-3xl min-w-lg'>
        <InfoHome />
        <HomeHives />
      </div>
    </div>
  )
}

export default Home
