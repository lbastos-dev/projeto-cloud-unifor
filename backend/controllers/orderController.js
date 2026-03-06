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