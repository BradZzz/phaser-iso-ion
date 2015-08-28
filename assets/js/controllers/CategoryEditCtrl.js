angular.module('blast').controller('CategoryEditCtrl', function (
  $scope, $http, $timeout, $mdDialog, category, flash)
{
  $scope.category = category

  var PAGE_LIMIT = 25
  var messages = { }

  $scope.messages = [ ]
  $scope.loaded = false

  function loadMoreMessages () {
    if ($scope.loaded) return

    return $http({
      url: '/api/v1/messages',
      method: 'GET',
      params: {
        category: $scope.category.slug,
        offset: $scope.messages.length,
        limit: PAGE_LIMIT,
        sort: 'created'
      }
    }).then(function (response) {
      var data = response.data

      if (data && data.length) {
        data.forEach(function (message) {
          if (message.media) {
            message.media = message.media.replace('http://', 'https://')
          }

          messages[message._id] = deepCopy(message)
        })

        $scope.safeApply(function () {
          $scope.messages = $scope.messages.concat(data)

          $scope.loaded = (data.length < PAGE_LIMIT)
        })
      } else {
        $scope.safeApply(function () {
          $scope.loaded = true
        })
      }

      if (!$scope.loaded) {
        $timeout(loadMoreMessages)
      }
    }, function (err) {
      console.error("error loading messages", err)
      flash.error = "error loading messages"
    })
  }

  loadMoreMessages()

  $scope.$on('img:delete', function (event, id) {
    function deleteMessage (message, index) {
      $http({
        url: '/api/v1/messages',
        method: 'DELETE',
        params: {
          id: message._id,
          category: message.category
        }
      }).then(function () {
        $scope.safeApply(function () {
          $scope.messages.splice(index, 1)
        })
        flash.success = "deleted message"
      }, function (err) {
        console.error("error deleting message", message, err)
        flash.error = "error deleting message"
      })
    }

    for (var i = 0; i < $scope.messages.length; ++i) {
      var message = $scope.messages[i]

      if (message._id === id) {
        return deleteMessage(message, i)
      }
    }

    console.error("unable to find image to delete")
  })

  $scope.onMessageBlur = function (message) {
    var saved = messages[message._id]

    if (!_.isEqual(saved, message)) {
      $http.post('/api/v1/messages', {
        message: message
      }).then(function () {
        messages[message._id] = deepCopy(message)
        flash.success = "saved message"
      }, function (err) {
        console.error("error saving message", message, err)
        flash.error = "error saving message"
      })
    }
  }

  $scope.onAddMessage = function () {
    return $mdDialog.show({
      controller: 'CategoryAddMessageCtrl',
      templateUrl: '/assets/html/se-add-message-dialog.html',
      targetEvent: event,
      clickOutsideToClose: true,
      escapeToClose: true
    }).then(function (message) {
      message.category = category.slug

      $http.post('/api/v1/messages', {
        message: message
      }).then(function (response) {
        var message = response.data
        messages[message._id] = deepCopy(message)

        $scope.safeApply(function () {
          $scope.messages = [ message ].concat($scope.messages)
        })

        flash.success = "created message"
      }, function (err) {
        console.error("error saving message", message, err)
        flash.error = "error saving message"
      })

    })
  }

  function deepCopy (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
});
