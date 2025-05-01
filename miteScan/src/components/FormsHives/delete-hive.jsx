import { useParams } from 'react-router-dom'
import FormHive from './form-hive'

export default function DeleteHiveCard() {
  const { id } = useParams()

  // Simulação de dados da colmeia
  const colmeia = {
    id,
    name: 'Colmeia A',
    size: 'Large',
    beeType: 'Bee 3',
    location: { lat: -24.709, lng: -48.001 }
  }

  const handleExcluir = (colmeia) => {
    console.log(`🗑 Excluir colmeia ${id}:`, colmeia)
    // Aqui você realiza a exclusão no banco
  }

  return (
    <FormHive
      modo="excluir"
      colmeia={colmeia}
      onExcluir={handleExcluir}
    />
  )
}
