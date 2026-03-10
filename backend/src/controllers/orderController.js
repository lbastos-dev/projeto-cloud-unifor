// caminho -> backend/src/controllers/orderController.js
const { db } = require('../firebase');

const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    // Aqui foi removida a parte anterior e feita a validação que não havia sido feito anteriormente
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Validação falhou: O pedido deve conter uma lista de itens.' });
    }
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Validação falhou: O valor total deve ser um número maior que zero.' });
    }

    const newOrder = {
      userId: req.user.uid,
      items,
      total,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('orders').add(newOrder);
    return res.status(201).json({ id: docRef.id, ...newOrder });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

const getOrders = async (req, res) => {
  try {
    let snapshot;
    if (req.user.role === 'admin') {
      snapshot = await db.collection('orders').get(); // Admin ve todos
    } else {
      snapshot = await db.collection('orders').where('userId', '==', req.user.uid).get(); // User ve os proprios
    }

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //  Validação de dados p/ att de status
    const statusValidos = ['pendente', 'preparando', 'enviado', 'entregue'];
    if (!status || !statusValidos.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Validação falhou: Status inválido. Use pendente, preparando, enviado ou entregue.' });
    }

    await db.collection('orders').doc(id).update({ status: status.toLowerCase() });
    return res.status(200).json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('orders').doc(id).delete();
    return res.status(200).json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, deleteOrder };