// src/pages/Analysis.jsx
import { useState } from 'react'
import '../Analysis/Analysis.css'
import colmeia1 from '../../assets/images/colmeia1.png'
import colmeia2 from '../../assets/images/colmeia2.jpg'

function Analysis() {
  const [selectedHive, setSelectedHive] = useState('colmeia1')

  const hiveImages = {
    colmeia1: colmeia1,
    colmeia2: colmeia2
  }

  return (
    <div className="analysis-wrapper">
      <h2 className="analysis-title">Analisar agora</h2>

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
      </div>
    </div>
  )
}

export default Analysis
