import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormHive from './form-hive'
import axios from 'axios'

export default function EditHiveCard() {
  const { id } = useParams()
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
        console.error('Erro ao buscar colmeia:', err)
        alert('Erro ao carregar colmeia.')
      } finally {
        setLoading(false)
      }
    }

    fetchColmeia()
  }, [id])

  const handleEditar = async (dadosAtualizados) => {
    try {
      const response = await axios.put(`http://host.docker.internal:8000/hives/create/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2FvQHRlc3RlLmNvbSIsInVzZXJfaWQiOjUsImFjY2Vzc19pZCI6MSwiZXhwIjoxNzQ3MDkxNjQxfQ.LZKAyoHTjB-MkndaGvMxJUBtaqfDlIwvvJPV0dWCXWY`
        },
        body: JSON.stringify(dadosAtualizados),
      })

      if (!response.ok) throw new Error('Erro ao atualizar colmeia')

      const colmeiaAtualizada = await response.json()
      console.log('Colmeia atualizada com sucesso:', colmeiaAtualizada)
    } catch (error) {
      console.error('Erro ao atualizar colmeia:', error)
      alert('Erro ao atualizar colmeia.')
    }
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (!colmeia) return <p className="text-center text-red-500">Colmeia não encontrada.</p>

  return (
    <FormHive
      modo="editar"
      colmeia={colmeia}
      onConfirmar={handleEditar}
    />
  )
}
