// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css' // se quiser estilizar separado
import logo from '../assets/bee-icon.png'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // Validação simples
    if (email === '' || senha === '') {
      setErro('Preencha todos os campos.')
      return
    }

    // Simulação de login
    if (email === 'abelha@teste.com' && senha === '123456') {
      setErro('')
      navigate('/home') // redireciona
    } else {
      setErro('Credenciais inválidas.')
    }
  }

  return (
    <div className="wrapper">
        <div className="login-container">
          <div className="logo">
                  <img src={logo} alt="Logo Abelha" />
                </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
        <button type="button" className="btn-cadastro" onClick={() => navigate('/registration')}>REGISTER</button>

      </form>
    </div>
    </div>
    
  )
}

export default Login
