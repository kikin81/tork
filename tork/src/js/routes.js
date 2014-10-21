var app = angular.module('TorkAngApp', ['ngRoute','ngResource']);
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: 'static/partials/session-list.html',
            controller: 'TripListCtrl'
        }).
        when('/upload', {
            templateUrl: 'static/partials/upload-template.html',
        }).
        when('/session/:session', {
            templateUrl: 'static/partials/item-view.html',
            controller: 'CarSessionCtrl'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }
]);
