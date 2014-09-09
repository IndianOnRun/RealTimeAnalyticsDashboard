// use to set the colors of the lines
function getColor(name) {
    switch (name) {
        case 'CSA':
            return '#ff2200';
        case 'IIO':
            return '#a69553';
        case 'IIA':
            return '#0022ff';
        case 'CAT':
            return '#ff9180';
        case 'RAA':
            return '#e5ff80';
        case 'O2W':
            return '#993d00';
        case 'W2O':
            return '#454d26';
        case 'LOO':
            return '#400011';
        case 'LOA':
            return '#7fff80';
        case 'OWW':
            return '#660099';
        default:
            return '#CCCCCC';
    }
}

function stringToDate(date_string) {
    var date_string_arr = date_string.split('-');
    var year = 0;
    var month = 0;
    var date = 0;
    var hour = 0;
    var min = 0;
    switch (date_string_arr.length) {
        case 5:
            min = date_string_arr[4];
        case 4:
            hour = date_string_arr[3];
        case 3:
            date = date_string_arr[2];
        case 2:
            month = date_string_arr[1]-1;
        case 1:
            year = date_string_arr[0];
    }
    return new Date(year, month, date, hour, min);
}

function appendGraph(x, y, datum, names, vert_line) {
    return d3.select('.graph-container').append('svg')
    .on('mousemove', function() { mousemove(this, x, y, datum, names, vert_line[0]); })
    .on('mouseout', function() { mouseout(vert_line[0]); })
    .on('mouseover', function() { mouseover(vert_line[0]); })
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

function appendLiveGraph() {
    return d3.select('.graph-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

function appendPathClip(graph, tu) {
    graph.append('defs').append('clipPath')
    .attr('id', tu + '-path-clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height+10);
}

function appendVertLine(clipPath) {
    return clipPath.append('line')
        .attr('class', 'vert-line')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('visibility', 'hidden');
}

function appendLivePathClip(graph, tu) {
    graph.append('defs').append('clipPath')
    .attr('id', tu + '-path-clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height+25);
}

function appendXAxis(graph, x, y, tu) {
    return graph.append('g')
    .attr('class', 'x axis')
    .call(d3.svg.axis().scale(x).orient('bottom'))
    .attr('transform', 'translate(0,' + y(0) + ')');
}

function appendYAxis(graph, y) {
    return graph.append('g')
    .attr('class', 'y axis')
}

function appendPath(clipPath, data, line, name, tu) {
    return clipPath.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke', getColor(name));
}

function appendPoints(clipPath, data, x, y, name, tu) {
    var points = clipPath.append('g')
        .attr('class', 'line-points')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', function(d) { return x(stringToDate(d.x + '')); })
        .attr('cy', function(d) { return y(d.y); })
        .attr('r', 3.5)
        .style('fill', 'white')
        .style('stroke', getColor(name));

    points.append('svg:title')
        .text(function(d) { return d.y; });

    return points;
}

function createGraph(x, y, line, tu) {
    var datum = [];
    var names = [];
    var vert_line = [];
    var graph = appendGraph(x, y, datum, names, vert_line);
    appendPathClip(graph, tu);
    var x_axis = appendXAxis(graph, x, y);
    var y_axis = appendYAxis(graph, y);
    var clip = graph.append('g')
        .attr('clip-path', 'url(#' + tu + '-path-clip)');
    vert_line.push(appendVertLine(clip));
    var paths = [];
    return {
        graph: graph,
        x: x,
        y: y,
        x_axis: x_axis,
        y_axis: y_axis,
        path_clip: clip,
        paths: paths,
        datum: datum,
        names: names
    };
}

function createLiveGraph(x, y, line, tu) {
    var graph = appendLiveGraph();
    appendLivePathClip(graph, tu);
    var clip = graph.append('g')
        .attr('clip-path', 'url(#' + tu + '-path-clip)');
    var x_axis = appendXAxis(clip, x, y);
    var y_axis = appendYAxis(graph, y);
    var paths = [];
    var datum = [];
    var names = [];
    return {
        graph: graph,
        x: x,
        y: y,
        x_axis: x_axis,
        y_axis: y_axis,
        path_clip: clip,
        paths: paths,
        datum: datum,
        names: names
    };
}

// fill all empty data points with zero
function fillZero(data, start, end, tu) {
    var cur = new Date(start.valueOf());
    cur.setMilliseconds(0);
    cur.setSeconds(0);
    if (tu == 'minute') {
        for (var i = 0; i < data.length; i++) {
            var dateArr = data[i].x.split('-');
            var dataDate = new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3], dateArr[4]);
            while (cur.valueOf() < dataDate.valueOf()) {
                data.splice(i, 0, {x: cur.getFullYear() + '-'
                                    + (cur.getMonth()+1) + '-'
                                    + cur.getDate() + '-'
                                    + cur.getHours() + '-'
                                    + cur.getMinutes(),
                                   y: 0})
                cur = d3.time.minute.offset(cur, 1);
                i++;
            }
            cur = d3.time.minute.offset(cur, 1);
        }
        while (cur.valueOf() < end.valueOf()) {
            data.push({x: cur.getFullYear() + '-'
                                + (cur.getMonth()+1) + '-'
                                + cur.getDate() + '-'
                                + cur.getHours() + '-'
                                + cur.getMinutes(),
                               y: 0})
            cur = d3.time.minute.offset(cur, 1);
        }
    } if (tu == 'hour') {
        cur.setMinutes(0);
        for (var i = 0; i < data.length; i++) {
            var dateArr = data[i].x.split('-');
            var dataDate = new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3]);
            while (cur.valueOf() < dataDate.valueOf()) {
                data.splice(i, 0, {x: cur.getFullYear() + '-'
                                    + (cur.getMonth()+1) + '-'
                                    + cur.getDate() + '-'
                                    + cur.getHours(),
                                   y: 0})
                cur = d3.time.hour.offset(cur, 1);
                i++;
            }
            cur = d3.time.hour.offset(cur, 1);
        }
        while (cur.valueOf() < end.valueOf()) {
            data.push({x: cur.getFullYear() + '-'
                                + (cur.getMonth()+1) + '-'
                                + cur.getDate() + '-'
                                + cur.getHours(),
                               y: 0})
            cur = d3.time.hour.offset(cur, 1);
        }
    } else if (tu == 'day') {
        cur.setMinutes(0);
        cur.setHours(0);
        for (var i = 0; i < data.length; i++) {
            var dateArr = data[i].x.split('-');
            var dataDate = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
            while (cur.valueOf() < dataDate.valueOf()) {
                data.splice(i, 0, {x: cur.getFullYear() + '-'
                                    + (cur.getMonth()+1) + '-'
                                    + cur.getDate(),
                                   y: 0})
                cur = d3.time.day.offset(cur, 1);
                i++;
            }
            cur = d3.time.day.offset(cur, 1);
        }
        while (cur.valueOf() < end.valueOf()) {
            data.push({x: cur.getFullYear() + '-'
                                + (cur.getMonth()+1) + '-'
                                + cur.getDate(),
                               y: 0})
            cur = d3.time.day.offset(cur, 1);
        }
    } else if (tu == 'month') {
        cur.setMinutes(0);
        cur.setHours(0);
        cur.setDate(0);
        for (var i = 0; i < data.length; i++) {
            var dateArr = data[i].x.split('-');
            var dataDate = new Date(dateArr[0], dateArr[1]-1);
            while (cur.valueOf() < dataDate.valueOf()) {
                data.splice(i, 0, {x: cur.getFullYear() + '-'
                                    + (cur.getMonth()+1),
                                   y: 0})
                cur = d3.time.month.offset(cur, 1);
                i++;
            }
            cur = d3.time.month.offset(cur, 1);
        }
        while (cur.valueOf() < end.valueOf()) {
            data.push({x: cur.getFullYear() + '-'
                                + (cur.getMonth()+1),
                               y: 0})
            cur = d3.time.month.offset(cur, 1);
        }
    } else if (tu == 'year') {
        cur.setMinutes(0);
        cur.setHours(0);
        cur.setDate(0);
        cur.setMonth(0);
        for (var i = 0; i < data.length; i++) {
            var dataDate = new Date(data[i].x);
            while (cur.valueOf() < dataDate.valueOf()) {
                data.splice(i, 0, {x: cur.getFullYear(),
                                   y: 0})
                cur = d3.time.year.offset(cur, 1);
                i++;
            }
            cur = d3.time.year.offset(cur, 1);
            i++;
        }
        while (cur.valueOf() < end.valueOf()) {
            data.splice(i, 0, {x: cur.getFullYear(),
                               y: 0})
            cur = d3.time.year.offset(cur, 1);
            i++;
        }
    }
}

// request the data from rest service and draw data lines
function initStaticGraph(group, line, start, end, tu) {
    $.ajax({
        url: 'http://jodhpur.indigoconsulting.com:8282/octrace/services/reporting/ts/' + tu + '/any',
        type: 'GET',
        data: 'start=' + start.getFullYear() + '-'
                       + (start.getMonth()+1) + '-'
                       + start.getDate() + '-'
                       + start.getHours() + '-'
                       + start.getMinutes() + '-'
                       + start.getSeconds(),
        success: function(response) {
            var max = 0;
            for (var i = 0; i < response.length; i++) {
                var data;
                if (response[i] == null) {
                    // no data for this time period, render the y-axis and return
                    group.y.domain([0, 100]);
                    group.y_axis.call(d3.svg.axis().scale(group.y).orient('left').ticks(6));
                    break;
                } else {
                    data = response[i].data;
                }
                var temp = findMax(data);
                if (temp > max) {
                    max = temp;
                    group.y.domain([0, max]);
                    group.y_axis.call(d3.svg.axis().scale(group.y).orient('left').ticks(6));
                }
                fillZero(data, start, end, tu);
                group.paths.push(appendPath(group.path_clip, data, line, response[i].name, tu));
                appendPoints(group.path_clip, data, group.x, group.y, response[i].name, tu);
                group.datum.push(data);
                group.names.push(response[i].name);
            }
        }
    });
}

// returns the max value in the dataset +10%
// used to set the range of the graphs
function findMax(arr) {
    var max = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].y > max) {
            max = arr[i].y;
        }
    }
    return max*1.1;
}

