import React, { useEffect, useState } from 'react';
import './CartPopup.css';
import { api } from '../services/api';

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
  const [cardForm, setCardForm] = useState({ cardHolderName: '', cardNumber: '', cardExpiry: '', cardCvv: '' });
  const [cardSaving, setCardSaving] = useState(false);
  const [cardMessage, setCardMessage] = useState('');
  const [savedCard, setSavedCard] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.cardHolderName) {
          setSavedCard({
            cardHolderName: parsedUser.cardHolderName,
            cardNumber: parsedUser.cardNumber,
            cardExpiry: parsedUser.cardExpiry,
            cardCvv: parsedUser.cardCvv,
          });
        }
      } catch (error) {
        console.error('No se pudo leer la tarjeta guardada', error);
      }
    }
  }, []);

  const handleCardInputChange = (event) => {
    const { name, value } = event.target;
    setCardForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveCard = async (event) => {
    event.preventDefault();
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setCardMessage('Debes iniciar sesión para guardar una tarjeta.');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setCardSaving(true);
    setCardMessage('');

    try {
      const updatedUser = await api.updateUser(parsedUser.username, {
        username: parsedUser.username,
        role: parsedUser.role,
        active: true,
        cardHolderName: cardForm.cardHolderName,
        cardNumber: cardForm.cardNumber,
        cardExpiry: cardForm.cardExpiry,
        cardCvv: cardForm.cardCvv,
      });

      const nextUser = { ...parsedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(nextUser));
      setSavedCard({ ...updatedUser });
      setCardForm({ cardHolderName: '', cardNumber: '', cardExpiry: '', cardCvv: '' });
      setCardMessage('Tarjeta guardada correctamente.');
    } catch (error) {
      setCardMessage('No se pudo guardar la tarjeta. Intenta nuevamente.');
      console.error(error);
    } finally {
      setCardSaving(false);
    }
  };

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

          <div className="discount-section">
            <label>Guardar tarjeta para pagos rápidos</label>
            <form onSubmit={handleSaveCard} style={{ display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
              <input
                className="input-glass"
                name="cardHolderName"
                placeholder="Nombre en la tarjeta"
                value={cardForm.cardHolderName}
                onChange={handleCardInputChange}
                required
              />
              <input
                className="input-glass"
                name="cardNumber"
                placeholder="Número de tarjeta"
                value={cardForm.cardNumber}
                onChange={handleCardInputChange}
                required
                maxLength="19"
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  className="input-glass"
                  name="cardExpiry"
                  placeholder="MM/AA"
                  value={cardForm.cardExpiry}
                  onChange={handleCardInputChange}
                  required
                  maxLength="5"
                />
                <input
                  className="input-glass"
                  name="cardCvv"
                  placeholder="CVV"
                  value={cardForm.cardCvv}
                  onChange={handleCardInputChange}
                  required
                  maxLength="4"
                />
              </div>
              <button className="btn-secondary" type="submit" disabled={cardSaving}>
                {cardSaving ? 'Guardando...' : 'Guardar tarjeta'}
              </button>
            </form>
            {cardMessage && <p className="discount-message">{cardMessage}</p>}
            {savedCard && (
              <p className="discount-message" style={{ marginTop: '0.5rem' }}>
                Tarjeta guardada para este usuario: {savedCard.cardNumber?.slice(-4)} · {savedCard.cardExpiry}
              </p>
            )}
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
