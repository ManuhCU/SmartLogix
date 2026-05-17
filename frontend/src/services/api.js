// Utiliza la variable de entorno o cae por defecto al localhost:9090 del BFF
// El navegador del host debe usar localhost:9090 para acceder al servicio bff.
const API_BASE_URL = process.env.REACT_APP_BFF_URL || 'http://localhost:9090/api';

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
      if (response.status === 204) return null;
      try {
        return await response.json();
      } catch (e) {
        return null;
      }
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

  async getUsuarios() {
    return this.request('/users');
  },

  async createUser(user, password) {
    const query = password ? `?password=${encodeURIComponent(password)}` : '';
    return this.request(`/users${query}`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(username, user, password) {
    const query = password ? `?password=${encodeURIComponent(password)}` : '';
    return this.request(`/users/${encodeURIComponent(username)}${query}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  async deleteUser(username) {
    return this.request(`/users/${encodeURIComponent(username)}`, {
      method: 'DELETE',
    });
  },

  async createProduct(product) {
    return this.request('/store/productos', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },
  async descontarStock(sku, cantidad) {
    return this.request(`/store/productos/${encodeURIComponent(sku)}/descontar-stock?cantidad=${encodeURIComponent(cantidad)}`, {
      method: 'PUT',
    });
  },

  async realizarCompra(pedido) {
    return this.request('/store/comprar', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  },
};

export default api;
