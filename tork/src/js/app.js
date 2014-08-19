var app = angular.module('TorkAngApp', []);

// app.controller('MapsCtrl', ['$scope',
//     function($scope) {
//         $scope.map = new google.maps.Map($("#map-canvas"), {
//             zoom: 8,
//             center: new google.maps.LatLng(-34.397, 150.644)
//         });
//         return $scope.$apply();
//     }
// ]);

// app.factory('gMaps', function() {
//     var api_key = 'AIzaSyCtIcjKwvmWhqachVHYtL7usv9X2QnH_AA';
//     var mapsService = {};
//     return mapsService;
// });

app.directive('googleMap', function() {
    return {
        restrict: 'EA',
        scope: {},
        link: function(scope, elem, attrs) {
            var mapOptions,
                latitude = attrs.latitude,
                longitude = attrs.longitude,
                map;

            latitude = latitude && parseFloat(latitude, 10) || 43.074688;
            longitude = longitude && parseFloat(longitude, 10) || -89.384294;

            mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(latitude, longitude)
            };

            scope.map = new google.maps.Map(elem[0], mapOptions);
        }
    }
});
app.directive('d3Plot', function() {
    return {
        restrict: 'EA',
        scope: {},
        link: function(scope, elem, attrs) {
            scope.plot = d3.select(elem[0]).selectAll("div")
            .data([4, 8, 15, 16, 23, 42]).enter()
            .append("div").style("width",'0%')
            .transition().duration(3 * 1000).delay(function(d, i) { return i * 100; })
            .style("width", function(d) { return d * 10 + "px"; })
            .text(function(d) { return d; });
        }
    }
});