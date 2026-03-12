import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // NOVO: Importando a tela de cadastro
import Menu from './pages/Menu';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Sistema de Pedidos Cloud</h1>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Register />} /> {/* NOVO: Rota do cadastro */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;