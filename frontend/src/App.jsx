// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu'; // NOVO: Importando a tela de cardápio
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Sistema de Pedidos Cloud</h1>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu" element={<Menu />} /> {/* NOVO: Rota conectada */}
            <Route path="/admin" element={<h2>Painel Admin (Em breve)</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;