function mousemove(elem, x, y, datum, names, vert_line) {
    coords = d3.mouse(elem);
    coords[0] -= margin.left;
    var cur_d = x.invert(coords[0]);
    var snap_d;
    var idx = 0;

    for (var i = 0; i < datum.length; i++) {
        if (datum[i].length > 1) {
            var min = Math.abs(cur_d.valueOf());
            for (var k = 0; k < datum[i].length; k++) {
                var temp = Math.abs(cur_d.valueOf() - stringToDate(datum[i][k].x + '').valueOf());
                if (temp < min) {
                    min = temp;
                    idx = k;
                    snap_d = stringToDate(datum[i][k].x + '');
                }
            }
        }
    }

    var table = d3.select('.sidebar').select('.legend').select('table');
    table.selectAll('tr').select('.data').text('0');
    for (var i = 0; i < datum.length; i++) {
        table.select('.' + names[i])
            .select('.data')
            .text(datum[i][idx].y);
    }

    vert_line.attr('x1', x(snap_d)).attr('x2', x(snap_d));
}

function mouseout(vert_line) {
    var table = d3.select('.sidebar').select('.legend').select('table');
    table.selectAll('tr').select('.data').text('');
    vert_line.attr('visibility', 'hidden');
}

function mouseover(vert_line) {
    vert_line.attr('visibility', 'visible');
}