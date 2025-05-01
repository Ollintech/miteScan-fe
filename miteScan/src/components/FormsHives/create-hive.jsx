import FormHive from './form-hive'

export default function CreateHiveCard() {
  const handleCriar = (dados) => {
    console.log('📦 Criar colmeia com dados:', dados)
    // Aqui você pode enviar pro backend
  }

  return (
    <FormHive
      modo="criar"
      onConfirmar={handleCriar}
    />
  )
}
