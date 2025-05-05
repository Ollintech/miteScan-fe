import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormHive from './form-hive'

export default function DeleteHiveCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [colmeia, setColmeia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchColmeia = async () => {
      try {
        const res = await fetch(`url-back`)
        if (!res.ok) throw new Error('Erro ao buscar colmeia')
        const data = await res.json()
        setColmeia(data)
      } catch (err) {
        console.error('❌ Erro ao buscar colmeia:', err)
        alert('Erro ao carregar colmeia.')
      } finally {
        setLoading(false)
      }
    }

    fetchColmeia()
  }, [id])

  const handleExcluir = async () => {
    try {
      const response = await fetch(`/api/hives/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao excluir colmeia')

      console.log(`Colmeia ${id} excluída com sucesso`)
      alert('Colmeia excluída com sucesso.')
      navigate('/hives')
    } catch (error) {
      console.error('❌ Erro ao excluir colmeia:', error)
      alert('Erro ao excluir colmeia.')
    }
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!colmeia) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      modo="excluir"
      colmeia={colmeia}
      onExcluir={handleExcluir}
    />
  )
}
