var app = angular.module('TorkAngApp', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: 'static/partials/session-list.html'
            // controller: 'PhoneListCtrl'
        }).
        when('/item/:itemId', {
            templateUrl: 'static/partials/item-view.html',
            controller: 'CarSessionCtrl'
        }).
        otherwise({
            redirectTo: '/item/0'
        });
    }
]);

app.factory('gMapsService', ['$document', '$q', '$rootScope', '$window',
    function($document, $q, $rootScope, $window) {
        if ($window.google && $window.google.maps) {
            console.log('gmaps already loaded');
            return;
        }
        var d = $q.defer();
        $window.mapsReady = function() {
            d.resolve();
        };

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'http://maps.google.com/maps/api/js?callback=mapsReady';

        $document[0].getElementsByTagName('body')[0].appendChild(scriptTag);

        return d.promise;
    }
]);

app.directive('googleMap', ['gMapsService',
    function(gMapsService) {
        return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                gMapsService.then(function() {
                    var mapOptions,
                        latitude = attrs.latitude,
                        longitude = attrs.longitude;

                    latitude = latitude && parseFloat(latitude, 10) || 37.0000;
                    longitude = longitude && parseFloat(longitude, 10) || -120.0000;

                    mapOptions = {
                        zoom: 8,
                        center: new google.maps.LatLng(latitude, longitude)
                    };

                    scope.map = new google.maps.Map(elem[0], mapOptions);
                    for(marker in scope.markers){
                        var m = new google.maps.Marker({
                            position: new google.maps.LatLng(scope.markers[marker].Latitude,scope.markers[marker].Longitude),
                            map: scope.map
                        });
                    }
                });
            }
        }
    }
]);

app.directive('d3Plot', function() {
    return {
        restrict: 'EA',
        scope: {},
        link: function(scope, elem, attrs) {
            scope.plot = d3.select(elem[0]).selectAll("div")
                .data([4, 8, 15, 16, 23, 42]).enter()
                .append("div").style("width", '0%')
                .transition().duration(3 * 1000).delay(function(d, i) {
                    return i * 100;
                })
                .style("width", function(d) {
                    return d * 10 + "px";
                })
                .text(function(d) {
                    return d;
                });
        }
    }
});

app.controller('CarSessionCtrl', ['$scope', function($scope) {
    $scope.car = 'Subaru BRZ';
    $scope.id = '1010101';
    $scope.day = '2-17-14';

    $scope.markers = {
        '8/23/14 20:09:52.657' : {
            "Longitude": "-121.8079816",
            "Latitude": "36.67668729"
        },
        "8/23/14 20:10:22.651" : {
            "Longitude": "-121.8078618",
            "Latitude": "36.67685146"
        },
        '8/23/14 20:10:40.628' : {
            "Longitude" : "-121.8082655",
            "Latitude" : "36.68984398"
        }
    }
    return;
}]);