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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        sku: '',
        nombre: '',
        descripcion: '',
        precio: '0',
        stockActual: '0',
        disponible: true,
    });

    const resetProductForm = () => {
        setProductForm({
            sku: '',
            nombre: '',
            descripcion: '',
            precio: '0',
            stockActual: '0',
            disponible: true,
        });
        setEditingProduct(null);
    };

    const openCreateProductModal = () => {
        resetProductForm();
        setModalMode('create');
        setModalOpen(true);
    };

    const openEditProductModal = (producto) => {
        setEditingProduct(producto);
        setProductForm({
            sku: producto.sku,
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: String(producto.precio || '0'),
            stockActual: String(producto.stockActual || '0'),
            disponible: producto.disponible ?? (producto.stockActual > 0),
        });
        setModalMode('edit');
        setModalOpen(true);
    };

    const handleProductFormChange = (event) => {
        const { name, value, type, checked } = event.target;
        setProductForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveProduct = async () => {
        try {
            const precio = parseFloat(productForm.precio.replace(',', '.')) || 0;
            const stockActual = parseInt(productForm.stockActual, 10) || 0;
            const productoPayload = {
                sku: productForm.sku.trim(),
                nombre: productForm.nombre.trim(),
                descripcion: productForm.descripcion.trim(),
                precio,
                stockActual,
                disponible: productForm.disponible && stockActual > 0,
            };

            if (!productoPayload.sku || !productoPayload.nombre) {
                alert('SKU y nombre son obligatorios.');
                return;
            }

            if (modalMode === 'create') {
                await api.createProduct(productoPayload);
            } else {
                await api.updateProduct(editingProduct.sku, productoPayload);
            }

            await fetchProductos();
            setModalOpen(false);
            resetProductForm();
        } catch (err) {
            console.error('Error saving producto:', err);
            alert('No se pudo guardar el producto. Verifica los datos e inténtalo de nuevo.');
        }
    };

    const handleCreateProduct = async () => {
        openCreateProductModal();
    };

    const handleEditProduct = async (producto) => {
        openEditProductModal(producto);
    };

    const handleDeleteProduct = async (producto) => {
        // No hay endpoint de borrado en inventario; simulamos en UI
        if (!window.confirm(`Eliminar producto ${producto.nombre}? Esta acción no borra en la BD.`)) return;
        setProductos((prev) => prev.filter((p) => p.sku !== producto.sku));
    };

    const fetchPedidos = async () => {
        try {
            const data = await api.getPedidos();
            setPedidos(data || []);
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
        alert(`Pedido ${pedido.id}\nProducto SKU: ${pedido.skuProducto}\nCantidad: ${pedido.cantidad}\nTotal: $${pedido.precioTotal}`);
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
                    {modalOpen && (
                        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>{modalMode === 'create' ? 'Agregar Producto' : 'Editar Producto'}</h3>
                                    <button className="close-modal" onClick={() => setModalOpen(false)}>×</button>
                                </div>
                                <div className="modal-body">
                                    <label>
                                        SKU
                                        <input
                                            type="text"
                                            name="sku"
                                            value={productForm.sku}
                                            onChange={handleProductFormChange}
                                            disabled={modalMode === 'edit'}
                                        />
                                    </label>
                                    <label>
                                        Nombre
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={productForm.nombre}
                                            onChange={handleProductFormChange}
                                        />
                                    </label>
                                    <label>
                                        Descripción
                                        <textarea
                                            name="descripcion"
                                            value={productForm.descripcion}
                                            onChange={handleProductFormChange}
                                        />
                                    </label>
                                    <label>
                                        Precio
                                        <input
                                            type="number"
                                            name="precio"
                                            value={productForm.precio}
                                            onChange={handleProductFormChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </label>
                                    <label>
                                        Stock actual
                                        <input
                                            type="number"
                                            name="stockActual"
                                            value={productForm.stockActual}
                                            onChange={handleProductFormChange}
                                            min="0"
                                        />
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="disponible"
                                            checked={productForm.disponible}
                                            onChange={handleProductFormChange}
                                        />
                                        Disponible
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button className="btn-primary" onClick={handleSaveProduct}>
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                            <th>SKU Producto</th>
                                            <th>Cantidad</th>
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
                                                    <td>{pedido.skuProducto}</td>
                                                    <td>{pedido.cantidad}</td>
                                                    <td>${pedido.precioTotal}</td>
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
