// src/pages/Colmeias.jsx
import { useNavigate } from 'react-router-dom'
import '../Hives/Hives.css'
import colmeia1Img from '../../assets/images/colmeia1.png';

function Hives() {
  const navigate = useNavigate()

  const colmeias = [
    {
      id: 1,
      nome: 'Colmeia Rainha',
      abelha: 'Abelha Africana',
      temperatura: '34°C',
      umidade: '60%',
      imagemUrl: colmeia1Img,
    },
    {
      id: 2,
      nome: 'Colmeia Operária',
      abelha: 'Abelha Europeia',
      temperatura: '33°C',
      umidade: '65%',
      imagemUrl: colmeia1Img,
    }
  ]

  return (
    <div className="colmeias-container">
  <div className="colmeias-header">
    <h2>Minhas Colmeias 🐝</h2>
    <button className="btn-criar" onClick={() => navigate('/create-hive')}>
      + Criar Colmeia
    </button>
  </div>

  <div className="colmeia-grid">
    {colmeias.map((colmeia) => (
      <div key={colmeia.id} className="colmeia-card">
        {/* Imagem ao lado das informações */}
        <img
          src={colmeia.imagemUrl} // Imagem de cada colmeia, se houver
          alt={`Imagem da Colmeia ${colmeia.nome}`}
          className="colmeia-image"
        />
        <div className="colmeia-info">
          <h3>{colmeia.nome}</h3>
          <p><strong>Abelha:</strong> {colmeia.abelha}</p>
          <p><strong>Temperatura:</strong> {colmeia.temperatura}</p>
          <p><strong>Umidade:</strong> {colmeia.umidade}</p>
        </div>
      </div>
    ))}
  </div>
</div>
  )
}

export default Hives
