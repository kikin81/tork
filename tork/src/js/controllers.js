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
            console.log($scope.selection);
        }
        $scope.fields = {};
        $scope.filteredFields = ['Latitude','Longitude','GPS Time', 'Device Time'];
        $scope.fieldData = StaticFieldsService.get({}, function() {
            $scope.wireData = SessionsService.get({
                sessionId: $routeParams.session
            }, function() {
                var dataRow = JSON.parse($scope.wireData[$scope.wireData.length - 1].serialData);
                var fields = {};
                var fkeys = {};
                angular.forEach(dataRow, function(v, k) {
                    if (angular.isDefined($scope.fieldData[k])) {
                        fields[k] = $scope.fieldData[k];
                        fkeys[$scope.fieldData[k]] = k;
                    }
                });
                $scope.fields = fields;

                var parsedData = {};
                var lastCoord = [];
                var isFirst = true;
                var timeScale = [];
                angular.forEach($scope.wireData, function(row, key) {
                    if (angular.isDefined(row.serialData)) {
                        try {
                            var item = angular.fromJson(row.serialData);
                        } catch (err) {
                            console.log('Error parsing ' + key + 'err: ' + err);
                        }
                        if (item && angular.isDefined(item['k65']) && angular.isDefined(item[fkeys['Latitude']])) {
                            var date = new Date(item["k65"]);
                            delete item["k65"]
                            var lat = parseFloat(item[fkeys['Latitude']]);
                            if(isNaN(lat)) return;
                            delete item[fkeys['Latitude']]
                            var lng = parseFloat(item[fkeys['Longitude']]);
                            delete item[fkeys['Longitude']]
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
                            timeScale.push(date);
                            for(var x in item){
                                try{
                                    parsedData[row.id][fields[x]] = parseFloat(item[x]);
                                } catch (err){
                                    console.log('Could not parse ' + item[x]);
                                }
                            }
                            lastCoord = [lat, lng];
                        }
                    }
                });

                timeScale.sort(function(a, b) {
                    return a - b;
                })
                $scope.timeScale = timeScale;
                $scope.session = {
                    id: $scope.wireData[0].session,
                    date: new Date($scope.wireData[0].timestamp),
                    car: $scope.wireData[0].profileName
                }
                $scope.data = parsedData;
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