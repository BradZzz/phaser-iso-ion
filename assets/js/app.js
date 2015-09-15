/*! Angular application initialization */

var modules = [
  'ngAnimate',
  'ngMaterial',
  'ui.router',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'angular-loading-bar',
  'credit-cards',
  'ui.bootstrap'
]

var role = {
    'all' : 0,
    'user' : 1,
    'admin' : 2,
    'super' : 3,
}

var app = angular.module('blast', modules)

app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/")

  $stateProvider

    // ------------------------------------------------------------------------
    // CMS
    // ------------------------------------------------------------------------

    /*.state('gallery', {
      url: "/",
      templateUrl: "/assets/html/gallery.html",
      controller: "GalleryCtrl"
    })*/
    .state('home', {
      url: "/",
      templateUrl: "/assets/html/cast/cast-home.html",
      controller: "CastHomeCtrl",
      access: role['admin']
    })
    .state('home-channel', {
      templateUrl: "/assets/html/cast/cast-home-channel.html",
      controller: "CastHomeChannelCtrl",
      access: role['admin']
    })
    .state('home-edit', {
      templateUrl: "/assets/html/cast/cast-home-edit.html",
      controller: "CastHomeEditCtrl",
      access: role['admin']
    })
    .state('home-play', {
      templateUrl: "/assets/html/cast/cast-home-play.html",
      controller: "CastHomePlayCtrl",
      access: role['admin']
    })
    .state('login', {
      url: "/login",
      templateUrl: "/assets/html/cast/cast-home-login.html",
      controller: "CastHomeLoginCtrl",
      access: role['all']
    })
    .state('phaser-adventure', {
      url: "/phaser-adventure",
      templateUrl: "/assets/html/phaser/phaser-adventure.html",
      controller: "PhaserAdventureCtrl"
    })
    .state('phaser-battle', {
      url: "/phaser-battle",
      templateUrl: "/assets/html/phaser/phaser-battle.html",
      controller: "PhaserBattleCtrl"
    })
    /*.state('cast', {
      url: "/cast",
      templateUrl: "/assets/html/cast/cast.html",
      controller: "MediaCtrl"
    })
    .state('legal', {
      url: "/legal",
      templateUrl: "/assets/html/legal.html",
      controller: "LegalCtrl"
    })*/
    .state('mpl', {
      url: "/mpl",
      templateUrl: "/assets/html/cast/mpl.html"
    })
    /*.state('category', {
      abstract: true,
      url: "/{slug:[\\w-]+}",
      template: "<div ui-view></div>",
      resolve: {
        category: function ($state, $stateParams, $http, flash) {
          var slug = $stateParams.slug

          return $http({
            url: '/api/v1/category',
            method: 'GET',
            params: {
              slug: slug
            }
          }).then(function (response) {
            return response.data
          }, function (err) {
            console.error("error fetching category", slug, err)
            flash.error = "error fetching category " + slug
            $state.go('home.gallery')
          })
        }
      }
    })
    .state('category.view', {
      url: "",
      templateUrl: "/assets/html/category.html",
      controller: "CategoryCtrl"
    })
    .state('category.edit', {
      url: "/edit",
      templateUrl: "/assets/html/category-edit.html",
      controller: "CategoryEditCtrl"
    })*/

  $locationProvider.html5Mode(true)
})

app.run(function ($rootScope, $location, $http, flash) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log('$stateChangeStart')
    console.log('event',event)
    console.log('toState',toState)
    console.log('toParams',toParams)
    console.log('fromState',fromState)
    console.log('fromParams',fromParams)
    
    console.log($rootScope.auth)
    
    if (!$rootScope.auth) {
      $location.path('/login')
    } else {
      $http({
        url: '/api/v1/user/validate',
        method: "GET",
        params: $rootScope.auth,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        if (res.status === 200) {
          console.log('success')
          console.log(res)
          if (res.data.role < toState.access) {
            flash.error = "Cannot access elevated content"
            $state.go(fromState.name)
          }
        } else {
          flash.error = "Error creating user"
          console.log(res)
          $location.path('/login')
        }
      })
    }
  })
});

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange')
    .backgroundPalette('grey', {
      'default': '50',
      'hue-1': '100',
      'hue-2': '100',
      'hue-3': '200'
    })
});
