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

var app = angular.module('blast', modules)

app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/")

  $stateProvider

    // ------------------------------------------------------------------------
    // CMS
    // ------------------------------------------------------------------------

    .state('gallery', {
      url: "/",
      templateUrl: "/assets/html/gallery.html",
      controller: "GalleryCtrl"
    })
    .state('legal', {
      url: "/legal",
      templateUrl: "/assets/html/legal.html",
      controller: "LegalCtrl"
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
    .state('cast', {
      url: "/cast",
      templateUrl: "/assets/html/cast/cast.html",
      controller: "MediaCtrl"
    })
    .state('mpl', {
      url: "/mpl",
      templateUrl: "/assets/html/cast/mpl.html"
    })
    .state('category', {
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
    })

  $locationProvider.html5Mode(true)
})

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
