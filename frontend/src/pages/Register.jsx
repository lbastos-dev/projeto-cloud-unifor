import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva o usuário no Firestore como cliente comum (role: 'user')
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'user',
        createdAt: new Date()
      });

      navigate('/menu'); // Manda pro cardápio após o sucesso
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Esse e-mail já está cadastrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao criar a conta.');
      }
    }
  };

  return (
    <div>
      <h2>Criar Nova Conta</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleRegister}>
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
            minLength="6"
          />
        </div>
        
        <button type="submit">Cadastrar</button>
      </form>

      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p>Já tem uma conta?</p>
        <button type="button" onClick={() => navigate('/')}>
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

export default Register;