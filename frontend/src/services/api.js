import axios from 'axios';

// Utiliza la variable de entorno o cae por defecto al localhost:8080 del BFF
const API_URL = process.env.REACT_APP_BFF_URL || 'http://localhost:8080/api/store';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCatalogo = async () => {
  try {
    const response = await api.get('/catalogo');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el catálogo:', error);
    throw error;
  }
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
