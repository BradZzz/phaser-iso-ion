angular.module('blast').directive('seEditableImg', function (
  $rootScope)
{
  return {
    restrict: 'E',
    templateUrl: '/assets/html/se-editable-img.html',
    scope: {
      model: '=',
      id: '=',
      controlsStr: '@controls'
    },
    compile: function () {
      return {
        pre: function ($scope) {
          var controls = $scope.controlsStr.split(',')
          $scope.controls = { }

          controls.forEach(function (control) {
            $scope.controls[control] = true
          })
        },
        post: function ($scope, $element) {
          $scope.defaultImage = '/assets/img/img-placeholder.jpg'

          $scope.onDeleteImage = function () {
            $rootScope.safeApply(function () {
              delete $scope.model
            })

            $scope.$emit('img:delete', $scope.id)
          }
        }
      }
    }
  }
})
