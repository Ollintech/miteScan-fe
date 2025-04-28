// src/pages/Home.jsx

import '../Home/Home.css'
import HomeHives from '../../components/home/home-hives'
import InfoHome from '../../components/home/dashboard-home'

function Home() {


  return (
    <div className="container-all max-w-100%">
      <div className='w-full max-w-4xl p-20 mt-15'>
        <InfoHome />
        <HomeHives />
      </div>
    </div>
  )
}

export default Home
