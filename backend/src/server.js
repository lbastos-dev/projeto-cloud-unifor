//caminho -> backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyToken, isAdmin } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota publica (ex: ver status da API)
app.get('/health', (req, res) => {
  res.json({ status: 'API online' });
});

// Rota privada basica (Só p/ usuarios logados)
app.get('/perfil', verifyToken, (req, res) => {
  res.json({ message: 'Acesso permitido', user: req.user });
});

// Rota restita (Apenas p/ Admin)
app.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Acesso de administrador permitido' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});