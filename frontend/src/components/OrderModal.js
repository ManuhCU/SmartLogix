import React, { useState } from 'react';
import './OrderModal.css';
import { realizarCompra } from '../services/api';

const OrderModal = ({ producto, onClose, onPurchaseSuccess }) => {
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComprar = async () => {
    if (cantidad <= 0 || cantidad > producto.stockActual) {
      setError(`La cantidad debe estar entre 1 y ${producto.stockActual}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pedidoDTO = {
        skuProducto: producto.sku,
        cantidad: parseInt(cantidad, 10),
      };
      
      const response = await realizarCompra(pedidoDTO);
      
      if (response.estado === 'FALLIDO') {
        // Fallback de Circuit Breaker
        setError(response.mensaje);
      } else {
        onPurchaseSuccess(response);
      }
    } catch (err) {
      setError('Error de red al intentar procesar el pedido. El servidor podría estar inactivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Pedido</h2>
          <button className="btn-close" onClick={onClose}><i className="ri-close-line"></i></button>
        </div>
        
        <div className="modal-body">
          <div className="product-summary">
            <div className="summary-row">
              <span>Producto:</span>
              <strong>{producto.nombre}</strong>
            </div>
            <div className="summary-row">
              <span>Precio Unitario:</span>
              <strong>${producto.precio.toLocaleString()}</strong>
            </div>
          </div>

          <div className="input-group">
            <label>Cantidad a comprar (Max: {producto.stockActual})</label>
            <input 
              type="number" 
              className="input-glass" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              max={producto.stockActual}
            />
          </div>

          <div className="total-price">
            <span>Total estimado:</span>
            <h3>${(producto.precio * cantidad).toLocaleString()}</h3>
          </div>

          {error && (
            <div className="alert alert-error">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleComprar} disabled={loading}>
            {loading ? <i className="ri-loader-4-line spin"></i> : <i className="ri-check-line"></i>}
            {loading ? 'Procesando...' : 'Confirmar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
