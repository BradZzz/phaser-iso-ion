angular.module('blast').controller('CastHomeLoginCtrl', function ($scope, $rootScope, $http, $window, $state, flash)
{
  $scope.params = {
      login: true
  }
  
  $scope.login = function(user){
    console.log(user)
    $http({
      url: '/api/v1/user/login',
      method: "GET",
      params: {
        'email' : user.email,
        'pass' : user.pass,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      console.log('success')
      console.log(res)
      $rootScope.auth = res.data
      $state.go('home')
    }, function(err){
      flash.error = "Error Authenticating"
      console.log(err)
    })
  }
  
  $scope.register = function(user){
    console.log(user)
    $http({
      url: '/api/v1/user/register',
      method: "POST",
      params: {
        'email' : user.email,
        'pass' : user.pass,
        'role' : '1',
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      console.log(res)
      flash.success = "User Created!"
      $scope.safeApply(function () {
        $scope.params.login = true
      })
    }, function(err){
      flash.error = "Error creating user"
      console.log(res)
    })
  }
})