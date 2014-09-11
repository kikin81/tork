app.directive('googleMap', ['gMapsService',
    function(gMapsService) {
        return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                gMapsService.then(function() {
                    var mapOptions = {
                        zoom: 13,
                        center: new google.maps.LatLng(37.0000, -120.0000)
                    };
                    scope.map = new google.maps.Map(elem[0], mapOptions);
                    scope.polys = [];
                    for (d in scope.data) {
                        var coord = new google.maps.LatLng(scope.data[d].Latitude, scope.data[d].Longitude);
                        scope.polys.push(coord);
                    }
                    scope.map.setCenter(scope.polys[0]);
                    scope.p = new google.maps.Polyline({
                        path: scope.polys,
                        geodesic: true,
                        strokeColor: '#5E778D',
                        strokeOpacity: 1.0,
                        strokeWeight: 4,
                        map: scope.map
                    });
                });
            }
        };
    }
]);

app.directive('d3Plot', function() {
    return {
        restrict: 'EA',
        link: function(scope, elem, attrs) {
            var pdata = [];
            var dformat = d3.time.format('%m/%d/%Y %H:%M:%S.%L');
            for (d in scope.data) {
                pdata.push([dformat.parse(d), scope.data[d].Speed]);
            }
            scope.pdata = pdata;
            var barWidth = 40;
            var width = (barWidth * 3) * pdata.length;
            var height = 100;
            var x = d3.time.scale().range(pdata[0][0], pdata[pdata.length - 1][0]);
            var y = d3.scale.linear().domain([0, d3.max(pdata, function(datum, index) {
                    return pdata[index][1];
                })])
                .rangeRound([0, height]);
            var graph = d3.select(elem[0])
                .append('svg:svg').attr('width', width).attr('height', height);
            graph.selectAll("div").data(pdata).enter().append('svg:rect')
                .attr('x', function(datum, index) {
                    return index * (barWidth * 2)
                })
                .attr('y', function(datum) {
                    return height - datum[1];
                })
                .attr('height', function(datum) {
                    return datum[1]
                })
                .attr('width', barWidth)
                .attr('fill', '#5E778D');
            graph.selectAll("text").data(pdata).enter().append('svg:text')
                .attr('x', function(datum, index) {
                    return index * (barWidth * 2) + barWidth
                })
                .attr('y', function(datum) {
                    return height - datum[1];
                })
                .attr('dx', -barWidth / 2)
                .attr('dy', '1.2em')
                .attr('text-anchor', 'middle')
                .text(function(datum) {
                    var s = datum[1].split('.');
                    return s[0] + '.' + s[1].substring(0, 1);
                })
                .attr('fill', '#FFF');
            scope.graph = graph;
        }
    }
});