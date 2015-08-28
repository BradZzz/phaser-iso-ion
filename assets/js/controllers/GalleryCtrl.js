angular.module('blast').controller('GalleryCtrl', function (
  $scope, $http, $timeout, flash)
{
  var PAGE_LIMIT = 100
  $scope.categories = []

  $http({
    url: '/api/v1/categories',
    method: 'GET',
    params: {
      offset: $scope.categories.length,
      limit: PAGE_LIMIT
    }
  }).then(function (response) {
    var results = _.filter(response.data, function (category) {
      category.messages = _.filter(category.messages || [], function (message) {
        if (message.media) {
          message.media = message.media.replace('http:', 'https:')
        }
        return message.media
      })

      category.frontOffset = 0
      category.backOffset  = 1
      category.flipped = false
      category.timeout = null
      category.flipping = false
      category.flip = function () {
        if (category.timeout) {
          $timeout.cancel(category.timeout)
        }
        //if (category.flipping) {
        //  completeFlip(category, false)
        //}

        flip(category)
      }

      return category.messages.length
    })

    results.forEach(scheduleFlip)

    $scope.safeApply(function () {
      $scope.categories = $scope.categories.concat(results)
    })
  }, function (err) {
    console.error("error fetching categories", err)
    flash.error = "error loading categories"
  })

  function scheduleFlip (category) {
    if (category.timeout) return

    category.timeout = $timeout(function () {
      flip(category)
    }, (2000 + Math.random() * 20000) | 0)
  }

  function flip (category) {
    category.timeout = null
    if (category.flipping) return

    $scope.safeApply(function () {
      category.flipping = true
      category.flipped  = !category.flipped
    })

    $timeout(function () {
      completeFlip(category, true)
    }, 610)
  }

  function completeFlip (category, schedule) {
    $scope.safeApply(function () {
      category.flipping = false

      if (category.flipped) {
        category.frontOffset = category.backOffset + 1
      } else {
        category.backOffset  = category.frontOffset + 1
      }
    })

    if (schedule) {
      scheduleFlip(category)
    }
  }
});
