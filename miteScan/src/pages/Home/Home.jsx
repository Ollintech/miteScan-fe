// src/pages/Home.jsx

import HomeHives from '../../components/home/home-hives'
import InfoHome from '../../components/home/dashboard-home'

function Home() {
  return (
    <div className="container-all flex flex-col items-center w-full min-h-screen">
      {/* 
        - w-full: pega toda a largura da área livre
        - max-w-4xl (ou 5xl): limita o tamanho dos cards
        - mx-auto: força a margem automática nas duas laterais (centralização clássica)
      */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 my-auto flex flex-col items-center">
        <InfoHome />
        <HomeHives />
      </div>
    </div>
  )
}

export default Home