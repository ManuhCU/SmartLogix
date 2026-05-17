import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
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
        fetchUsuarios();
    }, [navigate]);

    const fetchProductos = async () => {
        try {
            const data = await api.getCatalogo();
            setProductos(data);
        } catch (err) {
            console.error('Error fetching productos:', err);
        }
    };

    const handleCreateProduct = async () => {
        try {
            const sku = prompt('SKU del producto:');
            if (!sku) return;
            const nombre = prompt('Nombre del producto:');
            const descripcion = prompt('Descripción:');
            const precioRaw = prompt('Precio (numérico):', '0');
            const precio = parseFloat(precioRaw) || 0;
            const stockRaw = prompt('Stock inicial (entero):', '0');
            const stockActual = parseInt(stockRaw, 10) || 0;

            const producto = { sku, nombre, descripcion, precio, stockActual, disponible: stockActual > 0 };
            await api.createProduct(producto);
            await fetchProductos();
        } catch (err) {
            console.error('Error creating product:', err);
            alert('No se pudo crear el producto');
        }
    };

    const handleEditProduct = async (producto) => {
        try {
            const newStockRaw = prompt('Nuevo stock para ' + producto.nombre + ':', producto.stockActual || 0);
            if (newStockRaw === null) return;
            const newStock = parseInt(newStockRaw, 10) || 0;
            const delta = newStock - (producto.stockActual || 0);
            if (delta < 0) {
                // descontar stock via API (cantidad positiva)
                await api.descontarStock(producto.sku, Math.abs(delta));
            } else if (delta > 0) {
                // No hay endpoint para sumar stock, para simplicidad recargar
                alert('Aumenta el stock desde la base de datos o implementa un endpoint de actualización.');
            }
            await fetchProductos();
        } catch (err) {
            console.error('Error updating product:', err);
            alert('No se pudo actualizar el producto');
        }
    };

    const handleDeleteProduct = async (producto) => {
        // No hay endpoint de borrado en inventario; simulamos en UI
        if (!window.confirm(`Eliminar producto ${producto.nombre}? Esta acción no borra en la BD.`)) return;
        setProductos((prev) => prev.filter((p) => p.sku !== producto.sku));
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

    const fetchUsuarios = async () => {
        try {
            const data = await api.getUsuarios();
            setUsuarios(data);
        } catch (err) {
            console.error('Error fetching usuarios:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleCreateUser = async () => {
        try {
            const username = prompt('Nombre de usuario:');
            if (!username) return;
            const password = prompt('Contraseña:');
            const role = prompt('Rol (ADMIN/USER):', 'USER');
            await api.createUser({ username, role, active: true }, password);
            await fetchUsuarios();
        } catch (err) {
            console.error('Error creating user:', err);
            alert('No se pudo crear el usuario');
        }
    };

    const handleEditUser = async (usuario) => {
        try {
            const role = prompt('Nuevo rol:', usuario.role) || usuario.role;
            const active = window.confirm('Marcar como activo? OK=Activo, Cancel=Inactivo');
            const password = prompt('Nueva contraseña (vacío para mantener):', '');
            await api.updateUser(usuario.username, { role, active }, password || null);
            await fetchUsuarios();
        } catch (err) {
            console.error('Error updating user:', err);
            alert('No se pudo actualizar el usuario');
        }
    };

    const handleDeleteUser = async (usuario) => {
        try {
            if (!window.confirm(`Eliminar usuario ${usuario.username}?`)) return;
            await api.deleteUser(usuario.username);
            await fetchUsuarios();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('No se pudo eliminar el usuario');
        }
    };

    const handleViewOrder = (pedido) => {
        alert(`Pedido ${pedido.id}\nCliente: ${pedido.cliente}\nTotal: ${pedido.total}`);
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
                                <button className="btn-primary" onClick={handleCreateProduct}>+ Nuevo Producto</button>
                            </div>

                            <div className="productos-grid">
                                {productos.length > 0 ? (
                                    productos.map((producto) => (
                                        <div key={producto.id} className="producto-card">
                                            <div className="producto-header">
                                                <h3>{producto.nombre}</h3>
                                                <span className="stock-badge">Stock: {producto.stockActual}</span>
                                            </div>
                                            <p className="producto-desc">{producto.descripcion}</p>
                                            <div className="producto-footer">
                                                    <span className="precio">${producto.precio}</span>
                                                <div className="acciones">
                                                    <button className="btn-edit" onClick={() => handleEditProduct(producto)}>✏️ Editar</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteProduct(producto)}>🗑️ Eliminar</button>
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
                                                        <button className="btn-view" onClick={() => handleViewOrder(pedido)}>Ver</button>
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
                                <button className="btn-primary" onClick={handleCreateUser}>+ Nuevo Usuario</button>
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
                                        {usuarios.length > 0 ? (
                                            usuarios.map((usuario) => (
                                                <tr key={usuario.username}>
                                                    <td>{usuario.username}</td>
                                                    <td>
                                                        <span className={`role-badge ${usuario.role.toLowerCase()}`}>
                                                            {usuario.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={usuario.active ? 'status-active' : 'status-inactive'}>
                                                            {usuario.active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="btn-edit" onClick={() => handleEditUser(usuario)}>Editar</button>
                                                        <button className="btn-delete" onClick={() => handleDeleteUser(usuario)}>Eliminar</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="empty-cell">
                                                    No hay usuarios registrados
                                                </td>
                                            </tr>
                                        )}
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
