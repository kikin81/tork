app.controller('CarSessionCtrl', ['$scope',
    function($scope) {
        $scope.car = 'Subaru BRZ';
        $scope.id = '1010101';
        $scope.date = '2-17-14';
        $scope.fields = ['Speed', 'Throttle', 'Pressure', 'GPS', 'Intake Air Temperature(°F)', 'Trip Distance(miles)', 'Latitude'];

        $scope.data = {
            '8/23/14 20:09:52.657': {
                "Longitude": "-121.8079816",
                "Latitude": "36.67668729",
                'Speed': '68.35083008'
            },
            "8/23/14 20:10:22.651": {
                "Longitude": "-121.8078618",
                "Latitude": "36.67685146",
                'Speed': '69.59357452'
            },
            '8/23/14 20:10:40.628': {
                "Longitude": "-121.8082655",
                "Latitude": "36.68984398",
                'Speed': '75.18591309'
            },
            '8/23/14 20:11:30.627': {
                'Longitude': '-121.8012311',
                'Latitude': '36.70291383',
                'Speed': '68.97220612'
            }
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