// backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Registro das rotas principais
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Rota de teste de saude da API
app.get('/health', (req, res) => {
  res.json({ status: 'API online' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});