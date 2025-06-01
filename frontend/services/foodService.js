angular.module('FoodApp').service('FoodService', function ($http) {
    this.getFoods = function () {
      return $http.get('http://localhost:3000/api/foods');
    };
  
    this.getReviews = function (foodId) {
      return $http.get(`http://localhost:3000/api/foods/${foodId}/reviews`);
    };
  
    this.addReview = function (foodId, reviewData) {
      return $http.post(`http://localhost:3000/api/foods/${foodId}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    };
  
    this.getFavorites = function () {
      return $http.get('http://localhost:3000/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    };
  
    this.addToFavorites = function (foodId) {
      return $http.post(`http://localhost:3000/api/favorites/${foodId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    };
  
    this.removeFromFavorites = function (foodId) {
      return $http.delete(`http://localhost:3000/api/favorites/${foodId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    };
  });
  