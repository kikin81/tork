app.controller('CarSessionCtrl', ['$scope',
    function($scope) {
        $scope.car = 'Subaru BRZ';
        $scope.id = '1010101';
        $scope.date = '2-17-14';
        $scope.fields = ['Speed', 'Throttle', 'Pressure', 'GPS', 'Intake Air Temperature(°F)', 'Trip Distance(miles)', 'Latitude'];
        $scope.data = {};
        var baseTime = new Date('8/23/14 20:09:52.657');
        var baseLat = 36.67668729;
        var baseLng = -121.8079816;
        var baseSpeed = 68.35;
        for (i = 0; i < 25; i++) {
            var time = new Date(baseTime.getTime() + (1000 * 60 * i));
            var lat = baseLat - ((Math.random() * i) / 10000);
            baseLat = lat;
            var lng = baseLng + ((Math.random() * i) / 10000);
            baseLng = lng;
            var adjSpd = Math.random() * 2 * i;
            var speed = adjSpd % 2 == 0 ? baseSpeed - adjSpd : baseSpeed + adjSpd;
            $scope.data[time.toJSON()] = {
                'Longitude': lng,
                'Latitude': lat,
                'Speed': speed
            };
        }
        return;
    }
]);
app.controller('TripListCtrl', ['$scope',
    function($scope) {
        $scope.trips = {
            1: {
                id: 0,
                date: '28-Jul-2014 17:10',
                vehicle: 'wrx',
                readings: 748

            },
            2: {
                id: 1,
                date: '29-Jul-2014 7:11',
                vehicle: 'wrx',
                readings: 78
            },
            3: {
                id: 2,
                date: '30-Jul-2014 2:15',
                vehicle: 'wrx',
                readings: 438
            }
        }
        return;
    }
]);