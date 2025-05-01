// src/pages/Analysis.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Analysis/Analysis.css'
import AnalysisCard from '../../components/Analysis/analysis'
import ButtonBack from '../../components/buttonBack'

function Analysis() {
  //const [selectedHive, setSelectedHive] = useState('colmeia1')
  const navigate = useNavigate()

  return (
    <div className="container-all">
      <div className='w-2/5 max-w-4xl min-w-xl'>
          <ButtonBack title="analisar agora" redirect='/hives' />
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
