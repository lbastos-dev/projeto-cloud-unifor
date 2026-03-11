import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Importando a autenticação e o banco de dados

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Firebase Auth verifica e-mail e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Vai no Firestore checar a "identidade" desse usuário
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // 3. A Encruzilhada: Redirecionamento Automático
      if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
        // Se for admin, vai direto para o Painel!
        navigate('/admin'); 
      } else {
        // Se for cliente comum (ou se não tiver documento), vai pro Cardápio!
        navigate('/menu'); 
      }

    } catch (err) {
      console.error(err);
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div>
      <h2>Acesso ao Sistema</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">E-mail: </label>
          <input 
            type="email" 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="password">Senha: </label>
          <input 
            type="password" 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;