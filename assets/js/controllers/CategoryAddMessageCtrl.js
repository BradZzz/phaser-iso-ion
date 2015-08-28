angular.module('blast').controller('CategoryAddMessageCtrl', function (
  $scope, $mdDialog)
{
  $scope.message = {
    media: ""
  }

  $scope.onSave = function () {
    $mdDialog.hide($scope.message)
  }

  $scope.onCancel = function () {
    $mdDialog.cancel()
  }
})
