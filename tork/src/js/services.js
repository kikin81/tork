
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
app.factory('SessionsService', ['$resource',
    function($resource){
        return $resource('app/api/v1/sessions/:sessionId',{},{
            get: {method:'GET', params:{}, isArray:true}
        });
    }
]);