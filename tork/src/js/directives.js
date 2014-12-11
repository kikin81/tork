var colors = ['648C3B', 'D7D99A', 'D9B959', '261105', '59130C'];
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
                        var mapOptions = {
                            zoom: 9,
                            center: new google.maps.LatLng(37.0000, -120.0000)
                        };
                        scope.map = new google.maps.Map(elem[0], mapOptions);
                        if (angular.isUndefined(data)) return;
                        scope.polys = [];
                        angular.forEach(data, function(row) {
                            if (!isNaN(row.Latitude) && !isNaN(row.Longitude)) {
                                var lat = row.Latitude;
                                var lng = row.Longitude;
                                var coord = new google.maps.LatLng(lat, lng);
                                scope.polys.push(coord);
                            }
                        });
                        if (angular.isDefined(scope.polys[0])) {
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
                        }
                    });
                }
                return scope.renderMap([]);
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
            scope.graph = d3.select(elem[0])
                .append('svg:svg')
                .attr('width', "100%")
                .attr('height', height);

            window.onresize = function() {
                return scope.$apply();
            };

            scope.$watch('data', function(newVals, oldVals) {
                return scope.render(newVals);
            }, true);
            scope.$watch('selection', function(newVals, oldVals) {
                return scope.render(newVals);
            }, true);

            scope.render = function(data) {
                if (angular.isUndefined(data)) return;
                var width = elem[0].offsetWidth - 30;
                var time = scope.timeScale;
                if (angular.isUndefined(time)) return;
                var selectedFields = scope.selection;
                scope.xS = d3.time.scale().domain([time[0], time[time.length - 2]])
                    .range([dPad, width - dPad]);
                scope.yS = d3.scale.linear().domain([0, d3.max(d3.entries(scope.data), function(datum) {
                        var fields = [];
                        for (var x in selectedFields) {
                            fields.push(datum.value[selectedFields[x]]);
                        }
                        return d3.max(fields);
                    })])
                    .rangeRound([height - dPad, dPad]);
                var zoom = d3.behavior.zoom()
                    .x(scope.xS)
                    .y(scope.yS)
                    .scaleExtent([1, 32])
                    .on("zoom", updateGraph);
                scope.graph = scope.graph.call(zoom);
                drawLines(scope);

                if (angular.isUndefined(scope.xAxisGroup)) {
                    scope.xAxisGroup = scope.graph.append('g')
                        .attr("transform", "translate(0," + (height - dPad) + ")")
                        .attr('class', 'x axis');
                    scope.yAxisGroup = scope.graph.append('g')
                        .attr('class', 'y axis')
                        .attr("transform", "translate(" + dPad + ",0)");
                }
                scope.xAxis = d3.svg.axis().scale(scope.xS).orient('bottom');
                scope.yAxis = d3.svg.axis().scale(scope.yS).orient('left').tickSize(3, 0, 0);

                function updateAxis() {
                    scope.graph.select('.x.axis').call(scope.xAxis);
                    scope.graph.select('.y.axis').call(scope.yAxis);
                }

                function updateGraph() {
                    updateAxis();
                    drawLines(scope);
                }
                updateAxis();
            }
        }
    }
});

function drawLines(scope) {
    var selectedFields = scope.selection;
    if (angular.isUndefined(scope.renderedLines)) {
        scope.renderedLines = scope.graph.append('g');
    }
    scope.renderedLines.selectAll('path').remove();
    for (var x in selectedFields) {
        var line = d3.svg.line()
            .x(function(d) {
                return scope.xS(d.value['Time']);
            })
            .y(function(d) {
                return scope.yS(d.value[selectedFields[x]]);
            })
            .interpolate('linear');
        var path = scope.renderedLines.append('path')
            .attr("d", line(d3.entries(scope.data)))
            .attr('class', 'path');
        var totalLength = path.node().getTotalLength();
        path.attr('stroke', '#' + colors[x % 5]);
        // .attr("stroke-dasharray", totalLength + " " + totalLength)
        // .attr("stroke-dashoffset", totalLength)
        // .transition().duration(2000).ease("easeInCubic")
        // .attr("stroke-dashoffset", 0);
        // scope.lineGroup[selectedFields[x]] = path;
    }
}