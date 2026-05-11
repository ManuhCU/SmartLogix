import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta de Admin */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Ruta de Catálogo */}
          <Route path="/catalog" element={<CatalogLayout />} />
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function CatalogLayout() {
  return (
    <>
      {/* Simple top navigation for esthetics */}
      <nav style={{ background: 'rgba(13, 17, 23, 0.8)', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <i className="ri-box-3-fill" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>Smart<span style={{ color: 'var(--primary)' }}>Logix</span></h2>
        </div>
      </nav>
      <Catalog />
    </>
  );
}

export default App;
