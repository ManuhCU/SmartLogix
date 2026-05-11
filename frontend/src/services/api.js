// Utiliza la variable de entorno o cae por defecto al localhost:8080 del BFF
const API_BASE_URL = process.env.REACT_APP_BFF_URL || 'http://localhost:8080/api';

export const api = {
  // Función genérica para hacer requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  },

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async verifyUser(username) {
    return this.request(`/auth/verify?username=${username}`);
  },

  // Store endpoints
  async getCatalogo() {
    return this.request('/store/catalogo');
  },

  async realizarCompra(pedido) {
    return this.request('/store/comprar', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  },
};

export default api;
};

export const realizarCompra = async (pedidoDTO) => {
  try {
    const response = await api.post('/comprar', pedidoDTO);
    return response.data;
  } catch (error) {
    console.error('Error al realizar compra:', error);
    throw error;
  }
};

export default api;
