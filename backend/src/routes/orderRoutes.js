// backend/src/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Criar e listar pedidos (Acesso basico)
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);

// Atualizar e deletar pedidos (Restrito a Admin)
router.patch('/:id', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

module.exports = router;