import { Routes, Route, Link } from 'react-router-dom';
import TelaConvertido from './pages/TelaConvertido';
import TelaIgrejaParceira from './pages/TelaIgrejaParceira';
import TelaLideranca from './pages/TelaLideranca';

function App() {
  return (
    <>
      {/* Barra de navegação simples para alternar entre as telas */}
      <nav style={{ padding: '15px', background: '#1f1f1f', color: '#fff', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }}>Tela Convertido</Link>
        <Link to="/igreja-parceira" style={{ color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }}>Igreja Parceira</Link>
        <Link to="/lideranca" style={{ color: '#61dafb', textDecoration: 'none', fontWeight: 'bold' }}>Liderança</Link>
      </nav>

      {/* Área onde as telas serão renderizadas conforme a rota */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<TelaConvertido />} />
          <Route path="/igreja-parceira" element={<TelaIgrejaParceira />} />
          <Route path="/lideranca" element={<TelaLideranca />} />
        </Routes>
      </div>
    </>
  );
}

export default App;