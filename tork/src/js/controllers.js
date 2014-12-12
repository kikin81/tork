var ignoredFields = ['Latitude', 'Longitude', 'GPS Time', 'Device Time'];
app.filter('invisibleFields', function() {
    return function(input) {
        var output = {};
        angular.forEach(input, function(value, key) {
            if (ignoredFields.indexOf(value) === -1) {
                output[key] = value;
            }
        });
        return output;
    };
});

function parseData(timescale, scope) {
    var parsedData = {};
    var lastCoord = [];
    var isFirst = true;
    angular.forEach(scope.wireData, function(row, key) {
        if (angular.isDefined(row.serialData)) {
            try {
                var item = angular.fromJson(row.serialData);
            } catch (err) {
                console.log('Error parsing ' + key + 'err: ' + err);
            }
            if (item && angular.isDefined(item[scope.fkeys['Device Time']]) && angular.isDefined(item[scope.fkeys['Latitude']])) {
                var day = item[scope.fkeys['Device Time']].split(' ')[0].split('-');
                var time = item[scope.fkeys['Device Time']].split(' ')[1].split('.');
                var t = time[0];
                var ms = time[1]
                var y = day[2];
                var m = day[1];
                var d = day[0]
                var date = new Date('' + m + ' ' + d + ', '+ y + ' ' + t);
                date.setMilliseconds(ms);
                delete item[scope.fkeys['Device Time']]
                var lat = parseFloat(item[scope.fkeys['Latitude']]);
                delete item[scope.fkeys['Latitude']];
                if (isNaN(lat)) return;
                var lng = parseFloat(item[scope.fkeys['Longitude']]);
                item[scope.fkeys['Longitude']]
                if (isFirst) {
                    isFirst = false;
                } else {
                    if (lastCoord[0] === lat && lastCoord[1] === lng) return;
                }
                parsedData[row.id] = {
                    Time: date,
                    Longitude: lng,
                    Latitude: lat
                };
                timescale.push(date);
                for (var fk in item) {
                    try {
                        parsedData[row.id][scope.selectableFields[fk]] = parseFloat(item[fk]);
                    } catch (err) {
                        console.log('Could not parse ' + item[fk]);
                    }
                }
                lastCoord = [lat, lng];
            }
        }
    });
    return parsedData;
}

app.controller('CarSessionCtrl', ['$scope', '$routeParams', 'SessionsService', 'StaticFieldsService',
    function($scope, $routeParams, SessionsService, StaticFieldsService) {
        $scope.session = {
            car: 'Subaru BRZ',
            id: $routeParams.session,
            date: new Date('2/17/14')
        }
        $scope.selection = ['Speed (OBD)'];
        $scope.lineGroup = {};
        $scope.SelectedFields = function(field) {
            var index = $scope.selection.indexOf(field);
            if (index > -1) {
                $scope.selection.splice(index, 1);
            } else {
                $scope.selection.push(field);
            }
            // console.log($scope.selection);
        }
        $scope.selectableFields = {};
        $scope.staticFieldsMap = StaticFieldsService.get({}, function() {
            $scope.wireData = SessionsService.get({
                sessionId: $routeParams.session
            }, function() {
                var lastRow = JSON.parse($scope.wireData[$scope.wireData.length - 1].serialData);
                $scope.fkeys = {};
                angular.forEach(lastRow, function(v, key) {
                    if (angular.isDefined($scope.staticFieldsMap[key])) {
                        $scope.selectableFields[key] = $scope.staticFieldsMap[key];
                        $scope.fkeys[$scope.staticFieldsMap[key]] = key;
                    }
                });
                var timearr = [];
                $scope.data = parseData(timearr, $scope);
                $scope.timeScale = timearr.sort(function(a, b) {
                        return a - b;
                    });
                $scope.session = {
                    id: $scope.wireData[0].session,
                    date: new Date($scope.wireData[0].timestamp),
                    car: $scope.wireData[0].profileName
                }
            });
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