// src/pages/Analysis.jsx
//import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Analysis/Analysis.css'
import { FaArrowLeft } from 'react-icons/fa'
import AnalysisCard from '../../components/analysis/analysis'

function Analysis() {
  //const [selectedHive, setSelectedHive] = useState('colmeia1')
  const navigate = useNavigate()

  return (
    <div className="container-all">
      <div className='w-2/3 max-w-2xl'>
        <div className="flex items-center justify-between mb-2">
          <div className='flex items-center gap-4 text-2xl font-bold'>
            <button className="bg-yellow-400 hover:bg-yellow-300 rounded-lg shadow-md py-3 px-4"
              onClick={() => navigate('/hives')}>
              <FaArrowLeft size={25} />
            </button>
            ANALISAR AGORA
          </div>
        </div>
        <AnalysisCard />
      </div>
      {/*
      <div className="analysis-controls">
        <label htmlFor="hive-select">Selecione a colmeia:</label>
        <select
          id="hive-select"
          value={selectedHive}
          onChange={(e) => setSelectedHive(e.target.value)}
        >
          <option value="colmeia1">Colmeia 1</option>
          <option value="colmeia2">Colmeia 2</option>
        </select>
      </div>

      <div className="analysis-image-card">
        <img src={hiveImages[selectedHive]} alt={selectedHive} className="hive-image" />
        <button className="analyze-button">🔍 Analisar</button>
      </div>*/}
    </div>
  )
}

export default Analysis
