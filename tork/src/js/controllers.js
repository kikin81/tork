app.controller('CarSessionCtrl', ['$scope', '$routeParams', 'SessionsService',
    function($scope, $routeParams, SessionsService) {
        $scope.session = {
            car: 'Subaru BRZ',
            id: $routeParams.session,
            date: new Date('2/17/14')
        }
        $scope.fields = ['Speed', 'Throttle', 'Pressure', 'GPS', 'Intake Air Temperature(°F)', 'Trip Distance(miles)', 'Latitude', 'Longitude'];
        $scope.rawData = SessionsService.get({
            sessionId: $routeParams.session
        }, function() {
            var parsedData = [];
            var lastCoord = [];
            var isFirst = true;
            angular.forEach($scope.rawData, function(row, key) {
                if (typeof(row.serialData) !== 'undefined') {
                    try {
                        var item = JSON.parse(row.serialData);
                    } catch (err) {
                        console.log('Error parsing ' + key + 'err: ' + err);
                    }
                    if (item) {
                        var date = new Date(item["k65"]);
                        var lat = parseFloat(item["kff1006"]);
                        var lng = parseFloat(item["kff1005"]);
                        var spd = parseFloat(item["kd"]);
                        if (!isNaN(date.getTime()) &&
                            !isNaN(lat) && !isNaN(lng) && !isNaN(spd)) {
                            if(isFirst){
                                isFirst = false;
                            } else {
                                if(lastCoord[0] === lat && lastCoord[1] === lng) return;
                            }
                            parsedData.push({id: row.id, Time: date,
                                Longitude: lng, Latitude: lat, Speed: spd });
                            lastCoord = [lat,lng];
                        }
                    }
                }
            });
            parsedData.sort(function(a, b) {
                return a.Time - b.Time;
            })
            $scope.session = {
                id: $scope.rawData[0].session,
                date: new Date($scope.rawData[0].timestamp),
                car: $scope.rawData[0].profileName
            }
            $scope.data = parsedData;
        });
        return;
    }
]);
app.controller('TripListCtrl', ['$scope', 'SessionListService',
    function($scope, SessionListService) {
        $scope.trips = SessionListService.get({}, function() {
            angular.forEach($scope.trips, function(trip) {
                trip.date = new Date(trip.timestamp);
            })
        });
        return;
    }
]);