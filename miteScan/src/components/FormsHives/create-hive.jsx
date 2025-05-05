import FormHive from './form-hive'

export default function CreateHiveCard() {
  const handleCriar = async (dados) => {
    console.log('Criar colmeia com dados:', dados)

    try {
      const response = await fetch('/api/hives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      if (!response.ok) throw new Error('Erro ao criar colmeia')

      const novaColmeia = await response.json()
      console.log('Colmeia criada com sucesso:', novaColmeia)
    } catch (error) {
      console.error('Erro ao criar colmeia:', error)
      alert('Erro ao cadastrar colmeia. Verifique os dados ou tente novamente.')
    }
  }

  return (
    <FormHive
      modo="criar"
      onConfirmar={handleCriar}
    />
  )
}
