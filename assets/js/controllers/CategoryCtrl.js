angular.module('blast').controller('CategoryCtrl', function (
  $scope, $http, category, seStripe, flash)
{
  $scope.category = category

  $('html, body').animate({ scrollTop: 0 }, 300)

  $scope.order = {
    toNumber: null,
    fromName: null,
    hasCustomMessage: false,
    customMessage: "",
    size: 12,
    interval: 15 * 60
  }

  $scope.billing = {
    cardNumber: "",
    cardType: null,
    cvc: "",
    expMonth: "",
    expYear: ""
  }

  $scope.orderTotal = function () {
    return $scope.config.sizeMap[$scope.order.size].price + ($scope.order.hasCustomMessage ? 0.50 : 0)
  }

  $scope.config = {
    sizes: [
      {
        title: 'Basic Blast',
        value: 5,
        price: 0.99
      },
      {
        title: 'Normal Blast',
        value: 12,
        price: 1.99
      },
      {
        title: 'Blast of Light',
        value: 30,
        price: 3.99
      },
      {
        title: 'Blast of Evil',
        value: 100,
        price: 9.99
      }
    ],

    intervals: [
      {
        title: '15 Minutes',
        value: 15 * 60,
        desc: 'Messages will be sent once every 15 minutes.'
      },
      {
        title: 'Hourly',
        value: 60 * 60,
        desc: 'Messages will be sent once per hour.'
      },
      {
        title: 'Daily',
        value: 15 * 60 * 60 * 24,
        desc: 'Messages will be sent once per day.'
      },
      {
        title: 'Blitz',
        value: 5,
        desc: 'All messages will be sent back to back (spammy - best for frenemies!).'
      }
    ],

    intervalMap: { },
    sizeMap: { }
  }

  $scope.config.sizes.forEach(function (size) {
    $scope.config.sizeMap[size.value] = size
  })

  $scope.config.intervals.forEach(function (interval) {
    $scope.config.intervalMap[interval.value] = interval
  })

  $scope.onPurchase = function () {
    //if (!$scope.isPurchaseReady()) return
    var price = $scope.orderTotal()

    seStripe.createToken({
      'number': sanitizeNumber($scope.billing.cardNumber),
      'cvc': sanitizeNumber($scope.billing.cvc),
      'exp_month': sanitizeNumber($scope.billing.expMonth),
      'exp_year': sanitizeNumber($scope.billing.expYear)
    }).then(function (token) {
      console.log("stripe token created successfully")

      var params = _.extend({
        platform: "browser",
        category: $scope.category.slug,
        price: Math.floor(price * 100),
        token: token,
        desc: "blast of " + $scope.order.size + " MMS messages"
      }, $scope.order)

      params.toNumber = sanitizeNumber(params.toNumber)

      $http.post('/api/v1/orders', params)
        .then(function () {
          flash.success = "Order placed successfully!"

          $scope.safeApply(function () {
            $scope.order.toNumber = ""
          })
        }, function (err) {
          console.error("error placing order", err)
          if (err.debug) {
            console.error(err.debug)
          }

          if (err.type === 'StripeCardError') {
            flash.error = "Error card has been declined"
          } else if (err.message) {
            flash.error = "Error " + err.message
          } else {
            flash.error = "Error placing order"
          }
        })
    }, function (err) {
      console.error("error creating stripe token", err)
      flash.error = err
    })
  }

  $scope.isPurchaseReady = function () {
    return validator.isMobilePhone(sanitizeNumber($scope.order.toNumber), 'en-US') &&
      $scope.order.fromName && $scope.order.fromName.length > 0 &&
      $scope.order.size &&
      $scope.order.interval &&
      $scope.purchaseForm.$valid
  }

  function sanitizeNumber (number) {
    return number ? number.toString().replace(' ', '').replace('-', '') : ""
  }
});
