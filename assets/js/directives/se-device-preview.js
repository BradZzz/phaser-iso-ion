angular.module('blast').directive('seDevicePreview', function ($rootScope, $http, $timeout) {
  return {
    restrict: 'E',
    templateUrl: '/assets/html/se-device-preview.html',
    scope: {
      category: '@'
    },
    link: function ($scope) {
      var ANIMATION_INTERVAL = 5000
      var PAGE_LIMIT = 25

      var loadedAllMessages = false
      var messages = []
      $scope.messages = [ ]

      function loadMoreMessages () {
        if (loadedAllMessages) return

        return $http({
          url: '/api/v1/messages',
          method: 'GET',
          params: {
            category: $scope.category,
            offset: $scope.messages.length,
            limit: PAGE_LIMIT
          }
        }).then(function (response) {
          var data = response.data

          if (data && data.length) {
            data.forEach(function (message) {
              if (message.media) {
                message.media = message.media.replace('http://', 'https://')
              }
            })

            messages = messages.concat(data)

            loadedAllMessages = (data.length < PAGE_LIMIT)
          } else {
            loadedAllMessages = true
          }
        })
      }

      function loadNextMessage () {
        if ($scope.messages.length < messages.length) {
          $rootScope.safeApply(function () {
            $scope.messages.push(messages[$scope.messages.length])
          })

          $timeout(loadNextMessage, ANIMATION_INTERVAL)
        } else if (loadedAllMessages) {
          $scope.messages = []

          if (messages.length > 0) {
            $timeout(loadNextMessage)
          }
        } else {
          loadMoreMessages()
            .then(loadNextMessage)
            .catch(function (err) {
              console.error("error loading preview messages", err)

              if (messages.length >= 10) {
                loadedAllMessages = true
                $timeout(loadNextMessage)
              }
            })
        }
      }

      loadNextMessage()
    }
  }
});
