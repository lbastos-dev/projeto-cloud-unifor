// caminho -> backend/src/controllers/orderController.js
const { db } = require('../firebase');

// Cria um novo pedido vinculado ao usuario logado
const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const newOrder = {
      userId: req.user.uid,
      items,
      total,
      status: 'pendente', // pendente, preparando, enviado, entregue
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('orders').add(newOrder);
    return res.status(201).json({ id: docRef.id, ...newOrder });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};
// Lista pedidos (Admin ver todos, User ve os proprios)
const getOrders = async (req, res) => {
    try {
      let snapshot;
      if (req.user.role === 'admin') {
        snapshot = await db.collection('orders').get();
      } else {
        snapshot = await db.collection('orders').where('userId', '==', req.user.uid).get();
      }
  
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  };
// Atualiza o status do pedido (Permissão apenas p/ admin )
const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      await db.collection('orders').doc(id).update({ status });
      return res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  };