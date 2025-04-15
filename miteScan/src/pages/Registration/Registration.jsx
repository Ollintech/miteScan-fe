// src/pages/Registration.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Registration/Registration.css'
import logo from '../../assets/images/bee-icon.png'

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

          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              placeholder=""
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login">Login:</label>
            <input
              type="text"
              id="login"
              placeholder=""
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              placeholder=""
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tipo">Acesso:</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#EEEDED',
                color: 'black',
                fontSize: '1rem',
                width: '100%'
              }}
            >
              <option value="adm">Administrador</option>
              <option value="funcionario">Funcionário</option>
            </select>
          </div>
          

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" className="btn-cadastrar">CADASTRAR</button>
        </form>

        <div className="cadastro">
          <p>Possui uma conta? <a href="/login">Voltar ao login</a></p>
        </div>
      </div>
    </div>
  )
}

export default Registration
