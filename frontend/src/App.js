import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
          <Route path="/" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function CatalogLayout() {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return (
    <>
      {/* Simple top navigation for esthetics */}
      <nav style={{ background: 'rgba(13, 17, 23, 0.8)', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <i className="ri-box-3-fill" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>Smart<span style={{ color: 'var(--primary)' }}>Logix</span></h2>
          </div>
          <div>
            {isAuth && user?.role === 'ADMIN' ? (
              <button className="btn-primary" onClick={() => navigate('/admin')}>
                <i className="ri-settings-4-line"></i> Panel Admin
              </button>
            ) : isAuth ? (
              <button className="btn-secondary" onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  window.location.reload();
              }}>
                <i className="ri-logout-box-line"></i> Cerrar Sesión
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                <i className="ri-user-line"></i> Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </nav>
      <Catalog />
    </>
  );
}

export default App;
