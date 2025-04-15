// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';  // Importando para animações
import '../Login/Login.css'
import logo from '../../assets/images/bee-icon.png'

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
    <CSSTransition in={true} timeout={500} classNames="fade" unmountOnExit>
      <div className="wrapper">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Logo Abelha" />
          </div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                className="input-login"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input
                className="input-login"
                type="password"
                placeholder=""
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && <p className="erro">{erro}</p>}
            <button type="submit" className="btn-entrar">ENTRAR</button>
            <div className="cadastro">
              <p>Não possui uma conta? <a href="/registration">Cadastre-se!</a></p>
            </div>
          </form>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Login;
