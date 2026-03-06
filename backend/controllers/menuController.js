//caminho -> backend/src/controllers/menuController.js
const { db } = require('../firebase');

// Retorna todos os itens do cardapio
const getMenu = async (req, res) => {
  try {
    const snapshot = await db.collection('menu').get();
    const menu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(menu);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar o cardápio' });
  }
};

module.exports = { getMenu };