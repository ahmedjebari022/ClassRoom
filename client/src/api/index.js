import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});


API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response?.status === 401) {
      // Redirect to login or clear auth state
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);


export default API;