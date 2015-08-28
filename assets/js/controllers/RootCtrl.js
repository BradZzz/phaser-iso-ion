angular.module('blast').controller('RootCtrl', function (
  $rootScope, $state, $stateParams, $timeout, cfpLoadingBar)
{
  $rootScope.safeApply = function (fn) {
    var $root = this.$root
    if (!$root) return fn()

    var phase = $root.$$phase
    if (phase === '$apply' || phase === '$digest') {
      if (fn && typeof(fn) === 'function') fn()
    } else {
      this.$apply(fn)
    }
  }

  // Returns the version of Internet Explorer
  function getIsIE () {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf("MSIE ")

    return (msie > 0 || !!ua.match(/Trident.*rv\:11\./))
  }

  var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  $rootScope.$state       = $state
  $rootScope.$stateParams = $stateParams
  $rootScope.isMobile     = window.SESH_IS_MOBILE || isMobile
  $rootScope.isIframe     = (window.parent !== window.top)
  $rootScope.isIOS        = $rootScope.isMobile && (/iPhone|iPad|iPod/i.test(navigator.userAgent))
  $rootScope.isIE         = getIsIE()
  $rootScope.isChromeIOS  = $rootScope.isMobile && navigator.userAgent.match('CriOS')
  $rootScope.location     = location

  $rootScope.cacheBust    = location.hostname + '2'
  $rootScope.category     = window.SESH_CATEGORY

  var loadingTimeoutP = null
  function cancelLoadingTimeout () {
    if (loadingTimeoutP) {
      $timeout.cancel(loadingTimeoutP)
      loadingTimeoutP = null
    }
  }

  $rootScope.$on('cfpLoadingBar:started', function () {
    cancelLoadingTimeout()
    loadingTimeoutP = $timeout(function () {
      cfpLoadingBar.complete()
      cancelLoadingTimeout()
    }, 8000)
  })

  $rootScope.$on('cfpLoadingBar:complete', function () {
    cancelLoadingTimeout()
  })
});
