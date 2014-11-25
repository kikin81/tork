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
                            zoom: 9,
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
                        var bounds = new google.maps.LatLngBounds();
                        bounds.extend(scope.polys[0]);
                        bounds.extend(scope.polys[scope.polys.length - 1]);
                        scope.map.fitBounds(bounds)
                        scope.p = new google.maps.Polyline({
                            path: scope.polys,
                            geodesic: true,
                            strokeColor: '#428bca',
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
            var height = 350;
            var dPad = 30;
            var graph = d3.select(elem[0])
                .append('svg:svg')
                .attr('width', "100%")
                .attr('height', height);

            window.onresize = function() {
                return scope.$apply();
            };

            scope.$watch('data', function(newVals, oldVals) {
                return scope.render(newVals);
            }, true);

            scope.render = function(data) {
                if (angular.isUndefined(data)) return;
                var width = elem[0].offsetWidth - 30;
                var time = scope.timeScale;
                var xS = d3.time.scale().domain([time[0], time[time.length - 2]])
                    .range([dPad, width - dPad]);
                var yS = d3.scale.linear().domain([0, d3.max(d3.entries(data), function(datum) {
                        return datum.value['Speed (OBD)'];
                    })])
                    .rangeRound([height - dPad, dPad]);
                var line = d3.svg.line()
                    .x(function(d) {
                        return xS(d.value['Time']);
                    })
                    .y(function(d) {
                        return yS(d.value['Speed (OBD)']);
                    })
                    .interpolate('cardinal');
                var path = graph.append('path').attr("d", line(d3.entries(data))).attr('class', 'path');
                var totalLength = path.node().getTotalLength();
                path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .attr("stroke-dashoffset", 0);
                // var dots = graph.selectAll("g").data(data).enter().append('svg:circle')
                //     .style('fill-opacity', 0)
                //     .transition().duration(2500).ease('linear')
                //     .style("fill-opacity", 1)
                //     .attr('cx', function(d) {
                //         return xS(d.Time);
                //     })
                //     .attr('cy', function(d) {
                //         return yS(d.Speed);
                //     })
                //     .attr('r', function(d) {
                //         return 1;
                //     })
                //     .attr('class', 'dots');
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