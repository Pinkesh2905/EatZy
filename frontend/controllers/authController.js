app.controller('AuthController', function ($scope, $rootScope, AuthService) {
  $rootScope.showAuthModal = false;
  $scope.isLogin = true;
  $scope.authData = {};
  $rootScope.loggedIn = !!localStorage.getItem('token');

  $rootScope.logout = function () {
    localStorage.removeItem('token');
    $rootScope.loggedIn = false;
    alert('Logged out!');
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
          localStorage.setItem('token', res.data.token);
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
});
