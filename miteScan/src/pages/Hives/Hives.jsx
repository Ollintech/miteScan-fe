// src/pages/Colmeias.jsx
import { useNavigate } from 'react-router-dom'
import '../Hives/Hives.css'

function Hives() {
  const navigate = useNavigate()

  const colmeias = [
    {
      id: 1,
      nome: 'Colmeia Rainha',
      abelha: 'Abelha Africana',
      temperatura: '34°C',
      umidade: '60%',
    },
    {
      id: 2,
      nome: 'Colmeia Operária',
      abelha: 'Abelha Europeia',
      temperatura: '33°C',
      umidade: '65%',

    }
  ]

  return (
    <div className="colmeias-container">
      <div className="colmeias-header">
        <h2>Minhas Colmeias 🐝</h2>
        <button className="btn-criar" onClick={() => navigate('/criar-colmeia')}>
          + Criar Colmeia
        </button>
      </div>
      <div className="colmeia-grid">
        {colmeias.map((colmeia) => (
          <div key={colmeia.id} className="colmeia-card">
            <h3>{colmeia.nome}</h3>
            <p><strong>Abelha:</strong> {colmeia.abelha}</p>
            <p><strong>Temperatura:</strong> {colmeia.temperatura}</p>
            <p><strong>Umidade:</strong> {colmeia.umidade}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hives
