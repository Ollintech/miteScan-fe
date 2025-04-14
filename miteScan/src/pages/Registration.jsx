// src/pages/Registration.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Registration.css'
import logo from '../assets/bee-icon.png'

function Registration() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipo] = useState('funcionario')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()

    if (!nome || !email || !login || !senha || !tipo) {
      setErro('Preencha todos os campos.')
      return
    }

    console.log('Usuário registrado:', { nome, email, login, senha, tipo })
    setErro('')
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="registration-container">
        <div className="logo">
          <img src={logo} alt="Logo Abelha" />
        </div>
        <h2>Cadastre-se</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login">Login:</label>
          <input
            type="text"
            id="login"
            placeholder="Escolha um nome"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <label htmlFor="tipo">Tipo de acesso:</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#f2f2f2',
              fontSize: '1rem'
            }}
          >
            <option value="adm">Administrador</option>
            <option value="funcionario">Funcionário</option>
          </select>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit">CADASTRAR</button>
        </form>

        <div className="cadastro">
          <p>Possui uma conta? <a href="/login">Voltar ao login</a></p>
        </div>
      </div>
    </div>
  )
}

export default Registration
