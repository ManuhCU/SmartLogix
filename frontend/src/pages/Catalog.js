import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CartPopup from '../components/CartPopup';
import { api } from '../services/api';

const DISCOUNT_CODES = {
  SMART10: 10,
  VIP20: 20,
  ENVIOFREE: 100,
};

const Catalog = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCatalogo = async () => {
    try {
      setLoading(true);
      const data = await api.getCatalogo();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el catálogo. Verifique si el BFF está ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogo();
  }, []);

  const findDiscountValue = (code) => {
    if (!code) return 0;
    return DISCOUNT_CODES[code.trim().toUpperCase()] || 0;
  };

  const handleAddToCart = (producto) => {
    setPurchaseError('');
    setSuccessMsg('');
    setCartOpen(true);

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.sku === producto.sku);
      if (existing) {
        if (existing.cantidad >= producto.stockActual) {
          setPurchaseError('No hay más stock disponible para este producto.');
          return currentItems;
        }

        return currentItems.map((item) =>
          item.sku === producto.sku
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          sku: producto.sku,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          stockActual: producto.stockActual,
        },
      ];
    });
  };

  const handleRemoveFromCart = (sku) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.sku !== sku));
  };

  const handleChangeCartQuantity = (sku, cantidad) => {
    const parsed = Number(cantidad);
    if (Number.isNaN(parsed)) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.sku === sku
          ? { ...item, cantidad: Math.max(1, Math.min(parsed, item.stockActual)) }
          : item
      )
    );
  };

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const descuento = findDiscountValue(code);

    if (!code) {
      setDiscountMessage('Ingresa un código de descuento.');
      return;
    }

    if (!descuento) {
      setDiscountMessage('Código inválido. Usa SMART10, VIP20 o ENVIOFREE.');
      return;
    }

    setDiscountMessage(`Descuento aplicado: ${descuento}%`);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  };

  const handleCheckout = async () => {
    setPurchaseError('');
    setSuccessMsg('');

    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (!isAuth || !user) {
      setPurchaseError('Debes iniciar sesión para poder realizar una compra.');
      return;
    }

    if (cartItems.length === 0) {
      setPurchaseError('El carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    const invalidItem = cartItems.find((item) => item.cantidad < 1 || item.cantidad > item.stockActual);
    if (invalidItem) {
      setPurchaseError(`Revisa la cantidad de ${invalidItem.nombre}. Solo quedan ${invalidItem.stockActual} en stock.`);
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderedItems = [];

      for (const item of cartItems) {
        const response = await api.realizarCompra({
          skuProducto: item.sku,
          cantidad: item.cantidad,
          username: user.username,
          nombreProducto: item.nombre
        });

        if (response && response.estado === 'FALLIDO') {
          setPurchaseError(`No se pudo comprar ${item.nombre}: ${response.mensaje || 'Error en el pedido.'}`);
          return;
        }

        orderedItems.push(`${item.cantidad} x ${item.nombre}`);
      }

      setSuccessMsg(`Compra completada: ${orderedItems.join(', ')}.`);
      setCartItems([]);
      setDiscountCode('');
      setDiscountMessage('');
      fetchCatalogo();
      setCartOpen(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setPurchaseError('No se pudo procesar la compra. Verifica que el backend esté disponible.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const discountPercent = findDiscountValue(discountCode);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalWithDiscount = subtotal - discountAmount;
  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div>
      <header className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Catálogo SmartLogix</h1>
          <p className="hero-subtitle">
            Gestión inteligente de inventario y pedidos. Plataforma integrada 
            para administrar tus recursos en tiempo real.
          </p>
        </div>
      </header>

      <main className="container">
        {successMsg && (
          <div className="alert alert-success">
            <i className="ri-checkbox-circle-fill"></i>
            {successMsg}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <i className="ri-error-warning-fill"></i>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Productos Disponibles</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Agrega productos al carrito y revisa el total antes de pagar.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={fetchCatalogo}>
              <i className="ri-refresh-line"></i> Actualizar
            </button>
            <button className="btn-primary" onClick={() => setCartOpen(true)}>
              <i className="ri-shopping-cart-2-line"></i>
              Carrito ({totalItems})
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="ri-loader-4-line spin" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cargando catálogo desde el BFF...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="ri-inbox-line" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
            <h3 style={{ margin: '1rem 0' }}>Inventario Vacío</h3>
            <p className="product-desc">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4">
            {productos.map((producto) => (
              <ProductCard
                key={producto.sku}
                producto={producto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {cartOpen && (
        <CartPopup
          cartItems={cartItems}
          onClose={() => setCartOpen(false)}
          onRemoveItem={handleRemoveFromCart}
          onQuantityChange={handleChangeCartQuantity}
          onCheckout={handleCheckout}
          discountCode={discountCode}
          onDiscountCodeChange={setDiscountCode}
          onApplyDiscount={handleApplyDiscount}
          discountMessage={discountMessage}
          subtotal={subtotal}
          discountAmount={discountAmount}
          totalWithDiscount={totalWithDiscount}
          loading={checkoutLoading}
          error={purchaseError}
          successMessage={successMsg}
        />
      )}
    </div>
  );
};

export default Catalog;
