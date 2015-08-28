angular.module('blast').service('utils', function () {
	var utils = this
	utils.rand = function(num) {
    return Math.round(Math.random() * num);
  }
})
