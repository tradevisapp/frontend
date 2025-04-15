import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  // Get public data (no auth required)
  getPublicData: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public data:', error);
      throw error;
    }
  },

  // Get private data (auth required)
  getPrivateData: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/private`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching private data:', error);
      throw error;
    }
  }
}; 