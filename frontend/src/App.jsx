import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Admin from './pages/Admin'; // Importando a tela de Admin verdadeira

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
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin" element={<Admin />} /> {/* Renderizando o componente de verdade */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;