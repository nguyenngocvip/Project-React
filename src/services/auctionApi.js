import axios from 'axios';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const auctionApi = {
  // Lấy danh sách phiên đấu giá (GET)
  async getProducts() {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch {
      // Dự phòng dữ liệu cục bộ nếu chưa chạy backend server
      return INITIAL_PRODUCTS;
    }
  },

  // Đăng phiên đấu giá mới (POST)
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch {
      return productData;
    }
  },

  // Cập nhật lượt trả giá / trạng thái Escrow (PUT)
  async updateProduct(productId, updatedFields) {
    try {
      const response = await apiClient.put(`/products/${productId}`, updatedFields);
      return response.data;
    } catch {
      return { id: productId, ...updatedFields };
    }
  }
};