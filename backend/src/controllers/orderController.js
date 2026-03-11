// backend/src/controllers/orderController.js
const { db } = require('../firebase');

// Criar pedido
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const newOrder = {
      userId: req.user.uid,
      items,
      total,
      status: 'pendente',
      createdAt: new Date()
    };
    
    const docRef = await db.collection('orders').add(newOrder);
    res.status(201).json({ id: docRef.id, ...newOrder });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

// Buscar pedidos
exports.getOrders = async (req, res) => {
  try {
    let snapshot;
    if (req.user.role === 'admin') {
      snapshot = await db.collection('orders').get();
    } else {
      snapshot = await db.collection('orders').where('userId', '==', req.user.uid).get();
    }
    
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};

// Atualizar status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.collection('orders').doc(id).update({ status });
    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar o pedido na nuvem.' });
  }
};

// 4. Deletar pedido
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('orders').doc(id).delete();
    res.json({ message: 'Pedido deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ error: 'Erro ao deletar o pedido.' });
  }
};