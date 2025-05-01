import { useParams } from 'react-router-dom'
import FormHive from './form-hive'

export default function EditHiveCard() {
  const { id } = useParams()

  // Simulação de busca da colmeia (substitua com seu fetch real)
  const colmeia = {
    id,
    name: 'Colmeia A',
    size: 'Medium',
    beeType: 'Bee 1',
    location: { lat: -24.7, lng: -48.0 }
  }

  const handleEditar = (dadosAtualizados) => {
    console.log(`🛠 Atualizar colmeia ${id}:`, dadosAtualizados)
    // Atualize no banco de dados
  }

  return (
    <FormHive
      modo="editar"
      colmeia={colmeia}
      onConfirmar={handleEditar}
    />
  )
}
