import { useState, useEffect } from 'react';
import api from '../services/api';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar o cardápio. Você está logado?');
      setLoading(false);
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

  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  if (loading) return <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Aguarde um momento</p>;

  return (
    <div className="menu-container">
      <h2>Cardápio</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="menu-grid">
        {menuItems.length === 0 ? (
          <p>Nenhum item encontrado. (Adicione produtos na coleção "menu")</p>
        ) : (
          menuItems.map(item => (
            <div key={item.id} className="menu-card">
              <h3>{item.name || 'Produto Sem Nome'}</h3>
              <p>{item.description || 'Sem descrição'}</p>
              <p className="price">R$ {Number(item.price || 0).toFixed(2)}</p>
              <button onClick={() => addToCart(item)} className="btn-secondary">Adicionar ao Pedido</button>
            </div>
          ))
        )}
      </div>

      
      {cart.length > 0 && (
        <div className="cart-container">
          <h3>Seu Carrinho</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> - R$ {Number(item.price || 0).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total">Total do Pedido: R$ {cartTotal.toFixed(2)}</p>
          <button onClick={placeOrder} className="btn-primary" style={{ backgroundColor: '#047857' }}>
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;