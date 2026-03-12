import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import api from '../services/api';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate(); // redirecionar após sair

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar o cardápio.');
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    setSuccessMessage('');
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const itemsIds = cart.map(item => item.id);
    const total = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

    try {
      await api.post('/orders', { items: itemsIds, total });
      setSuccessMessage('Pedido realizado com sucesso!');
      setCart([]);
    } catch (err) {
      console.error(err);
      setError('Erro ao realizar o pedido.');
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Volta para a tela de Login
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Cardápio</h2>
        <button onClick={handleLogout}>Sair</button> {/* NOVO: Botão de Sair */}
      </div>
      
      {error && <p style={{color: 'red'}}>{error}</p>}
      {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}

      <div>
        {menuItems.map(item => (
          <div key={item.id} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>R$ {Number(item.price || 0).toFixed(2)}</p>
            <button onClick={() => addToCart(item)}>Adicionar ao Pedido</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{marginTop: '20px', borderTop: '2px solid black'}}>
          <h3>Carrinho</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - R$ {Number(item.price || 0).toFixed(2)}</li>
            ))}
          </ul>
          <p><strong>Total: R$ {cartTotal.toFixed(2)}</strong></p>
          <button onClick={placeOrder}>Finalizar Pedido</button>
        </div>
      )}
    </div>
  );
}

export default Menu;