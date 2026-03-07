// caminho - backend/src/routes/menuRoutes.js
const express = require('express');
const { getMenu } = require('../controllers/menuController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Qualquer usuario logado pode ver o cardapio
router.get('/', verifyToken, getMenu);

module.exports = router;