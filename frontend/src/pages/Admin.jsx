import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NOVO
import { signOut } from 'firebase/auth'; // NOVO
import { auth } from '../firebase'; // NOVO
import api from '../services/api';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // NOVO: Para redirecionar após sair

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os pedidos da base de dados.');
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o status do pedido. Verifique o console.');
    }
  };

  // NOVO: Função de Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Volta para a tela de Login
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Painel do Administrador</h2>
        <button onClick={handleLogout}>Sair</button> {/* NOVO: Botão de Sair */}
      </div>
      
      <p>Gerencie os pedidos recebidos abaixo:</p>

      {error && <p>{error}</p>}

      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado no sistema.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p><strong>ID do Pedido:</strong> {order.id}</p>
              <p><strong>Total:</strong> R$ {Number(order.total || 0).toFixed(2)}</p>
              <p><strong>Status Atual:</strong> {order.status}</p>
              
              <div>
                <span>Alterar status para: </span>
                <button onClick={() => updateStatus(order.id, 'pendente')}>Pendente</button>
                <button onClick={() => updateStatus(order.id, 'preparando')}>Preparando</button>
                <button onClick={() => updateStatus(order.id, 'enviado')}>Enviado</button>
                <button onClick={() => updateStatus(order.id, 'entregue')}>Entregue</button>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;