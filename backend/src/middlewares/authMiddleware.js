// caminho -> backend/src/middlewares/authMiddleware.js
const { admin, db } = require('../firebase');

// Verifica se o token JWT é valido e extrai o UID do usuario
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Anexa os dados do usuario na requsicao
    
    // Busca a role do usuario no Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    req.user.role = userDoc.exists ? userDoc.data().role : 'user';

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Verificação se o usuario tem a role de admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acesso negado. Privilégios insuficientes.' });
  }
};

module.exports = { verifyToken, isAdmin };