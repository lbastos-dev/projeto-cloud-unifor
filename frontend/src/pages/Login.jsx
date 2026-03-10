// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Importa a configuração do Firebase

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Tenta logar o usuário no Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Se der certo, manda para a tela do cardápio
      navigate('/menu');
    } catch (err) {
      console.error(err);
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div className="form-container">
      <h2>Acesso ao Sistema</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  );
}

export default Login;