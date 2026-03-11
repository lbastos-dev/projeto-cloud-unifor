// frontend/src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os pedidos da nuvem.');
      setLoading(false);
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
      alert('Erro ao atualizar o status. Verifique o console.');
    }
  };

  if (loading) return <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Carregando painel do administrador...</p>;

  return (
    <div className="admin-container">
      <h2>Gestão de Pedidos</h2>
      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado no sistema.</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">ID: {order.id}</span>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
              
              <p className="order-total">Total: R$ {Number(order.total || 0).toFixed(2)}</p>
              
              <div className="status-actions">
                <p>Mudar status para:</p>
                <div className="btn-group">
                  <button onClick={() => updateStatus(order.id, 'pendente')} className="btn-status">Pendente</button>
                  <button onClick={() => updateStatus(order.id, 'preparando')} className="btn-status">Preparando</button>
                  <button onClick={() => updateStatus(order.id, 'enviado')} className="btn-status">Enviado</button>
                  <button onClick={() => updateStatus(order.id, 'entregue')} className="btn-status entregue">Entregue</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;