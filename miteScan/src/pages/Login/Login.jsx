// src/pages/Login.jsx
import { CSSTransition } from 'react-transition-group';  // Importando para animações
import LoginForm from '../../components/AuthForms/LoginForm';

function Login() {

  return (
    <CSSTransition in={true} timeout={500} classNames="fade" unmountOnExit>
      <div className="bg-auth">
        <div className="max-w-3xl min-w-lg">
          <LoginForm/>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Login;
