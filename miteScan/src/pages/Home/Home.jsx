// src/pages/Home.jsx

import '../Home/Home.css'
import HomeHives from '../../components/home/home-hives'
import InfoHome from '../../components/home/dashboard-home'

function Home() {


  return (
    <div className="container-all">
      <div className='w-full max-w-3xl px-4 sm:px-8 mb-5'>
        <InfoHome />
        <HomeHives />
      </div>
    </div>
  )
}

export default Home
