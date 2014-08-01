'use strict';

require.config({
	baseUrl: '/static/',
	paths: {
		angular: 'angular/angular',
		angularRoute: 'angular-route/angular-route',
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular']
	},
	priority: [
		"angular"
	]
});

require( ['angular','app'], function(angular, app) {
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
		angular.bootstrap([app['name']]);
	});
});