var app = angular.module('TorkAngApp', ['ngRoute']);
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: 'static/partials/session-list.html',
            controller: 'TripListCtrl'
        }).
        when('/item/:itemId', {
            templateUrl: 'static/partials/item-view.html',
            controller: 'CarSessionCtrl'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }
]);
