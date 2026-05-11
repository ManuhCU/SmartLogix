import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [activeTab, setActiveTab] = useState('productos');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
        const userData = localStorage.getItem('user');
        const isAuth = localStorage.getItem('isAuthenticated');

        if (!isAuth || !userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'ADMIN') {
            navigate('/catalog');
            return;
        }

        setUser(parsedUser);
        fetchProductos();
        fetchPedidos();
    }, [navigate]);

    const fetchProductos = async () => {
        try {
            const data = await api.getCatalogo();
            setProductos(data);
        } catch (err) {
            console.error('Error fetching productos:', err);
        }
    };

    const fetchPedidos = async () => {
        try {
            // En un caso real, esto traería los pedidos de un endpoint específico
            // const data = await api.getPedidos();
            setPedidos([]);
        } catch (err) {
            console.error('Error fetching pedidos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="admin-container">
            {/* Navbar */}
            <nav className="admin-navbar">
                <div className="navbar-brand">
                    <h1>🔧 Panel de Administrador</h1>
                </div>
                <div className="navbar-user">
                    <span className="user-info">👤 {user?.username}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <div className="admin-content">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <ul className="sidebar-menu">
                        <li>
                            <button
                                className={`menu-item ${activeTab === 'productos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('productos')}
                            >
                                📦 Gestionar Productos
                            </button>
                        </li>
                        <li>
                            <button
                                className={`menu-item ${activeTab === 'pedidos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pedidos')}
                            >
                                📋 Ver Pedidos
                            </button>
                        </li>
                        <li>
                            <button
                                className={`menu-item ${activeTab === 'usuarios' ? 'active' : ''}`}
                                onClick={() => setActiveTab('usuarios')}
                            >
                                👥 Gestionar Usuarios
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    {/* Tab: Productos */}
                    {activeTab === 'productos' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h2>Gestionar Productos</h2>
                                <button className="btn-primary">+ Nuevo Producto</button>
                            </div>

                            <div className="productos-grid">
                                {productos.length > 0 ? (
                                    productos.map((producto) => (
                                        <div key={producto.id} className="producto-card">
                                            <div className="producto-header">
                                                <h3>{producto.nombre}</h3>
                                                <span className="stock-badge">Stock: {producto.stock}</span>
                                            </div>
                                            <p className="producto-desc">{producto.descripcion}</p>
                                            <div className="producto-footer">
                                                <span className="precio">${producto.precio}</span>
                                                <div className="acciones">
                                                    <button className="btn-edit">✏️ Editar</button>
                                                    <button className="btn-delete">🗑️ Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-message">No hay productos disponibles</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Tab: Pedidos */}
                    {activeTab === 'pedidos' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h2>Historial de Pedidos</h2>
                            </div>

                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.length > 0 ? (
                                            pedidos.map((pedido) => (
                                                <tr key={pedido.id}>
                                                    <td>{pedido.id}</td>
                                                    <td>{pedido.cliente}</td>
                                                    <td>{pedido.fecha}</td>
                                                    <td>${pedido.total}</td>
                                                    <td>
                                                        <span className="estado-badge">{pedido.estado}</span>
                                                    </td>
                                                    <td>
                                                        <button className="btn-view">Ver</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="empty-cell">
                                                    No hay pedidos disponibles
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Tab: Usuarios */}
                    {activeTab === 'usuarios' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h2>Gestionar Usuarios</h2>
                                <button className="btn-primary">+ Nuevo Usuario</button>
                            </div>

                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Rol</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>admin</td>
                                            <td>
                                                <span className="role-badge admin">ADMIN</span>
                                            </td>
                                            <td>
                                                <span className="status-active">Activo</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">Editar</button>
                                                <button className="btn-delete">Eliminar</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>user1</td>
                                            <td>
                                                <span className="role-badge user">USER</span>
                                            </td>
                                            <td>
                                                <span className="status-active">Activo</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">Editar</button>
                                                <button className="btn-delete">Eliminar</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Admin;
