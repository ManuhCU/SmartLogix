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
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [saveNewCard, setSaveNewCard] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.cardNumber) {
          setSavedCard({
            cardHolderName: parsedUser.cardHolderName,
            cardNumber: parsedUser.cardNumber,
            cardExpiry: parsedUser.cardExpiry,
            cardCvv: parsedUser.cardCvv,
          });
          setUseSavedCard(true);
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

  const handleCheckoutClick = () => {
    setPaymentError('');
    if (!useSavedCard) {
      if (!cardForm.cardHolderName || !cardForm.cardNumber || !cardForm.cardExpiry || !cardForm.cardCvv) {
        setPaymentError('Completa todos los campos de la tarjeta.');
        return;
      }
      if (cardForm.cardCvv.length < 3 || cardForm.cardCvv.length > 4 || isNaN(Number(cardForm.cardCvv))) {
        setPaymentError('El CVV debe tener 3 o 4 dígitos numéricos.');
        return;
      }
      if (cardForm.cardNumber.replace(/\s/g, '').length < 13 || isNaN(Number(cardForm.cardNumber.replace(/\s/g, '')))) {
        setPaymentError('El número de tarjeta no es válido.');
        return;
      }
      if (!cardForm.cardExpiry.includes('/') || cardForm.cardExpiry.length !== 5) {
        setPaymentError('La fecha de expiración debe tener el formato MM/AA.');
        return;
      }
    }

    onCheckout({
      useSavedCard,
      saveNewCard,
      newCard: cardForm
    });
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
            <label>Método de Pago</label>
            
            {savedCard && (
              <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    checked={useSavedCard} 
                    onChange={() => setUseSavedCard(true)}
                  />
                  <span>Usar mi tarjeta terminada en •••• {savedCard.cardNumber?.slice(-4)}</span>
                </label>
              </div>
            )}

            <div style={{ marginBottom: '0.5rem', opacity: useSavedCard ? 0.5 : 1 }}>
              {savedCard && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
                  <input 
                    type="radio" 
                    checked={!useSavedCard} 
                    onChange={() => setUseSavedCard(false)}
                  />
                  <span>Usar otra tarjeta</span>
                </label>
              )}
              
              {!useSavedCard && (
                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
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
                    placeholder="Número de tarjeta (ej. 4111222233334444)"
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
                      placeholder="CVV (3-4 dígitos)"
                      value={cardForm.cardCvv}
                      onChange={handleCardInputChange}
                      required
                      maxLength="4"
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <input 
                      type="checkbox" 
                      checked={saveNewCard} 
                      onChange={(e) => setSaveNewCard(e.target.checked)}
                    />
                    Guardar esta tarjeta para futuras compras
                  </label>
                </div>
              )}
            </div>
            {paymentError && <p className="discount-message" style={{color: '#ff4d4d'}}>{paymentError}</p>}
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
          <button className="btn-primary" onClick={handleCheckoutClick} disabled={loading || cartItems.length === 0}>
            {loading ? <i className="ri-loader-4-line spin"></i> : <i className="ri-check-line"></i>}
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CartPopup;
