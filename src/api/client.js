import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Customers
  getCustomers: async () => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
  },

  addCustomer: async (customer) => {
    const response = await axios.post(`${API_BASE_URL}/customers`, customer);
    return response.data;
  },

  getCustomer: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  },

  // Transactions
  getTransactions: async () => {
    const response = await axios.get(`${API_BASE_URL}/transactions`);
    return response.data;
  },

  addTransaction: async (transaction) => {
    const response = await axios.post(`${API_BASE_URL}/transactions`, transaction);
    return response.data;
  }
};

export default api;