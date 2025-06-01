angular.module('FoodApp').controller('FoodController', function ($scope, $rootScope, $http, FoodService, AuthService) {
  $scope.foods = [];
  $scope.cart = [];
  $scope.showCart = false;
  $scope.selectedFood = null;
  $scope.popupVisible = false;
  $scope.showRestaurantModal = false;
  $scope.restaurantData = {};
  $scope.showHome = true;
  $scope.showProfile = false;
  $rootScope.loggedIn = false;

  $scope.goHome = function () {
    $scope.showHome = true;
    $scope.showProfile = false;
    $scope.showCart = false;
    $scope.selectedFood = null;
    $scope.showFavorites = false;
    $scope.showAdmin = false;
    $scope.showTrack = false;
    window.scrollTo(0, 0);
  };
  $rootScope.goHome = $scope.goHome;

  $scope.orderHistory = [];

  $scope.loadOrderHistory = function () {
    AuthService.getMyOrders()
      .then(function (res) {
        $scope.orderHistory = res.data;
      })
      .catch(function (err) {
        console.error('Failed to load order history', err);
      });
  };

  $scope.goToProfile = function () {
    $scope.showHome = false;
    $scope.showProfile = true;
    $scope.showCart = false;
    $scope.popupVisible = false;
    $scope.showTrack = false;
    $scope.loadOrderHistory();
  };
  $rootScope.showProfilePage = $scope.goToProfile;

  $scope.profile = {
    username: 'pinku',
    email: 'pinku@gmail.com',
    createdAt: new Date(),
  };

  AuthService.getProfile()
    .then(function (res) {
      $scope.profile = res.data;
    })
    .catch(function (err) {
      console.error('Profile load error:', err);
    });

  $scope.editingProfile = false;
  $scope.updatedProfile = {};

  $scope.editProfile = function () {
    $scope.editingProfile = true;
    $scope.updatedProfile = angular.copy($scope.profile);
  };

  $scope.onFileChange = function (element) {
    $scope.$apply(function () {
      const file = element.files[0];
      $scope.updatedProfile.avatar = file;

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          $scope.$apply(() => {
            $scope.previewAvatarUrl = e.target.result;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  $scope.saveProfile = function () {
    AuthService.updateProfile($scope.updatedProfile)
      .then(function (res) {
        alert('Profile updated successfully');
        $scope.profile = res.data.user;
        $scope.editingProfile = false;
      })
      .catch(function (err) {
        alert(err.data.message || 'Error updating profile');
      });
  };

  $scope.cancelEdit = function () {
    $scope.editingProfile = false;
    $scope.updatedProfile = {};
    $scope.updatedPassword = '';
  };

  $scope.showPassword = false;

  $scope.updatePassword = function (updatedPassword) {
    if (!updatedPassword && updatedPassword.length < 6) {
      alert(`Password must be at least 6 characters ${updatedPassword}`);
      return;
    }

    AuthService.updatePassword(updatedPassword)
      .then(function () {
        alert('Password updated successfully');
        updatedPassword = '';
      })
      .catch(function (err) {
        alert(err.data.message || 'Error updating password');
      });
  };

  $scope.searchQuery = '';
  $rootScope.searchText = '';
  let debounceTimeout = null;
  $scope.searching = false;

  $scope.debouncedSearch = function () {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    $scope.searching = true;

    debounceTimeout = setTimeout(function () {
      $rootScope.$apply(function () {
        $rootScope.searchText = $scope.searchQuery;
        $scope.searching = false;
      });
    }, 300);
  };

  $scope.favorites = [];
  $scope.showFavorites = false;

  $scope.toggleFavorites = function () {
    $scope.showFavorites = true;
    $scope.showHome = false;
    $scope.showProfile = false;
    $scope.showCart = false;
    $scope.popupVisible = false;
    $scope.showTrack = false;
  };

  $rootScope.goToFavorites = $scope.toggleFavorites;

  function loadFavorites() {
    if ($rootScope.loggedIn) {
      FoodService.getFavorites().then(function (res) {
        $scope.favorites = res.data;
      });
    }
  }

  $rootScope.$watch('loggedIn', function (val) {
    if (val) loadFavorites();
  });

  $scope.isFavorite = function (food) {
    return $scope.favorites.some((f) => f._id === food._id);
  };

  $scope.toggleFavorite = function (food) {
    if (!$rootScope.loggedIn) {
      $rootScope.showAuthModal = true;
      return;
    }

    if ($scope.isFavorite(food)) {
      FoodService.removeFromFavorites(food._id).then(() => {
        $scope.favorites = $scope.favorites.filter((f) => f._id !== food._id);
      });
    } else {
      FoodService.addToFavorites(food._id).then(() => {
        $scope.favorites.push(food);
      });
    }
  };

  $rootScope.darkMode = localStorage.getItem('darkMode') === 'true';

  $scope.toggleDarkMode = function () {
    $rootScope.darkMode = !$rootScope.darkMode;
    localStorage.setItem('darkMode', $rootScope.darkMode);
  };

  $rootScope.showAuthModal = false;
  $scope.isLogin = true;
  $scope.authData = {};

  $scope.openAuth = function () {
    $rootScope.showAuthModal = true;
  };

  $scope.toggleAuthMode = function () {
    $scope.isLogin = !$scope.isLogin;
    $scope.authData = {};
  };

  $scope.submitAuth = function () {
    if ($scope.isLogin) {
      AuthService.login($scope.authData)
        .then(function (res) {
          alert(res.data.message);
          $rootScope.loggedIn = true;
          $rootScope.showAuthModal = false;
          $scope.authData = {};
        })
        .catch(function (err) {
          alert(err.data.message || 'Login failed');
        });
    } else {
      AuthService.signup($scope.authData)
        .then(function (res) {
          alert(res.data.message);
          $scope.toggleAuthMode();
        })
        .catch(function (err) {
          alert(err.data.message || 'Signup failed');
        });
    }
  };

  $scope.deliveryFee = 20;
  $scope.taxRate = 0.1;

  FoodService.getFoods()
    .then(function (response) {
      $scope.foods = response.data;
    })
    .catch(function (error) {
      console.error('Error fetching foods:', error);
    });

  $scope.cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify($scope.cart));
  }

  $scope.addToCart = function (food) {
    if (!$rootScope.loggedIn) {
      alert('Please login to add items to your cart.');
      $scope.openAuth();
      return;
    }

    const found = $scope.cart.find((item) => item._id === food._id);
    if (found) {
      found.quantity += 1;
    } else {
      $scope.cart.push({ ...food, quantity: 1 });
    }
    saveCart();
  };

  $scope.increaseQty = function (item) {
    item.quantity++;
    saveCart();
  };

  $scope.decreaseQty = function (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      $scope.removeFromCart(item);
    }
    saveCart();
  };

  $scope.removeFromCart = function (item) {
    const index = $scope.cart.indexOf(item);
    if (index !== -1) {
      $scope.cart.splice(index, 1);
    }
    saveCart();
  };

  $scope.getSubtotal = function () {
    let total = 0;
    $scope.cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  $scope.getTax = function () {
    return ($scope.getSubtotal() * $scope.taxRate).toFixed(2);
  };

  $scope.getTotal = function () {
    return (parseFloat($scope.getSubtotal()) + parseFloat($scope.deliveryFee) + parseFloat($scope.getTax())).toFixed(2);
  };

  $scope.checkout = function () {
    if (!$rootScope.loggedIn) {
      alert('Please login to place an order.');
      return;
    }

    const orderData = {
      items: $scope.cart,
      total: $scope.getTotal(),
    };

    AuthService.placeOrder(orderData)
      .then(function (res) {
        alert('✅ Thank you for your order!\nYour total is ₹' + orderData.total);
        $scope.cart = [];
        $scope.showCart = false;
        localStorage.removeItem('cart');
        saveCart();
      })
      .catch(function (err) {
        console.error('Order error:', err);
        alert('Failed to place order');
      });
  };

  $scope.toggleCart = function () {
    if (!$rootScope.loggedIn) {
      alert('Please login to view your cart.');
      $scope.openAuth();
      return;
    }
    $scope.showCart = !$scope.showCart;
    $scope.showProfile = false;
    $scope.showAdmin = false;
    $scope.showFavorites = false;
    $scope.showHome = false;
    $scope.showTrack = false;
  };

  $scope.selectFood = function (food) {
    $scope.selectedFood = food;
    $scope.popupVisible = true;
  };

  $scope.closePopup = function () {
    $scope.selectedFood = null;
    $scope.popupVisible = false;
  };

  $scope.reviews = [];
  $scope.newReview = {
    rating: 5,
    comment: '',
  };

  $scope.selectFood = function (food) {
    $scope.selectedFood = food;
    $scope.popupVisible = true;
    $scope.loadReviews(food._id);
  };

  $scope.loadReviews = function (foodId) {
    FoodService.getReviews(foodId).then(function (res) {
      $scope.reviews = res.data;
    });
  };

  $scope.submitReview = function () {
    if (!$scope.newReview.rating || !$scope.newReview.comment) {
      alert('Please add a rating and a comment');
      return;
    }

    FoodService.addReview($scope.selectedFood._id, $scope.newReview)
      .then(function () {
        alert('Review submitted!');
        $scope.newReview = { rating: 5, comment: '' };
        $scope.loadReviews($scope.selectedFood._id);
      })
      .catch(function (err) {
        alert(err.data.message || 'Error submitting review');
      });
  };

  $scope.getAverageRating = function () {
    if ($scope.reviews.length === 0) return 0;
    const total = $scope.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / $scope.reviews.length;
  };

  $scope.reviewingItem = null;
  $scope.newReview = { rating: 5, comment: '' };
  $scope.reviewingItemId = null;

  $scope.startReview = function (item) {
    $scope.reviewingItemId = item._id;
    $scope.newReview = { rating: 5, comment: '' };
  };

  $scope.cancelReview = function () {
    $scope.reviewingItemId = null;
    $scope.newReview = { rating: 5, comment: '' };
  };

  $scope.submitReviewFromHistory = function (item) {
    if (!$scope.newReview.comment) {
      alert('Please write a comment.');
      return;
    }

    FoodService.addReview(item._id, $scope.newReview)
      .then(function () {
        alert('Review submitted!');
        $scope.cancelReview();
      })
      .catch(function (err) {
        console.error(err);
        alert(err.data.message || 'Error submitting review');
      });
  };

  $scope.showAdmin = false;
  $scope.adminTab = 'users';

  $rootScope.goToAdmin = function () {
    $scope.showAdmin = true;
    $scope.showHome = false;
    $scope.showProfile = false;
    $scope.showCart = false;
    $scope.showFavorites = false;
    $scope.popupVisible = false;
    $scope.showTrack = false;

    $scope.loadAdminData();
    $scope.loadRestaurantRequests();
  };

  $scope.adminUsers = [];
  $scope.adminFoods = [];
  $scope.adminOrders = [];

  $scope.loadAdminData = function () {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    $http.get('http://localhost:3000/api/admin/users', config).then((res) => {
      $scope.adminUsers = res.data;
    });

    $http.get('http://localhost:3000/api/admin/foods', config).then((res) => {
      $scope.adminFoods = res.data;
    });

    $http.get('http://localhost:3000/api/admin/orders', config).then((res) => {
      $scope.adminOrders = res.data;
    });
  };

  $scope.adminSearchText = '';
  $scope.adminFilterStatus = '';
  $scope.sortBy = 'createdAt';
  $scope.sortOrder = 'desc';

  $scope.filteredAdminOrders = function () {
    let filtered = $scope.adminOrders;

    const search = $scope.adminSearchText?.toLowerCase() || '';
    const statusFilter = $scope.adminFilterStatus;

    if (search) {
      filtered = filtered.filter(
        (order) =>
          (order.items || []).some((item) => item.name?.toLowerCase().includes(search)) ||
          order.username?.toLowerCase().includes(search) ||
          order.userEmail?.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => $scope.getDynamicStatus(order) === statusFilter);
    }

    filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt);
      const timeB = new Date(b.createdAt);
      return $scope.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return filtered;
  };

  $scope.changeOrderStatus = function (order) {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
    $http
      .put(`http://localhost:3000/api/admin/orders/${order._id}/status`, { status: order.status }, config)
      .then(() => {
        alert('Order status updated');
      })
      .catch((err) => {
        console.error('Failed to update status:', err);
        alert('Failed to update order status');
      });
  };

  $scope.exportToCSV = function () {
    let csv = 'User,Total,Status,Date\n';
    $scope.filteredAdminOrders().forEach((order) => {
      csv += `${order.username || 'Guest'},₹${order.total},${order.status},${new Date(order.createdAt).toLocaleString()}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  };

  $scope.getDynamicStatus = function (order) {
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const minutes = Math.floor((now - createdAt) / 60000);

    if (order.status === 'Cancelled') return 'Cancelled';
    if (minutes >= 30) return 'Delivered';
    if (minutes >= 15) return 'Out for delivery';
    if (minutes >= 5) return 'Preparing';
    return 'Pending';
  };

  $scope.showTrack = false;
  $scope.myOrders = [];

  $rootScope.goToTrack = function () {
    $scope.showHome = false;
    $scope.showProfile = false;
    $scope.showFavorites = false;
    $scope.showCart = false;
    $scope.showAdmin = false;
    $scope.showTrack = true;

    AuthService.getMyOrders().then((res) => {
      $scope.myOrders = res.data;
    });
  };

  $scope.orderFilterStatus = '';
  $scope.orderSearchText = '';

  $scope.filteredOrders = function () {
    return $scope.myOrders.filter((order) => {
      const dynamicStatus = $scope.getDynamicStatus(order);

      const matchesStatus = !$scope.orderFilterStatus || dynamicStatus === $scope.orderFilterStatus;
      const matchesSearch =
        !$scope.orderSearchText ||
        order.items.some((item) => item.name.toLowerCase().includes($scope.orderSearchText.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  };

  $scope.getDynamicStatus = function (order) {
    if (order.status === 'Cancelled') return 'Cancelled';

    const created = new Date(order.createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - created) / 60000);

    if (diffMinutes >= 30) return 'Delivered';
    else if (diffMinutes >= 20) return 'Out for delivery';
    else if (diffMinutes >= 10) return 'Preparing';
    else return 'Pending';
  };

  $scope.cancelOrder = function (orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
      AuthService.cancelOrder(orderId)
        .then(() => {
          alert('Order cancelled.');
          $rootScope.goToTrack();
        })
        .catch((err) => {
          console.error('Cancel error:', err);
          alert('Could not cancel order.');
        });
    }
  };

  $scope.openRestaurantRegister = function () {
    $scope.restaurantData = {};
    $scope.showRestaurantModal = true;
  };

  $scope.submitRestaurantRegistration = function () {
    if (!$scope.restaurantData.password || $scope.restaurantData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    $http
      .post('http://localhost:3000/api/auth/restaurant-register', $scope.restaurantData)
      .then(function (res) {
        alert(res.data.message);
        $scope.showRestaurantModal = false;
      })
      .catch(function (err) {
        alert(err.data.message || 'Registration failed');
      });
  };

  $scope.restaurantRequests = [];

  $scope.loadRestaurantRequests = function () {
    const token = localStorage.getItem('token');

    $http
      .get('http://localhost:3000/api/admin/restaurant-requests', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (res) {
        $scope.restaurantRequests = res.data;
      })
      .catch(function (err) {
        console.error('❌ Failed to load restaurant requests:', err);
        $scope.restaurantRequests = [];
      });
  };

  $scope.approveRestaurant = function (id) {
    const token = localStorage.getItem('token');
    $http
      .put(
        `http://localhost:3000/api/admin/approve-restaurant/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function () {
        alert('✅ Restaurant approved');
        $scope.loadRestaurantRequests();
        $scope.loadAdminData();
      })
      .catch(function (err) {
        alert('Error approving restaurant');
      });
  };

  $scope.rejectRestaurant = function (id) {
    const token = localStorage.getItem('token');
    $http
      .delete(`http://localhost:3000/api/admin/reject-restaurant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function () {
        alert('❌ Restaurant rejected');
        $scope.loadRestaurantRequests();
      })
      .catch(function (err) {
        alert('Error rejecting restaurant');
      });
  };

  $scope.showRestaurantDashboard = false;
  $scope.restaurantFoods = [];
  $scope.foodForm = {};
  $scope.editingFood = null;

  const API_URL = 'http://localhost:3000/api/restaurant';
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  $rootScope.showRestaurantDashboardPage = function () {
    $scope.showHome = false;
    $scope.showProfile = false;
    $scope.showCart = false;
    $scope.showRestaurantDashboard = true;
    $scope.loadRestaurantFoods();
  };

  $scope.loadRestaurantFoods = function () {
    $http
      .get(`${API_URL}/my-foods`, config)
      .then(function (res) {
        $scope.restaurantFoods = res.data;
      })
      .catch(function (err) {
        console.error('Error loading restaurant foods:', err);
      });
  };

  $scope.addOrUpdateFood = function () {
    if ($scope.editingFood) {
      $http
        .put(`${API_URL}/my-foods/${$scope.editingFood._id}`, $scope.foodForm, config)
        .then(function (res) {
          alert('Food updated successfully');
          $scope.loadRestaurantFoods();
          $scope.cancelEditFood();
        })
        .catch(function (err) {
          alert('Failed to update food');
        });
    } else {
      $http
        .post(`${API_URL}/my-foods`, $scope.foodForm, config)
        .then(function (res) {
          alert('Food added successfully');
          $scope.foodForm = {};
          $scope.loadRestaurantFoods();
        })
        .catch(function (err) {
          alert('Failed to add food');
        });
    }
    $scope.loadRestaurantFoods();
  };

  $scope.editFood = function (food) {
    $scope.editingFood = food;
    $scope.foodForm = angular.copy(food);
  };

  $scope.cancelEditFood = function () {
    $scope.editingFood = null;
    $scope.foodForm = {};
  };

  $scope.deleteFood = function (id) {
    if (confirm('Are you sure you want to delete this item?')) {
      $http
        .delete(`${API_URL}/my-foods/${id}`, config)
        .then(function () {
          alert('Deleted successfully');
          $scope.loadRestaurantFoods();
        })
        .catch(function () {
          alert('Failed to delete item');
        });
    }
  };
});
