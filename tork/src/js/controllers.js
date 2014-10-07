app.controller('CarSessionCtrl', ['$scope', 'SessionsService',
    function($scope, SessionsService) {
        $scope.car = 'Subaru BRZ';
        $scope.id = '1010101';
        $scope.date = '2-17-14';
        $scope.fields = ['Speed', 'Throttle', 'Pressure', 'GPS', 'Intake Air Temperature(°F)', 'Trip Distance(miles)', 'Latitude', 'Longitude'];
        var baseTime = new Date('8/23/14 20:09:52.657');
        var baseLat = 36.67668729;
        var baseLng = -121.8079816;
        var baseSpeed = 68.35;
        $scope.rawData = SessionsService.get({
            sessionId: '01010101'
        }, function() {
            var parsedData = {};
            for (s in $scope.rawData) {
                try {
                    var item = JSON.parse($scope.rawData[s].serialData);
                } catch (err) {
                    console.log('Error parsing ' + s + ' err=' + err);
                    continue;
                }
                if (item) {
                    var date = new Date(item["k65"]);
                    if (isNaN(date.getTime())) continue;
                    parsedData[date] = {
                        'Longitude': parseFloat(item["kff1005"]),
                        'Latitude': parseFloat(item["kff1006"]),
                        'Speed': parseFloat(item["kd"])
                    };
                }
            }
            $scope.data = parsedData;
        });
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