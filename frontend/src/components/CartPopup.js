import React from 'react';
import './CartPopup.css';

const CartPopup = ({
  cartItems,
  onClose,
  onRemoveItem,
  onQuantityChange,
  onCheckout,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  discountMessage,
  subtotal,
  discountAmount,
  totalWithDiscount,
  loading,
  error,
  successMessage,
}) => {
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel glass-panel" onClick={(e) => e.stopPropagation()}>
        <header className="cart-header">
          <div>
            <h2>Tu carrito de compras</h2>
            <p>Revisa cantidades, aplica un descuento y completa la compra.</p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </header>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <i className="ri-shopping-cart-line"></i>
              <p>El carrito está vacío. Agrega productos para continuar.</p>
            </div>
          ) : (
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.sku}>
                  <div>
                    <p className="item-name">{item.nombre}</p>
                    <span className="item-sku">{item.sku}</span>
                  </div>
                  <div className="item-controls">
                    <input
                      type="number"
                      min="1"
                      max={item.stockActual}
                      value={item.cantidad}
                      onChange={(e) => onQuantityChange(item.sku, Number(e.target.value))}
                    />
                    <span className="item-price">${(item.precio * item.cantidad).toLocaleString()}</span>
                    <button className="btn-link" onClick={() => onRemoveItem(item.sku)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="discount-section">
            <label htmlFor="discountCode">Código de descuento</label>
            <div className="discount-input-group">
              <input
                id="discountCode"
                className="input-glass"
                placeholder="SMART10, VIP20, ENVIOFREE"
                value={discountCode}
                onChange={(e) => onDiscountCodeChange(e.target.value)}
              />
              <button className="btn-secondary" onClick={onApplyDiscount} type="button">
                Aplicar
              </button>
            </div>
            {discountMessage && <p className="discount-message">{discountMessage}</p>}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <div className="summary-row">
              <span>Descuento</span>
              <strong>-${discountAmount.toLocaleString()}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>${totalWithDiscount.toLocaleString()}</strong>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success">
              <i className="ri-checkbox-circle-fill"></i>
              {successMessage}
            </div>
          )}
        </div>

        <footer className="cart-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Seguir comprando
          </button>
          <button className="btn-primary" onClick={onCheckout} disabled={loading || cartItems.length === 0}>
            {loading ? <i className="ri-loader-4-line spin"></i> : <i className="ri-check-line"></i>}
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CartPopup;
