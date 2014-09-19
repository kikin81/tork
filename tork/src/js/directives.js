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
                        strokeColor: '#8096A5',
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
            for (d in scope.data) {
                pdata.push([new Date(d), scope.data[d].Speed]);
            }
            scope.pdata = pdata;
            var barWidth = 10;
            //30 is boostrap padding
            var width = elem[0].offsetWidth - 30;
            var height = 200;
            var dPad = 20;
            var xScale = d3.time.scale().domain([pdata[0][0], pdata[pdata.length - 1][0]])
                .range([dPad, width - dPad]);
            var yScale = d3.scale.linear().domain([0, d3.max(pdata, function(datum) {
                    return datum[1];
                })])
                .rangeRound([height - dPad, dPad]);
            var dotScale = d3.scale.linear().domain([0, d3.max(pdata, function(datum) {
                    return datum[1];
                })]).rangeRound([0 , 10]);

            var graph = d3.select(elem[0])
                .append('svg:svg').attr('width', width).attr('height', height);
            graph.selectAll("circle").data(pdata).enter().append('svg:circle')
                .attr('cx', function(d) {
                    return xScale(d[0])
                })
                .attr('cy', function(d) {
                    return yScale(d[1])
                })
                .attr('r', function(d){
                    return dotScale(d[1])
                })
                .attr('class', 'bars');
            graph.selectAll("text").data(pdata).enter().append('svg:text')
                .attr('x', function(d) {
                    return xScale(d[0])
                })
                .attr('y', function(d) {
                    return yScale(d[1])
                })
                .attr('title', function(d) {
                    return d[1]
                })
                .text(function(d) {
                    return Math.round(Number(d[1]));
                });
            scope.graph = graph;
        }
    }
});