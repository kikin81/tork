app.directive('googleMap', ['gMapsService',
    function(gMapsService) {
        return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.renderMap(newVals);
                }, true);
                scope.renderMap = function(data) {
                    gMapsService.then(function() {
                        if (typeof(data) === 'undefined') return;
                        var mapOptions = {
                            zoom: 13,
                            center: new google.maps.LatLng(37.0000, -120.0000)
                        };
                        scope.map = new google.maps.Map(elem[0], mapOptions);
                        scope.polys = [];
                        angular.forEach(data, function(row) {
                            if (!isNaN(row.Latitude) && !isNaN(row.Longitude)) {
                                var lat = row.Latitude;
                                var lng = row.Longitude;
                                var coord = new google.maps.LatLng(lat, lng);
                                scope.polys.push(coord);
                            }
                        });
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
            }
        };
    }
]);

app.directive('d3Plot', function() {
    return {
        restrict: 'EA',
        link: function(scope, elem, attrs) {
            var barWidth = 10;
            //30 is boostrap padding
            var width = elem[0].offsetWidth - 30;
            var height = 200;
            var dPad = 35;
            var graph = d3.select(elem[0])
                .append('svg:svg').attr('width', width).attr('height', height);

            scope.$watch('data', function(newVals, oldVals) {
                return scope.render(newVals);
            }, true);

            scope.render = function(data) {
                if (typeof(data) === 'undefined') return;
                var xS = d3.time.scale().domain([data[0].Time, data[data.length - 1].Time])
                    .range([dPad, width - dPad]);
                var yS = d3.scale.linear().domain([0, d3.max(data, function(datum) {
                        return datum.Speed;
                    })])
                    .rangeRound([height - dPad, dPad]);
                var line = d3.svg.line()
                    .x(function(d) {
                        return xS(d.Time);
                    })
                    .y(function(d) {
                        return yS(d.Speed);
                    })
                    .interpolate('cardinal');
                var path = graph.append('path').attr("d", line(data)).attr('class', 'path');
                var totalLength = path.node().getTotalLength();
                path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);
                var dots = graph.selectAll("g").data(data).enter().append('svg:circle')
                    .style('fill-opacity', 0)
                    .transition().duration(2500).ease('linear')
                    .style("fill-opacity", 1)
                    .attr('cx', function(d) {
                        return xS(d.Time);
                    })
                    .attr('cy', function(d) {
                        return yS(d.Speed);
                    })
                    .attr('r', function(d) {
                        return 2;
                    })
                    .attr('class', 'dots');
                graph.append('g')
                    .attr("transform", "translate(0," + (height - dPad) + ")")
                    .attr('class', 'axis')
                    .call(d3.svg.axis().scale(xS).orient('bottom'));
                graph.append('g')
                    .attr('class', 'axis')
                    .attr("transform", "translate(" + dPad + ",0)")
                    .call(d3.svg.axis().scale(yS).orient('left'));
                scope.graph = graph;
            }
        }
    }
});