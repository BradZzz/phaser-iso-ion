angular.module('blast').service('seStripe', function ($q) {
  var stripePublicKey = SESH_STRIPE_PUBLIC_KEY || 'pk_test_4cLFOjsRBzvTq1Q87Ki4Ko18'
  Stripe.setPublishableKey(stripePublicKey)

  this.createToken = function (params) {
    var resultD = $q.defer()

    Stripe.card.createToken(params, function (status, response) {
       if (response.error) {
         resultD.reject(response.error.message)
       } else {
         resultD.resolve(response.id)
       }
    })

    return resultD.promise
  }
});
