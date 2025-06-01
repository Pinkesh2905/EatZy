app.factory('AuthService', function ($http) {
  const API_URL = 'http://localhost:3000/api';
  const AUTH_URL = 'http://localhost:3000/api/auth';

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  return {
    signup: function (userData) {
      return $http.post(`${AUTH_URL}/register`, userData);
    },
    login: function (userData) {
      return $http.post(`${AUTH_URL}/login`, userData);
    },
    getProfile: function () {
      return $http.get(`${AUTH_URL}/profile`, config());
    },
    updateProfile: function (userData) {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }
      return $http.put(`${AUTH_URL}/profile`, formData, {
        headers: {
          'Content-Type': undefined,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    updatePassword: function (password) {
      return $http.put(`${AUTH_URL}/profile/password`, { password }, config());
    },
    placeOrder: function (orderData) {
      return $http.post(`${API_URL}/orders`, orderData, config());
    },
    getMyOrders: function () {
      return $http.get(`${API_URL}/orders/mine`, config());
    },
    cancelOrder: function (orderId) {
      return $http.put(`${API_URL}/orders/${orderId}/cancel`, {}, config());
    },
  };
});
